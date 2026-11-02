import React, { useState, useEffect, useMemo } from 'react';
import { Currency, CartItem, Product, CategoryItem } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, CURRENCIES, DEFAULT_CATEGORIES } from './data/products';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { StripeCheckoutModal } from './components/StripeCheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { StripeDevGuideModal } from './components/StripeDevGuideModal';
import { SEOInspectorModal } from './components/SEOInspectorModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLockModal } from './components/AdminLockModal';
import { FeaturesSection } from './components/FeaturesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PolicyModal } from './components/PolicyModal';
import { SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

export function App() {
  // Products Catalog State with LocalStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kiuix_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Dynamic Product Categories / Sections with LocalStorage persistence
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kiuix_categories');
      if (saved) {
        const parsed: CategoryItem[] = JSON.parse(saved);
        // Clean out old hardcoded sections so only 'all' and user-added sections remain
        const filtered = parsed.filter(
          (c) => c.id !== 'audio' && c.id !== 'desk' && c.id !== 'chargers' && c.id !== 'accessories'
        );
        const hasAll = filtered.some((c) => c.id === 'all');
        return hasAll
          ? filtered.map((c) => (c.id === 'all' ? { id: 'all', label: 'All Categories' } : c))
          : [{ id: 'all', label: 'All Categories' }, ...filtered];
      }
      return DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kiuix_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  const handleAddCategory = (newCat: CategoryItem) => {
    setCategories((prev) => {
      if (prev.some((c) => c.id === newCat.id)) return prev;
      return [...prev, newCat];
    });
  };

  const handleDeleteCategory = (catId: string) => {
    if (catId === 'all') {
      alert('The core "All Categories" section cannot be deleted.');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  // Admin View & Secret Lock States (Hidden from regular users)
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLockOpen, setIsAdminLockOpen] = useState(false);

  // Secret URL Hash (#admin) or Shortcut (Alt + A) Listener
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminLockOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        setIsAdminLockOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Persistence state for Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kiuix_cart');
      return saved ? JSON.parse(saved) : [
        { product: INITIAL_PRODUCTS[0], quantity: 1, selectedColor: 'Cobalt Blue' },
        { product: INITIAL_PRODUCTS[4], quantity: 1, selectedColor: 'Matte Black' }
      ];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kiuix_wishlist');
      return saved ? JSON.parse(saved) : ['kiuix-pulse-anc', 'kiuix-stealth-keyboard'];
    } catch {
      return [];
    }
  });

  const [currentCurrency, setCurrentCurrency] = useState<Currency>('USD');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(250);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStripeCheckoutOpen, setIsStripeCheckoutOpen] = useState(false);
  const [isStripeGuideOpen, setIsStripeGuideOpen] = useState(false);
  const [isSeoInspectorOpen, setIsSeoInspectorOpen] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<'terms' | 'privacy' | null>(null);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<{
    orderId: string;
    customerEmail: string;
    customerName: string;
    totalAmount: string;
    paymentMethod: string;
    itemsCount: number;
  } | null>(null);

  // Check for Stripe Checkout return (?success=true&session_id=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const sessionId = params.get('session_id') || `KIU-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderSuccessDetails({
        orderId: sessionId.slice(-8).toUpperCase(),
        customerEmail: 'buyer@example.com',
        customerName: 'Verified Buyer',
        totalAmount: 'Paid in Full',
        paymentMethod: 'Official Stripe Checkout (Global Methods)',
        itemsCount: 1,
      });
      setCart([]);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Sync products to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kiuix_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Product CRUD actions for Admin
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    // Also update cart if product is inside
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updated.id ? { ...item, product: updated } : item
      )
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleResetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('kiuix_products');
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kiuix_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kiuix_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Wishlist handler
  const handleToggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Cart actions
  const handleAddToCart = (productId: string, quantity = 1, color?: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const chosenColor = color || product.colors[0]?.name || 'Standard';

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === productId && item.selectedColor === chosenColor
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedColor: chosenColor }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number, color: string) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, color: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedColor === color))
    );
  };

  const handleDirectCheckout = (product: Product, quantity: number, color: string) => {
    handleAddToCart(product.id, quantity, color);
    setIsStripeCheckoutOpen(true);
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesPrice = p.price <= maxPrice;
      return matchesCategory && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, maxPrice, sortBy]);

  // Total cart calculation for Stripe
  const totalSubtotalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingUSD = totalSubtotalUSD >= 50 || totalSubtotalUSD === 0 ? 0 : 9.99;
  const cartTotalUSD = totalSubtotalUSD + shippingUSD;

  // If Admin Panel is activated, render the full admin dashboard
  if (isAdminOpen) {
    return (
      <AdminPanel
        products={products}
        categories={categories}
        currentCurrency={currentCurrency}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onClose={() => setIsAdminOpen(false)}
        onPreviewStore={() => setIsAdminOpen(false)}
        onLockAdmin={() => {
          setIsAdminOpen(false);
          setIsAdminLockOpen(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Customer Navigation (Completely clean - no admin buttons) */}
      <Navbar
        cart={cart}
        wishlistIds={wishlistIds}
        categories={categories}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectProduct={(id) => {
          const p = products.find((item) => item.id === id);
          if (p) setQuickViewProduct(p);
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          currentCurrency={currentCurrency}
          onExploreClick={() => {
            const el = document.getElementById('catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onQuickView={(id) => {
            const p = products.find((item) => item.id === id);
            if (p) setQuickViewProduct(p);
          }}
          onAddToCart={(id) => handleAddToCart(id, 1)}
        />

        {/* Features / Why KIUIX Section */}
        <FeaturesSection />

        {/* Product Catalog Section */}
        <section id="catalog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Category Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                  PRODUCT CATALOG
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                Precision Tech & Everyday Carry
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing {filteredProducts.length} curated products ready for immediate dispatch
              </p>
            </div>

            {/* Filter Pills (Swipeable on mobile - dynamically renders all custom sections) */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar max-w-full">
              {categories.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Price Slider & Sorting */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Price Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Max Price:</span>
                <input
                  type="range"
                  min="30"
                  max="250"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-32 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-black text-blue-600 font-mono">
                  {CURRENCIES[currentCurrency].symbol}
                  {(maxPrice * CURRENCIES[currentCurrency].rate).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:border-blue-600 cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No products match your criteria</h3>
              <p className="text-xs text-slate-500">Try adjusting your price slider or choosing a different category.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setMaxPrice(250);
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Reset all filters &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentCurrency={currentCurrency}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={(id) => {
                    const p = products.find((item) => item.id === id);
                    if (p) setQuickViewProduct(p);
                  }}
                  onAddToCart={(id, color) => handleAddToCart(id, 1, color)}
                />
              ))}
            </div>
          )}

        </section>

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Contact Form Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        categories={categories}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenStripeGuide={() => setIsStripeGuideOpen(true)}
        onOpenSeoInspector={() => setIsSeoInspectorOpen(true)}
        onOpenAdminLock={() => setIsAdminLockOpen(true)}
        onOpenPolicy={(tab) => setPolicyModalTab(tab)}
      />

      {/* Terms & Conditions / Privacy Policy Modal */}
      {policyModalTab && (
        <PolicyModal
          initialTab={policyModalTab}
          onClose={() => setPolicyModalTab(null)}
        />
      )}

      {/* Secret Admin PIN Lock Modal (Hidden from public customers) */}
      <AdminLockModal
        isOpen={isAdminLockOpen}
        onClose={() => setIsAdminLockOpen(false)}
        onUnlock={() => {
          setIsAdminLockOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        currentCurrency={currentCurrency}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onProceedToCheckout={handleDirectCheckout}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        currentCurrency={currentCurrency}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToStripe={(_discountAmount, _promoCode) => {
          setIsCartOpen(false);
          setIsStripeCheckoutOpen(true);
        }}
      />

      {/* Stripe Checkout Simulation Modal */}
      <StripeCheckoutModal
        isOpen={isStripeCheckoutOpen}
        totalUSD={cartTotalUSD}
        itemCount={cart.reduce((a, b) => a + b.quantity, 0)}
        currentCurrency={currentCurrency}
        onClose={() => setIsStripeCheckoutOpen(false)}
        onSuccess={(details) => {
          setIsStripeCheckoutOpen(false);
          setOrderSuccessDetails(details);
          setCart([]); // Clear cart after successful checkout
        }}
      />

      {/* Order Success Confetti Modal */}
      <OrderSuccessModal
        isOpen={!!orderSuccessDetails}
        orderDetails={orderSuccessDetails}
        onClose={() => setOrderSuccessDetails(null)}
      />

      {/* Stripe & Deployment Guide Modal */}
      <StripeDevGuideModal
        isOpen={isStripeGuideOpen}
        onClose={() => setIsStripeGuideOpen(false)}
      />

      {/* SEO SERP Inspector Modal */}
      <SEOInspectorModal
        isOpen={isSeoInspectorOpen}
        onClose={() => setIsSeoInspectorOpen(false)}
      />

    </div>
  );
}
export default App;
