import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey || 'placeholder_for_init');

const app = express();
const PORT = process.env.PORT || 4242;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const OFFICIAL_EMAIL = process.env.MERCHANT_EMAIL || 'kiuixshop@gmail.com';

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', merchant: OFFICIAL_EMAIL, keySet: !!stripeSecretKey });
});

// Create Dynamic Stripe Checkout Session (Accepts cart items or custom amounts)
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customerEmail, discountPercent } = req.body;

    let line_items = [];

    if (items && Array.isArray(items) && items.length > 0) {
      line_items = items.map((item) => {
        const unitAmount = Math.max(
          50,
          Math.round(item.product.price * (1 - (discountPercent || 0)) * 100)
        );
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              images: item.product.image ? [item.product.image] : [],
              description: `Finish: ${item.selectedColor || 'Standard'}`,
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity || 1,
        };
      });
    } else {
      // Fallback single item
      const amountUSD = Number(req.body.amountUSD) || 50;
      line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'KIUIX Premium Gear Order',
              description: 'Official checkout at KIUIXSHOP (kiuixshop@gmail.com)',
            },
            unit_amount: Math.round(amountUSD * 100),
          },
          quantity: 1,
        },
      ];
    }

    // Create Stripe Checkout Session
    // When payment_method_types is omitted, Stripe automatically displays all methods
    // enabled in your Dashboard (Cards, Apple Pay, Google Pay, Klarna, Cash App, etc.)
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: `${CLIENT_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/?canceled=true`,
    });

    res.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error('Stripe Session Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// Printdoors Open API Fulfillment & Catalog Integration
// Documentation: https://doc.printdoors.com/web/#/637765744/264741693
// =========================================================================
const PRINTDOORS_API = 'https://openapi.printdoors.com';

// Obtain Access Token
app.post('/api/printdoors/auth', async (req, res) => {
  try {
    const { app_key, app_secret } = req.body;
    if (!app_key || !app_secret) {
      return res.status(400).json({ error: 'Missing app_key or app_secret' });
    }

    const response = await fetch(`${PRINTDOORS_API}/open/v1/accessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ app_key, app_secret }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Printdoors products
app.get('/api/printdoors/products', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });

    const page = req.query.page || 1;
    const perPage = req.query.per_page || 50;

    const response = await fetch(`${PRINTDOORS_API}/open/v1/product?page=${page}&per_page=${perPage}`, {
      headers: { Authorization: auth },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Printdoors order for fulfillment
app.post('/api/printdoors/order', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });

    const response = await fetch(`${PRINTDOORS_API}/open/v1/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ KIUIXSHOP Stripe & Printdoors Server is Active!`);
  console.log(`🌐 Port: http://localhost:${PORT}`);
  console.log(`💳 Key connected: ${stripeSecretKey.slice(0, 14)}...`);
  console.log(`🖨️ Printdoors POD: https://openapi.printdoors.com`);
  console.log(`📧 Receipts destination: ${OFFICIAL_EMAIL}`);
  console.log(`======================================================\n`);
});
