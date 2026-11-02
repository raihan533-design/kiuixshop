import React, { useState } from 'react';
import { Product, Currency } from '../types';
import { CURRENCIES } from '../data/products';
import { Heart, Eye, ShoppingCart, Check, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currentCurrency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onQuickView: (id: string) => void;
  onAddToCart: (id: string, color?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentCurrency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [isHovered, setIsHovered] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id, selectedColor);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1800);
  };

  const currentRate = CURRENCIES[currentCurrency].rate;
  const currentSymbol = CURRENCIES[currentCurrency].symbol;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onQuickView(product.id)}>
        {/* Main Product Image */}
        <img
          src={isHovered && product.secondaryImage ? product.secondaryImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs ${
                product.badge === 'BEST SELLER'
                  ? 'bg-blue-600 text-white'
                  : product.badge === 'HOT DEAL'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-950 text-white'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white shadow-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product.id);
            }}
            className="w-full bg-white/95 hover:bg-white text-slate-900 text-xs font-bold py-2.5 px-3 rounded-xl shadow-lg backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-700 uppercase tracking-wider text-[9px] sm:text-[10px] truncate max-w-[80px] sm:max-w-none">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800 text-[10px] sm:text-xs">{product.rating}</span>
              <span className="text-slate-400 hidden sm:inline">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product.id)}
            className="font-bold text-slate-950 text-xs sm:text-base leading-snug group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
            {product.tagline}
          </p>

          {/* Color options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
              <span className="text-[10px] sm:text-[11px] text-slate-400 mr-0.5 sm:mr-1 hidden sm:inline">Color:</span>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                    selectedColor === c.name
                      ? 'ring-2 ring-blue-600 ring-offset-1 scale-110'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-lg font-black text-slate-950">
                {currentSymbol}
                {(product.price * currentRate).toFixed(0)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  {currentSymbol}
                  {(product.originalPrice * currentRate).toFixed(0)}
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold block">
              In Stock ({product.stockCount})
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={addedRecently}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs ${
              addedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-950 hover:bg-blue-600 active:scale-95 text-white'
            }`}
          >
            {addedRecently ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
