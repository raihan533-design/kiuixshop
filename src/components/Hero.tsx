import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Star,
  CreditCard
} from 'lucide-react';
import { Currency, Product, HeroConfig } from '../types';
import { CURRENCIES, PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

interface HeroProps {
  currentCurrency: Currency;
  products?: Product[];
  heroConfig?: HeroConfig;
  onExploreClick: () => void;
  onQuickView: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCurrency,
  products = DEFAULT_PRODUCTS,
  heroConfig,
  onExploreClick,
  onQuickView,
  onAddToCart
}) => {
  // Find featured product selected by Admin, or fall back to first product in catalog
  const heroProduct = (heroConfig?.featuredProductId
    ? products.find((p) => p.id === heroConfig.featuredProductId)
    : null) || products[0] || DEFAULT_PRODUCTS[0];

  const heroImage = heroConfig?.customImage || heroProduct.image;
  const heroBadge = heroConfig?.badgeText || 'NEW GENERATION 2026 LINEUP';
  const heroHeadline = heroConfig?.headline || 'Elevate Your Everyday';
  const heroHighlight = heroConfig?.headlineHighlight || 'Performance & Audio.';
  const heroSubtitle = heroConfig?.subtitle || 'Precision-engineered minimalism for creators, developers, and trendsetters. Designed for everyday excellence.';
  const heroFeaturePill = heroConfig?.featurePill || (heroProduct.features?.[0] || 'Premium Build Quality');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
      {/* Background ambient electric blue glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/5 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Super Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs animate-fade-in">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>{heroBadge}</span>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
              {heroHeadline} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                {heroHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {heroSubtitle}
            </p>

            {/* Key Value Proposition Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs font-medium text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 bg-white border border-slate-200/70 shadow-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                256-Bit Encrypted
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-slate-200/70 shadow-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                Free Worldwide
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-slate-200/70 shadow-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                30-Day Guarantee
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer group"
              >
                <span>Shop New Releases</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onQuickView(heroProduct.id)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Quick View Flagship</span>
              </button>
            </div>

            {/* Social Proof Mini Bar */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                <div className="h-8 w-8 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  +1.2k
                </div>
              </div>
              <div className="text-left text-xs text-slate-500">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="ml-1 text-slate-900 font-bold">4.9 / 5</span>
                </div>
                <span>Over 1,200+ satisfied customers worldwide</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Interactive Card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Floating Top Badge */}
            <div className="absolute -top-3 left-0 sm:-left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 animate-float">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fast Dispatch</p>
                <p className="text-[11px] sm:text-xs font-bold text-slate-900">24h Express Shipping</p>
              </div>
            </div>

            {/* Flagship Card Container */}
            <div className="relative group bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200/80 transition-all duration-500 hover:shadow-blue-500/10">
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="bg-blue-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {heroProduct.badge || 'FLAGSHIP SPOTLIGHT'}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {heroProduct.rating} ({heroProduct.reviewCount})
                </span>
              </div>

              {/* Main Product Showcase Image */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-50 aspect-4/3 flex items-center justify-center p-3 sm:p-4">
                <img
                  src={heroImage}
                  alt={heroProduct.name}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Instant overlay badge */}
                <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {heroFeaturePill}
                </div>
              </div>

              {/* Card Meta & Price */}
              <div className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                  {heroProduct.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {heroProduct.tagline}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-slate-950">
                      {CURRENCIES[currentCurrency].symbol}
                      {(heroProduct.price * CURRENCIES[currentCurrency].rate).toFixed(0)}
                    </span>
                    {heroProduct.originalPrice && (
                      <span className="ml-2 text-xs sm:text-sm text-slate-400 line-through">
                        {CURRENCIES[currentCurrency].symbol}
                        {(heroProduct.originalPrice * CURRENCIES[currentCurrency].rate).toFixed(0)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(heroProduct.id)}
                    className="bg-slate-950 hover:bg-blue-600 active:scale-95 text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Bottom Trust Badge */}
            <div className="absolute -bottom-3 right-0 sm:-right-4 z-20 bg-slate-950 text-white rounded-2xl p-2 sm:p-3 border border-slate-800 shadow-xl flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-xs font-bold text-white">SSL Verified</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400">100% Secure Transaction</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
