import React from 'react';
import { ShieldCheck, Truck, Headphones, RotateCcw, Zap, Sparkles } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: '256-Bit Encrypted Checkout',
      description: 'Bank-level 256-bit SSL encryption. We accept all major cards, Apple Pay, Google Pay and secure link checkout.'
    },
    {
      icon: Truck,
      title: 'Free Worldwide Express',
      description: 'Complimentary expedited international air shipping on all orders over $50 with real-time tracking.'
    },
    {
      icon: RotateCcw,
      title: '30-Day Money-Back',
      description: 'Love your KIUIX gear or return it within 30 days for an instant, no-hassle full refund.'
    },
    {
      icon: Headphones,
      title: 'Direct 24/7 Human Care',
      description: 'Have a question? Reach out directly to our founders and support team at kiuixshop@gmail.com.'
    }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/50">
            THE KIUIX PROMISE
          </span>
          <h2 className="text-3xl font-black text-slate-950 mt-3 tracking-tight">
            Engineered For Excellence. Backed By Trust.
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every product in the KIUIX ecosystem is crafted with aerospace materials and backed by industry-leading warranties.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {f.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-[11px] font-bold text-blue-600">
                  <span>Learn more</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
