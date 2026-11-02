import React, { useState } from 'react';
import { Product, Currency } from '../types';
import { CURRENCIES } from '../data/products';
import { X, Star, ShieldCheck, Check, ShoppingBag, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  currentCurrency: Currency;
  onClose: () => void;
  onAddToCart: (productId: string, quantity: number, color: string) => void;
  onProceedToCheckout: (product: Product, quantity: number, color: string) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  currentCurrency,
  onClose,
  onAddToCart,
  onProceedToCheckout
}) => {
  if (!product) return null;

  const gallery: string[] = (product.images && product.images.length > 0)
    ? product.images
    : [product.image, product.secondaryImage].filter(Boolean) as string[];

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(gallery[0] || product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const rate = CURRENCIES[currentCurrency].rate;
  const symbol = CURRENCIES[currentCurrency].symbol;

  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    const matched = product.colors.find((c) => c.name === colorName);
    if (matched?.image) {
      setActiveImage(matched.image);
      const imgIdx = gallery.indexOf(matched.image);
      if (imgIdx !== -1) setActiveSlideIndex(imgIdx);
    }
  };

  const handlePrevSlide = () => {
    const nextIdx = activeSlideIndex > 0 ? activeSlideIndex - 1 : gallery.length - 1;
    setActiveSlideIndex(nextIdx);
    setActiveImage(gallery[nextIdx] || product.image);
  };

  const handleNextSlide = () => {
    const nextIdx = activeSlideIndex < gallery.length - 1 ? activeSlideIndex + 1 : 0;
    setActiveSlideIndex(nextIdx);
    setActiveImage(gallery[nextIdx] || product.image);
  };

  const handleSelectSlide = (idx: number) => {
    setActiveSlideIndex(idx);
    setActiveImage(gallery[idx] || product.image);
  };

  const handleAdd = () => {
    onAddToCart(product.id, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Media Viewport & 5-Image Slider */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="space-y-3">
              {/* Main Slider Viewport */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Slide Number Badge */}
                {gallery.length > 1 && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeSlideIndex + 1} / {gallery.length}
                    </span>
                  </div>
                )}

                {/* Left / Right Chevron Controls */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                      {gallery.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => handleSelectSlide(dotIdx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeSlideIndex === dotIdx
                              ? 'w-5 bg-blue-600'
                              : 'w-1.5 bg-slate-400/60 hover:bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 5-Thumbnail Switcher Strip */}
              {gallery.length > 1 && (
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {gallery.map((thumbImg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSlide(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeSlideIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-600/30 scale-102'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={thumbImg} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guarantees */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>30-Day Money-Back</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {product.categoryLabel}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-950 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {product.tagline}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-950">
                  {symbol}
                  {(product.price * rate).toFixed(0)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {symbol}
                    {(product.originalPrice * rate).toFixed(0)}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Save {symbol}{((product.originalPrice ? product.originalPrice - product.price : 0) * rate).toFixed(0)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <label className="text-xs font-bold text-slate-900 block mb-2">
                    Select Finish: <span className="text-blue-600 font-semibold">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => handleSelectColor(c.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          selectedColor === c.name
                            ? 'border-blue-600 bg-blue-50/70 text-blue-700 ring-2 ring-blue-600/30 font-bold shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner flex-shrink-0" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                        {c.image && (
                          <img src={c.image} alt={c.name} className="w-4 h-4 rounded-full object-cover border border-slate-300 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              <div className="mt-5 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1">
                  Highlights:
                </span>
                {product.features.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Specs Table */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Technical Specifications:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">{k}</span>
                      <span className="font-semibold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Quantity & Add to Cart / Checkout */}
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-4">
                {/* Quantity picker */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 hover:bg-slate-800 text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Instant Checkout */}
              <button
                onClick={() => {
                  onProceedToCheckout(product, quantity, selectedColor);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
