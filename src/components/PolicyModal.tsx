import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Mail, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PolicyModalProps {
  initialTab?: 'terms' | 'privacy';
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ initialTab = 'terms', onClose }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              {activeTab === 'terms' ? <FileText className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {activeTab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h3>
              <p className="text-xs text-slate-500">
                Official KIUIXSHOP Store Legal Documentation • Last updated: October 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'terms'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'privacy'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-600 space-y-6 leading-relaxed">
          {activeTab === 'terms' ? (
            <div className="space-y-6">
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  1. Agreement to Terms
                </h4>
                <p>
                  By accessing or purchasing from <strong>KIUIXSHOP</strong> (accessible via kiuixshop.vercel.app or kiuixshop-store.vercel.app), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should discontinue use of our site immediately.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  2. Products, Pricing & Currency
                </h4>
                <p>
                  All products displayed on KIUIXSHOP are subject to availability. We reserve the right to modify prices, discontinue items, or adjust inventory without prior notice. Product pricing is presented in global currencies (USD, EUR, GBP). Currency conversion rates applied at checkout are handled through real-time financial protocols.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  3. Secure Payments & Billing
                </h4>
                <p>
                  Payments on KIUIXSHOP are processed through enterprise-grade 256-bit SSL encrypted payment gateways (including Stripe, Visa, MasterCard, American Express, Apple Pay, and Google Pay). We never store your full payment card number on our servers. You agree to provide current, complete, and accurate purchase and account information for all orders.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  4. Shipping & Delivery
                </h4>
                <p>
                  KIUIXSHOP ships globally with express courier partners. Typical dispatch occurs within 24 to 48 hours of order verification. Tracking details are automatically dispatched to the customer email provided at checkout.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  5. 30-Day Guarantee & Returns Policy
                </h4>
                <p>
                  We stand by the craftsmanship of every product. If you receive a defective or unsatisfactory item, you may request a replacement or full refund within 30 days of receipt by emailing our support team at <a href="mailto:kiuixshop@gmail.com" className="text-blue-600 font-semibold underline">kiuixshop@gmail.com</a> with your order number.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  6. Intellectual Property
                </h4>
                <p>
                  The KIUIX trademark, custom logo iconography, product graphics, interface designs, and digital assets are proprietary property of KIUIXSHOP. Unauthorized reproduction or commercial re-distribution is strictly prohibited.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  1. Information We Collect
                </h4>
                <p>
                  When you visit or place an order at KIUIXSHOP, we collect minimal personal information necessary to deliver your purchase: your name, shipping address, contact email address, and order transaction details.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  2. How We Use Your Information
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To process, fulfill, and deliver your hardware orders.</li>
                  <li>To dispatch real-time payment confirmation and shipping tracking notices.</li>
                  <li>To handle warranty claims, returns, and customer care inquiries.</li>
                  <li>To prevent fraud and maintain the security of our store.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  3. Payment Security & Encryption
                </h4>
                <p>
                  All financial transactions are tokenized and processed via PCI-DSS Level 1 certified infrastructure. KIUIXSHOP neither holds nor has access to raw credit card numbers or banking passwords.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  4. Cookies & Analytics
                </h4>
                <p>
                  We use strictly necessary browser storage cookies to maintain your shopping cart, preferred currency, and interface settings. We do not sell your personal data to third-party ad brokers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  5. Your Rights (GDPR & CCPA)
                </h4>
                <p>
                  You have the right to access, rectify, or request complete deletion of any personal records maintained by KIUIXSHOP. To exercise this right, simply contact us at <a href="mailto:kiuixshop@gmail.com" className="text-blue-600 font-semibold underline">kiuixshop@gmail.com</a>.
                </p>
              </section>
            </div>
          )}

          {/* Contact Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Questions regarding our legal policies? Email: <strong>kiuixshop@gmail.com</strong></span>
            </div>
            <a
              href="mailto:kiuixshop@gmail.com"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Contact Legal Team <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            KIUIXSHOP • Verified Merchant Documentation
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
