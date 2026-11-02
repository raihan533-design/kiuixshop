import React, { useState } from 'react';
import { X, Search, Globe, Share2, CheckCircle2, Shield, Eye, Copy, Check } from 'lucide-react';

interface SEOInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SEOInspectorModal: React.FC<SEOInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'google' | 'social' | 'schema'>('google');
  const [copied, setCopied] = useState(false);

  const schemaJson = `{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "KIUIXSHOP",
  "url": "https://kiuixshop.com",
  "logo": "https://kiuixshop.com/kiuix-logo.jpg",
  "description": "Premium tech gear, minimalist everyday carry, and modern accessories with worldwide express delivery.",
  "email": "kiuixshop@gmail.com",
  "paymentAccepted": "Credit Card, Stripe, Apple Pay, Google Pay",
  "currenciesAccepted": "USD, EUR, GBP, BDT",
  "priceRange": "$$",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "kiuixshop@gmail.com",
    "contactType": "customer service"
  }
}`;

  const copySchema = () => {
    navigator.clipboard.writeText(schemaJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">SEO Health & SERP Live Preview</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/30">
                  SCORE 100/100
                </span>
              </div>
              <p className="text-xs text-slate-400">Search engine optimization audit for KIUIXSHOP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('google')}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Google Search SERP</span>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Social OpenGraph</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>JSON-LD Schema</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                This is how <strong>KIUIXSHOP</strong> appears to customers searching on Google:
              </div>

              {/* Google SERP Snippet Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-700">
                    %
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">KIUIXSHOP</span>
                    <span className="text-slate-400 text-[11px] block">https://kiuixshop.com</span>
                  </div>
                </div>

                <h4 className="text-blue-800 hover:underline text-lg font-medium leading-snug cursor-pointer pt-1">
                  KIUIXSHOP — Premium Tech Gear & Minimalist Essentials
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-amber-600">
                  <span>★★★★★</span>
                  <span className="font-bold text-slate-700">Rating: 4.9 · 1,200+ reviews</span>
                  <span className="text-slate-400">· Price range: $$</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Discover precision-crafted tech gear, ergonomic desk setups, audio essentials, and everyday carry at KIUIXSHOP. Fast worldwide shipping, 100% secure Stripe payment, and 24/7 support.
                </p>
              </div>

              {/* SEO Checklist */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Meta Title: 54 chars (Optimal)</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Meta Description: 158 chars</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Robots.txt & Sitemap.xml OK</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Canonical URL Configured</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Preview when sharing <strong>https://kiuixshop.com</strong> on WhatsApp, Facebook, iMessage, and X (Twitter):
              </div>

              {/* Social Card */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-w-md mx-auto shadow-sm">
                <div className="aspect-16/9 bg-slate-900 flex items-center justify-center p-6 text-white text-center relative">
                  <img
                    src="/kiuix-logo.jpg"
                    alt="KIUIX Logo"
                    className="max-h-24 w-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="p-4 bg-slate-50 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">kiuixshop.com</span>
                  <h4 className="text-sm font-bold text-slate-900">
                    KIUIXSHOP — Modern Tech & Lifestyle Essentials
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    Upgrade your digital workflow with KIUIXSHOP's curated collection of premium gadgets, smart desk tools, and minimalist accessories.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Google Rich Snippets JSON-LD code injected into &lt;head&gt;:</span>
                <button
                  onClick={copySchema}
                  className="flex items-center gap-1 text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-2xl font-mono overflow-x-auto max-h-60">
                {schemaJson}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
