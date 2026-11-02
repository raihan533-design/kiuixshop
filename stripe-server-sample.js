/**
 * KIUIXSHOP - Universal Stripe Multi-Payment Backend
 * 
 * Supports:
 *   - Cards (Visa, Mastercard, Amex, Discover)
 *   - Mobile Wallets (Apple Pay, Google Pay, Cash App Pay, Link)
 *   - Buy Now Pay Later (Klarna, Afterpay, Affirm)
 *   - Bank Transfers (ACH Direct Debit, iDEAL, SEPA, Bancontact)
 * 
 * To run:
 *   1. npm install express stripe cors dotenv nodemailer
 *   2. Set your keys in .env
 *   3. node stripe-server-sample.js
 */

import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const PORT = process.env.PORT || 4242;
const OFFICIAL_EMAIL = 'kiuixshop@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || OFFICIAL_EMAIL,
    pass: process.env.EMAIL_PASS || '',
  },
});

app.use(cors());

// Webhook endpoint (Raw body parser required for Stripe signature verification)
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        event = JSON.parse(req.body.toString());
      }
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // When payment succeeds across ANY payment method (Card, Klarna, Cash App, Google Pay, etc.)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`Payment confirmed for Order: ${session.id}`);

      // Dispatch Payment Receipt email to customer and store owner (kiuixshop@gmail.com)
      try {
        await transporter.sendMail({
          from: `"KIUIX Orders" <${OFFICIAL_EMAIL}>`,
          to: [session.customer_details?.email, OFFICIAL_EMAIL],
          subject: `⚡ KIUIX Payment Receipt - Order #${session.id.slice(-8).toUpperCase()}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
              <h2 style="color: #0f172a; margin-top: 0;">Payment Receipt Confirmed!</h2>
              <p style="color: #475569; font-size: 14px;">Thank you for your order with KIUIXSHOP.</p>
              
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p><strong>Order ID:</strong> ${session.id}</p>
                <p><strong>Customer:</strong> ${session.customer_details?.name || 'Valued Customer'}</p>
                <p><strong>Customer Email:</strong> ${session.customer_details?.email}</p>
                <p><strong>Paid Total:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
                <p><strong>Payment Status:</strong> Paid (${session.payment_status})</p>
              </div>

              <p style="font-size: 12px; color: #94a3b8;">
                Have questions? Reach us anytime at <a href="mailto:${OFFICIAL_EMAIL}">${OFFICIAL_EMAIL}</a>.
              </p>
            </div>
          `,
        });
        console.log(`Invoice dispatched to ${session.customer_details?.email} & ${OFFICIAL_EMAIL}`);
      } catch (mailErr) {
        console.warn(`Email notice: ${mailErr.message}`);
      }
    }

    res.json({ received: true });
  }
);

// Standard JSON middleware
app.use(express.json());

// Create Universal Multi-Payment Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  const { items, customerEmail, discountPercent } = req.body;

  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.image],
          description: `Finish: ${item.selectedColor}`,
        },
        unit_amount: Math.round(item.product.price * (1 - (discountPercent || 0)) * 100),
      },
      quantity: item.quantity,
    }));

    // Universal Multi-Payment Stripe Session
    // automatic_payment_methods enables Cards, Apple Pay, Google Pay, Klarna, Cash App, Afterpay, Bank Transfers, etc.!
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
      success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ KIUIX Multi-Payment Stripe Gateway active on http://localhost:${PORT}`);
  console.log(`Configured for merchant: ${OFFICIAL_EMAIL}`);
});
