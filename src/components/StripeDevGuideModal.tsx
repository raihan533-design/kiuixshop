import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Shield, Rocket, Mail, Code2, Globe } from 'lucide-react';

interface StripeDevGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StripeDevGuideModal: React.FC<StripeDevGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'deploy' | 'stripe' | 'email'>('stripe');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const vercelCode = `# 1. Push project to GitHub
git init
git add .
git commit -m "feat: initial KIUIXSHOP commit"
git remote add origin https://github.com/YOUR_USERNAME/kiuixshop.git
git push -u origin main

# 2. Deploy to Vercel (or Netlify)
# - Go to vercel.com -> "Add New Project" -> Import your GitHub repo
# - Build Command: npm run build
# - Output Directory: dist
# - Framework Preset: Vite`;

  const stripeBackendCode = `// api/create-checkout-session.js (Vercel Serverless Function or Node.js Express)
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items, customerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name, images: [item.image] },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: customerEmail,
      mode: 'payment',
      success_url: \`\${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}\`,
      cancel_url: \`\${req.headers.origin}/cart\`,
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`;

  const emailWebhookCode = `// Stripe Webhook to forward orders to kiuixshop@gmail.com
// Listen for 'checkout.session.completed'
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function onOrderCompleted(orderData) {
  await resend.emails.send({
    from: 'KIUIX Orders <orders@kiuixshop.com>',
    to: ['kiuixshop@gmail.com'], // Your official email!
    subject: \`⚡ New KIUIX Order #\${orderData.orderId} - \$\${orderData.total}\`,
    html: \`
      <h2>New Order Received!</h2>
      <p>Customer: \${orderData.customerName} (\${orderData.customerEmail})</p>
      <p>Total: \${orderData.total}</p>
    \`
  });
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Deployment & Stripe Integration Guide</h3>
              <p className="text-xs text-slate-400">আপনার KIUIXSHOP সাইট ডেপ্লয় এবং রিয়েল স্ট্রাইপ যুক্ত করার সহজ গাইড</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('stripe')}
            className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'stripe'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>1. Stripe Setup (পেমেন্ট কানেক্ট)</span>
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'deploy'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>2. 1-Click Deployment (Vercel/Netlify)</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>3. Order Email (kiuixshop@gmail.com)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {activeTab === 'stripe' && (
            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs space-y-2">
                <p className="font-bold text-blue-900">
                  কিভাবে আপনার রিয়েল Stripe অ্যাকাউন্ট যুক্ত করবেন:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li><strong>stripe.com</strong> এ গিয়ে একটি ফ্রি অ্যাকাউন্ট খুলুন বা লগইন করুন।</li>
                  <li>ড্যাশবোর্ডের <strong>Developers &rarr; API Keys</strong> থেকে <code className="bg-white px-1.5 py-0.5 rounded text-blue-950 font-mono">Publishable Key (pk_live_...)</code> এবং <code className="bg-white px-1.5 py-0.5 rounded text-blue-950 font-mono">Secret Key (sk_live_...)</code> কপি করুন।</li>
                  <li>প্রজেক্ট রুট ফাইলে <code className="bg-white px-1.5 py-0.5 rounded text-blue-950 font-mono">.env</code> তৈরি করে কিগুলো সেভ করুন:</li>
                </ol>
              </div>

              <div className="relative">
                <div className="bg-slate-900 text-slate-200 text-xs p-4 rounded-xl font-mono overflow-x-auto">
                  <div className="text-slate-400 mb-2">// .env file</div>
                  <div>VITE_STRIPE_PUBLIC_KEY=pk_live_51Pxxxxxxxxxxxx</div>
                  <div>STRIPE_SECRET_KEY=sk_live_51Pxxxxxxxxxxxx</div>
                  <div>MERCHANT_EMAIL=kiuixshop@gmail.com</div>
                </div>
                <button
                  onClick={() => copyToClipboard('VITE_STRIPE_PUBLIC_KEY=pk_test_xxx\nSTRIPE_SECRET_KEY=sk_test_xxx\nMERCHANT_EMAIL=kiuixshop@gmail.com', 1)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800"
                >
                  {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">রেডি সার্ভারলেস কোড (Vercel API Route):</p>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-200 text-[11px] p-4 rounded-xl font-mono overflow-x-auto">
                    {stripeBackendCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(stripeBackendCode, 2)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800"
                  >
                    {copiedIndex === 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <p className="font-bold text-slate-900">
                  Vercel বা Netlify-তে সম্পূর্ণ ফ্রিতে ডেপ্লয় করার নিয়ম:
                </p>
                <p className="text-slate-600">
                  এই KIUIXSHOP কোডটি সম্পূর্ণ প্রোডাকশন-রেডি। আপনি GitHub-এ পুশ করে 1 ক্লিকে Vercel-এ হোস্ট করতে পারবেন।
                </p>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-slate-200 text-xs p-4 rounded-xl font-mono overflow-x-auto">
                  {vercelCode}
                </pre>
                <button
                  onClick={() => copyToClipboard(vercelCode, 3)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800"
                >
                  {copiedIndex === 3 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                <p className="font-bold text-emerald-950">
                  অর্ডার আসলে আপনার মেইলে (<span className="text-blue-700">kiuixshop@gmail.com</span>) নোটিফিকেশন:
                </p>
                <p className="text-emerald-800">
                  যেকোনো কাস্টমার যখন পেমেন্ট করবে, Stripe Webhook ট্রিগার হয়ে সরাসরি আপনার জিমেইলে বিস্তারিত অর্ডারের চালান পাঠাবে।
                </p>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-slate-200 text-xs p-4 rounded-xl font-mono overflow-x-auto">
                  {emailWebhookCode}
                </pre>
                <button
                  onClick={() => copyToClipboard(emailWebhookCode, 4)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800"
                >
                  {copiedIndex === 4 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
