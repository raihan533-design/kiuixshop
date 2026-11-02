import React, { useState } from 'react';
import { CartItem, Currency } from '../types';
import { CURRENCIES } from '../data/products';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  currentCurrency: Currency;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number, color: string) => void;
  onRemoveItem: (productId: string, color: string) => void;
  onProceedToStripe: (discountAmount: number, promoCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  currentCurrency,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToStripe,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const rate = CURRENCIES[currentCurrency].rate;
  const symbol = CURRENCIES[currentCurrency].symbol;

  const subtotalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThresholdUSD = 50;
  const freeShippingProgress = Math.min(100, (subtotalUSD / freeShippingThresholdUSD) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThresholdUSD - subtotalUSD);

  const discountPercent = appliedPromo === 'KIUIX10' ? 0.10 : 0;
  const discountUSD = subtotalUSD * discountPercent;
  const shippingUSD = subtotalUSD >= freeShippingThresholdUSD || subtotalUSD === 0 ? 0 : 9.99;
  const totalUSD = subtotalUSD - discountUSD + shippingUSD;

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'KIUIX10') {
      setAppliedPromo('KIUIX10');
      setPromoError(null);
    } else {
      setPromoError('Invalid code. Try "KIUIX10" for 10% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Your Shopping Bag</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-5 py-3 bg-blue-50/60 border-b border-blue-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            {amountToFreeShipping === 0 ? (
              <span className="text-blue-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                You unlocked FREE Worldwide Shipping!
              </span>
            ) : (
              <span className="text-slate-700">
                Add <strong className="text-blue-700">{symbol}{(amountToFreeShipping * rate).toFixed(0)}</strong> more for FREE Shipping!
              </span>
            )}
            <span className="text-blue-600 font-bold">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Your shopping bag is empty.</p>
              <p className="text-xs text-slate-400">Discover our high-performance gear and add items here.</p>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Continue Shopping &rarr;
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.product.id}-${item.selectedColor}`} className="pt-3 first:pt-0 flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 rounded-xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Finish: <span className="font-medium text-slate-700">{item.selectedColor}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {symbol}
                      {(item.product.price * item.quantity * rate).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary / Stripe CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Promo Code Input */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Coupon code (try KIUIX10)"
                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-blue-600 uppercase font-mono"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>}
              {appliedPromo && (
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  ✓ 10% discount applied via {appliedPromo}!
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{symbol}{(subtotalUSD * rate).toFixed(0)}</span>
              </div>
              {discountUSD > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount (10%)</span>
                  <span>-{symbol}{(discountUSD * rate).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingUSD === 0 ? <strong className="text-emerald-600 font-bold uppercase text-[10px]">FREE</strong> : `${symbol}${(shippingUSD * rate).toFixed(0)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-1.5 border-t border-slate-200">
                <span>Total Due</span>
                <span className="text-blue-600 text-base">{symbol}{(totalUSD * rate).toFixed(0)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => onProceedToStripe(discountUSD, appliedPromo || '')}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>256-Bit SSL Encrypted & Guaranteed Safe</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
