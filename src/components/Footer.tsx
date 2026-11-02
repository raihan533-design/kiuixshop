import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, ArrowRight, ShieldCheck, Heart, CheckCircle2 } from 'lucide-react';
import { CategoryItem } from '../types';
import { DEFAULT_CATEGORIES } from '../data/products';

interface FooterProps {
  categories?: CategoryItem[];
  onSelectCategory: (cat: string) => void;
  onOpenStripeGuide: () => void;
  onOpenSeoInspector: () => void;
  onOpenAdminLock: () => void;
  onOpenPolicy?: (tab: 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories = DEFAULT_CATEGORIES,
  onSelectCategory,
  onOpenStripeGuide,
  onOpenSeoInspector,
  onOpenAdminLock,
  onOpenPolicy,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="md" variant="dark" showShopBadge={true} />
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              KIUIXSHOP is the home of precision-crafted tech gear, ergonomic workspace solutions, and minimalist everyday carry. Built for creators and developers worldwide.
            </p>

            <div className="pt-2 text-xs text-slate-300">
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider mb-0.5">Official Support Email</span>
              <a
                href="mailto:kiuixshop@gmail.com"
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
              >
                kiuixshop@gmail.com
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (Dynamically rendered) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Collections</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Guides */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Store Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenStripeGuide}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer text-blue-400 font-semibold"
                >
                  <span>⚡ Stripe Setup Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSeoInspector}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer text-blue-400 font-semibold"
                >
                  <span>🌐 SEO Live Preview</span>
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('terms')}
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('privacy')}
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('terms')}
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer"
                >
                  30-Day Money-Back Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Join The KIUIX VIP Circle</h4>
            <p className="text-xs text-slate-400">
              Subscribe for exclusive secret drop alerts and unlock 10% off your first checkout.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-blue-900/40 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Welcome! Use code <strong>KIUIX10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Zero spam. Unsubscribe at any time.
                </span>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              © {new Date().getFullYear()} <strong className="text-slate-300 font-bold">KIUIXSHOP</strong>. All rights reserved.
            </span>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onOpenPolicy?.('terms')}
              className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer text-[11px] underline underline-offset-2"
            >
              Terms & Conditions
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onOpenPolicy?.('privacy')}
              className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer text-[11px] underline underline-offset-2"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">|</span>
            {/* Discreet Merchant Staff Access for the Owner */}
            <button
              onClick={onOpenAdminLock}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
              title="Merchant Staff Management Portal"
            >
              <span>🔒 Staff Portal</span>
            </button>
          </div>

          {/* Payment Provider Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              Stripe Verified
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-blue-400">
              VISA
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-amber-500">
              Mastercard
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-sky-400">
              Amex
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
              Apple Pay
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
              Google Pay
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
