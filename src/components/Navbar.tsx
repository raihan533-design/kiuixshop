import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight,
  Headphones,
  LayoutGrid,
  Zap,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Currency, CartItem, CategoryItem } from '../types';
import { CURRENCIES, PRODUCTS, DEFAULT_CATEGORIES } from '../data/products';

interface NavbarProps {
  cart: CartItem[];
  wishlistIds: string[];
  currentCurrency: Currency;
  categories?: CategoryItem[];
  onCurrencyChange: (c: Currency) => void;
  onOpenCart: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  wishlistIds,
  currentCurrency,
  categories = DEFAULT_CATEGORIES,
  onCurrencyChange,
  onOpenCart,
  onSelectCategory,
  onSelectProduct
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredSearchProducts = searchQuery.trim()
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleMobileNavClick = (cat: string) => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Flash Announcement Bar (Clean & Mobile-Friendly) */}
      <div className="bg-slate-950 text-white text-[11px] sm:text-xs font-medium py-1.5 sm:py-2 px-3 sm:px-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 mx-auto sm:mx-0 text-center">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="truncate max-w-[320px] sm:max-w-none">
              ⚡ <strong className="text-blue-400 font-semibold">FLASH SALE:</strong> 10% OFF with code{' '}
              <span className="bg-blue-900/60 text-blue-300 px-1 py-0.5 rounded font-mono border border-blue-500/30 font-bold">
                KIUIX10
              </span>{' '}
              <span className="hidden sm:inline">| Free Worldwide Shipping over $50</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
            <a
              href="mailto:kiuixshop@gmail.com"
              className="hover:text-white transition-colors"
            >
              kiuixshop@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-2.5 sm:py-3'
            : 'bg-white border-b border-slate-100 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: Mobile Hamburger & Logo */}
            <div className="flex items-center gap-2 sm:gap-6">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Logo (Clean without SHOP text) */}
              <a href="#" className="flex items-center">
                <Logo size="sm" showShopBadge={false} />
              </a>

              {/* Desktop Navigation Links (Dynamically populated from categories) */}
              <nav className="hidden lg:flex items-center gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right: Search, Currency, Wishlist, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Live Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl sm:rounded-full transition-all cursor-pointer"
                title="Search products"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline">Search...</span>
              </button>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                  className="px-2 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{currentCurrency}</span>
                </button>

                {currencyMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
                    {(Object.keys(CURRENCIES) as Currency[]).map((cur) => (
                      <button
                        key={cur}
                        onClick={() => {
                          onCurrencyChange(cur);
                          setCurrencyMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-blue-50 hover:text-blue-700 ${
                          currentCurrency === cur ? 'bg-blue-50/50 text-blue-600 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span>{cur}</span>
                        <span className="text-slate-400">{CURRENCIES[cur].symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist Indicator */}
              <button
                onClick={() => alert(`You have saved ${wishlistIds.length} item(s) to your wishlist.`)}
                className="p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={onOpenCart}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer group"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-slate-950 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-blue-600">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Bag</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden flex animate-fade-in">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 animate-slide-down">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links (Dynamically rendered) */}
              <div className="mt-5 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  Shop Collections
                </p>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleMobileNavClick(cat.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutGrid className="w-4 h-4 text-blue-600" />
                      <span>{cat.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom info */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-xs text-slate-500">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Customer Support</span>
                <a href="mailto:kiuixshop@gmail.com" className="text-blue-600 font-bold">kiuixshop@gmail.com</a>
              </div>
              <p className="text-[10px] text-slate-400">© 2026 KIUIXSHOP. 100% Encrypted by Stripe.</p>
            </div>
          </div>
          
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Live Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-10 sm:pt-20 px-3 sm:px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center gap-2.5">
              <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, spec, or feature..."
                className="w-full text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 sm:max-h-96 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100">
              {searchQuery.trim() === '' ? (
                <div className="py-6 text-center text-slate-500 text-xs sm:text-sm">
                  <Sparkles className="w-6 h-6 text-blue-500/50 mx-auto mb-2" />
                  <p>Type to search products across all categories.</p>
                </div>
              ) : filteredSearchProducts.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs sm:text-sm">
                  <p>No products found matching "{searchQuery}".</p>
                </div>
              ) : (
                filteredSearchProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p.id);
                      setSearchOpen(false);
                    }}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-blue-50/60 rounded-xl cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                          {p.name}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">{p.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {CURRENCIES[currentCurrency].symbol}
                        {(p.price * CURRENCIES[currentCurrency].rate).toFixed(0)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
