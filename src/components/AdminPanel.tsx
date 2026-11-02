import React, { useState } from 'react';
import { Product, Currency, CategoryItem } from '../types';
import { CURRENCIES, PRODUCTS as DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '../data/products';
import { Logo } from './Logo';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Save, 
  X, 
  RefreshCw, 
  Check, 
  ExternalLink,
  Tag,
  ShieldCheck,
  Eye,
  Download,
  Layers,
  FolderPlus,
  Printer
} from 'lucide-react';
import { PrintdoorsModal } from './PrintdoorsModal';

interface AdminPanelProps {
  products: Product[];
  categories?: CategoryItem[];
  currentCurrency: Currency;
  onUpdateProduct: (updated: Product) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  onAddCategory?: (newCategory: CategoryItem) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onClose: () => void;
  onPreviewStore: () => void;
  onLockAdmin?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories = DEFAULT_CATEGORIES,
  currentCurrency,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
  onAddCategory,
  onDeleteCategory,
  onClose,
  onPreviewStore,
  onLockAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Modal / Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formStock, setFormStock] = useState<number>(0);
  const [formCategory, setFormCategory] = useState<string>('audio');
  const [formCategoryLabel, setFormCategoryLabel] = useState<string>('Audio & Sound');
  const [formImage, setFormImage] = useState('');
  const [formSecondaryImage, setFormSecondaryImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState<string>('NONE');
  const [formFeatures, setFormFeatures] = useState<string>('');

  // Category & Section Manager Modal state
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // Inline category creation in product modal
  const [isCreatingNewCategoryInline, setIsCreatingNewCategoryInline] = useState(false);
  const [inlineCatLabel, setInlineCatLabel] = useState('');

  // Printdoors POD Modal state
  const [isPrintdoorsOpen, setIsPrintdoorsOpen] = useState(false);

  const rate = CURRENCIES[currentCurrency].rate;
  const symbol = CURRENCIES[currentCurrency].symbol;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Metric stats
  const totalStockCount = products.reduce((acc, p) => acc + p.stockCount, 0);
  const lowStockCount = products.filter((p) => p.stockCount > 0 && p.stockCount < 15).length;
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length;
  const totalCatalogValue = products.reduce((acc, p) => acc + p.price * p.stockCount, 0);

  // Export inventory to Excel / CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Tagline',
      'Category',
      'Category Label',
      'Price USD',
      'Original Price USD',
      'Stock Count',
      'In Stock',
      'Badge',
      'Rating',
      'Reviews',
      'Image URL',
      'Description'
    ];

    const escapeCsv = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = products.map((p) => [
      escapeCsv(p.id),
      escapeCsv(p.name),
      escapeCsv(p.tagline),
      escapeCsv(p.category),
      escapeCsv(p.categoryLabel),
      escapeCsv(p.price),
      escapeCsv(p.originalPrice ?? ''),
      escapeCsv(p.stockCount),
      escapeCsv(p.inStock ? 'YES' : 'NO'),
      escapeCsv(p.badge || 'NONE'),
      escapeCsv(p.rating),
      escapeCsv(p.reviewCount),
      escapeCsv(p.image),
      escapeCsv(p.description),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KIUIXSHOP_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Catalog exported to Excel / CSV file successfully!');
  };

  // Handle adding new custom category from Category Manager
  const handleCreateCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const label = newCatLabel.trim();
    if (!label) return;
    const slug = newCatSlug.trim()
      ? newCatSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (categories.some((c) => c.id === slug)) {
      alert(`A section with ID "${slug}" already exists!`);
      return;
    }

    onAddCategory?.({
      id: slug,
      label: label,
      isCustom: true,
    });
    setNewCatLabel('');
    setNewCatSlug('');
    showToast(`New category section "${label}" created successfully!`);
  };

  // Handle creating category inline during product creation
  const handleCreateInlineCategory = () => {
    const label = inlineCatLabel.trim();
    if (!label) return;
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (!categories.some((c) => c.id === slug)) {
      onAddCategory?.({
        id: slug,
        label: label,
        isCustom: true,
      });
    }

    setFormCategory(slug);
    setFormCategoryLabel(label);
    setInlineCatLabel('');
    setIsCreatingNewCategoryInline(false);
    showToast(`New category "${label}" selected!`);
  };

  // Open Edit Form
  const openEditModal = (product: Product) => {
    setIsNewProduct(false);
    setEditingProduct(product);
    setFormName(product.name);
    setFormTagline(product.tagline);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormStock(product.stockCount);
    setFormCategory(product.category);
    setFormCategoryLabel(product.categoryLabel);
    setFormImage(product.image);
    setFormSecondaryImage(product.secondaryImage || '');
    setFormDescription(product.description);
    setFormBadge(product.badge || 'NONE');
    setFormFeatures(product.features.join('\n'));
    setIsEditing(true);
  };

  // Open New Product Form
  const openNewProductModal = () => {
    setIsNewProduct(true);
    setEditingProduct(null);
    setFormName('');
    setFormTagline('');
    setFormPrice(99);
    setFormOriginalPrice(129);
    setFormStock(25);
    const availableCustomCats = categories.filter((c) => c.id !== 'all');
    if (availableCustomCats.length > 0) {
      setFormCategory(availableCustomCats[0].id);
      setFormCategoryLabel(availableCustomCats[0].label);
      setIsCreatingNewCategoryInline(false);
    } else {
      setFormCategory('general');
      setFormCategoryLabel('General');
      setIsCreatingNewCategoryInline(true);
    }
    setInlineCatLabel('');
    setFormImage('https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80');
    setFormSecondaryImage('');
    setFormDescription('High-end precision crafted hardware engineered for modern workflows.');
    setFormBadge('NEW');
    setFormFeatures('Premium aerospace-grade aluminum alloy\nUltra-long battery life with fast charge\nUniversal compatibility');
    setIsEditing(true);
  };

  // Save changes
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = formFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const productPayload: Product = {
      id: isNewProduct ? `kiuix-${Date.now()}` : editingProduct!.id,
      name: formName,
      tagline: formTagline,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      rating: isNewProduct ? 5.0 : editingProduct!.rating,
      reviewCount: isNewProduct ? 1 : editingProduct!.reviewCount,
      category: formCategory,
      categoryLabel: formCategoryLabel,
      badge: formBadge === 'NONE' ? undefined : (formBadge as any),
      image: formImage.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      secondaryImage: formSecondaryImage.trim() || undefined,
      description: formDescription,
      features: featuresArray.length > 0 ? featuresArray : ['Precision build', 'High durability'],
      specs: editingProduct?.specs || {
        'Build Material': 'Aerospace Anodized Aluminum',
        'Warranty': '2-Year Official KIUIX Warranty',
      },
      colors: editingProduct?.colors || [
        { name: 'Obsidian Black', hex: '#0a0a0c', inStock: true },
        { name: 'Cobalt Blue', hex: '#1d39f5', inStock: true },
        { name: 'Arctic White', hex: '#f8fafc', inStock: true },
      ],
      inStock: Number(formStock) > 0,
      stockCount: Number(formStock),
    };

    if (isNewProduct) {
      onAddProduct(productPayload);
      showToast(`Product "${productPayload.name}" successfully created!`);
    } else {
      onUpdateProduct(productPayload);
      showToast(`Product "${productPayload.name}" successfully updated!`);
    }

    setIsEditing(false);
  };

  // Fast inline stock adjustment
  const handleInlineStockChange = (productId: string, newStock: number) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const updated = {
      ...target,
      stockCount: Math.max(0, newStock),
      inStock: newStock > 0,
    };
    onUpdateProduct(updated);
    showToast(`Stock updated for ${target.name}: ${Math.max(0, newStock)} units`);
  };

  // Fast inline price adjustment
  const handleInlinePriceChange = (productId: string, newPrice: number) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const updated = {
      ...target,
      price: Math.max(1, newPrice),
    };
    onUpdateProduct(updated);
    showToast(`Price updated for ${target.name}: $${Math.max(1, newPrice)}`);
  };

  // Filtered products list
  const displayProducts = products.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" variant="dark" showShopBadge={false} />
          <span className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
              Admin Control Panel
            </span>
            <span className="hidden md:inline text-xs text-slate-400">
              Manager: <strong className="text-white">kiuixshop@gmail.com</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onPreviewStore}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Storefront View</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Toast alert */}
        {successToast && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-black text-white mt-1">{products.length}</h3>
              <p className="text-[11px] text-blue-400 mt-0.5">Across 4 collections</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Units in Stock</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{totalStockCount}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Ready for 24h dispatch</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Low Stock Warnings</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{lowStockCount}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">&lt; 15 units remaining</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Inventory Value</p>
              <h3 className="text-2xl font-black text-white mt-1">
                ${totalCatalogValue.toLocaleString()}
              </h3>
              <p className="text-[11px] text-blue-400 mt-0.5">Stripe Integrated</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Product Management Section */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          
          {/* Action Toolbar */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Manage Store Catalog</span>
                <span className="text-xs font-normal text-slate-400">({displayProducts.length} items)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, edit images, adjust prices, and update stock counts in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter products..."
                  className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 w-44 sm:w-52"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 px-3 py-2 focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id === 'all' ? 'All Categories' : c.label}
                  </option>
                ))}
              </select>

              {/* Add New Product CTA */}
              <button
                onClick={openNewProductModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/25"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              {/* Manage Sections / Categories CTA */}
              <button
                onClick={() => setIsCategoryManagerOpen(true)}
                title="Add & manage product categories or sections"
                className="px-3.5 py-2 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/40 active:scale-95 text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Manage Sections</span>
              </button>

              {/* Export to Excel / CSV */}
              <button
                onClick={handleExportCSV}
                title="Export Catalog to Excel / CSV"
                className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 active:scale-95 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Excel</span>
              </button>

              {/* Printdoors POD Integration CTA */}
              <button
                onClick={() => setIsPrintdoorsOpen(true)}
                title="Connect Printdoors Print-on-Demand Open API"
                className="px-3.5 py-2 bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-500/40 active:scale-95 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-500/10"
              >
                <Printer className="w-4 h-4 text-indigo-400" />
                <span>Printdoors POD</span>
              </button>

              {/* Reset to defaults button */}
              <button
                onClick={() => {
                  if (confirm('Reset all catalog changes to original default products?')) {
                    onResetProducts();
                    showToast('Catalog restored to default template!');
                  }
                }}
                title="Restore default catalog"
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Card-Based Product List */}
          <div className="md:hidden divide-y divide-slate-800/80">
            {displayProducts.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs">
                No products found.
              </div>
            ) : (
              displayProducts.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-800 border border-slate-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-white text-sm line-clamp-1">{p.name}</h4>
                        {p.badge && (
                          <span className="bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.categoryLabel}</p>
                      
                      <div className="mt-1 flex items-center gap-2">
                        {p.stockCount === 0 ? (
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        ) : p.stockCount < 15 ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                            Low Stock ({p.stockCount})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                            In Stock ({p.stockCount})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quick Adjusters */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Price:</span>
                      <div className="flex items-center gap-0.5">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          min="1"
                          value={p.price}
                          onChange={(e) => handleInlinePriceChange(p.id, Number(e.target.value))}
                          className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-1.5 py-0.5 text-white font-mono font-bold text-center"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Stock:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleInlineStockChange(p.id, p.stockCount - 1)}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-white w-6 text-center">{p.stockCount}</span>
                        <button
                          type="button"
                          onClick={() => handleInlineStockChange(p.id, p.stockCount + 1)}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-800"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Info & Image</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"?`)) {
                          onDeleteProduct(p.id);
                          showToast(`Deleted ${p.name}`);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-900/50 text-rose-400 border border-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Product Data Table (Desktop View) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Item & Image</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price ($)</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {displayProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No products found. Click "Add Product" to create one.
                    </td>
                  </tr>
                ) : (
                  displayProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Product Media & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700 flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-sm">{p.name}</span>
                              {p.badge && (
                                <span className="bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{p.tagline}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-slate-300 font-medium">
                          {p.categoryLabel}
                        </span>
                      </td>

                      {/* Inline Price editing */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            min="1"
                            value={p.price}
                            onChange={(e) => handleInlinePriceChange(p.id, Number(e.target.value))}
                            className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white font-mono font-bold focus:border-blue-500 focus:outline-hidden"
                          />
                        </div>
                      </td>

                      {/* Inline Stock editing */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={p.stockCount}
                            onChange={(e) => handleInlineStockChange(p.id, Number(e.target.value))}
                            className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white font-mono font-bold focus:border-blue-500 focus:outline-hidden"
                          />
                          <span className="text-slate-500 text-[11px]">pcs</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        {p.stockCount === 0 ? (
                          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Out of Stock
                          </span>
                        ) : p.stockCount < 15 ? (
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Low ({p.stockCount})
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Active ({p.stockCount})
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-400 transition-colors cursor-pointer"
                            title="Edit full product details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                onDeleteProduct(p.id);
                                showToast(`Deleted "${p.name}"`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* Edit / Create Product Drawer Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-slate-100">
            
            {/* Modal Header */}
            <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {isNewProduct ? 'Add New Product to KIUIX' : `Edit Product: ${formName}`}
                  </h3>
                  <p className="text-xs text-slate-400">Configure image, pricing, inventory stock, and description</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. KIUIX Pulse Pro ANC Headphone"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tagline / Short Summary</label>
                <input
                  type="text"
                  required
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. Hybrid Active Noise Cancelling Headphone with Studio Fidelity"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Price, Original Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Original Price ($) (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 249"
                    className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Stock Count (Units)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">Category Section</label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewCategoryInline(!isCreatingNewCategoryInline)}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isCreatingNewCategoryInline ? 'Choose Existing' : '+ New Section'}</span>
                    </button>
                  </div>

                  {isCreatingNewCategoryInline ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={inlineCatLabel}
                        onChange={(e) => setInlineCatLabel(e.target.value)}
                        placeholder="e.g. Gaming Gear, Wallets"
                        className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-950 border border-blue-500 text-white placeholder:text-slate-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleCreateInlineCategory}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__CREATE_NEW__') {
                          setIsCreatingNewCategoryInline(true);
                          return;
                        }
                        const matched = categories.find((c) => c.id === val);
                        setFormCategory(val);
                        setFormCategoryLabel(matched ? matched.label : val);
                      }}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                    >
                      {categories
                        .filter((c) => c.id !== 'all')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label} ({c.id})
                          </option>
                        ))}
                      <option value="__CREATE_NEW__">+ Create New Category...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Badge Tag</label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="NONE">No Badge</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="NEW">NEW</option>
                    <option value="FEATURED">FEATURED</option>
                    <option value="HOT DEAL">HOT DEAL</option>
                  </select>
                </div>
              </div>

              {/* Primary Image URL & Live Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Main Image URL</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500"
                  />
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {formImage ? (
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-600">No img</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Product Description</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed product story, acoustic design, build materials, etc."
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500 resize-none"
                />
              </div>

              {/* Features (one per line) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Highlights & Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-blue-500 resize-none font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/25"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Product</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Category & Section Manager Modal */}
      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Manage Store Sections & Categories</h3>
                  <p className="text-xs text-slate-400">Add, rename or remove product sections across KIUIXSHOP</p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryManagerOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create New Category Form */}
            <form onSubmit={handleCreateCategory} className="p-6 border-b border-slate-800 bg-slate-950/50 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <FolderPlus className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Create New Product Section</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Section Display Name *</label>
                  <input
                    type="text"
                    required
                    value={newCatLabel}
                    onChange={(e) => {
                      setNewCatLabel(e.target.value);
                      if (!newCatSlug || newCatSlug === newCatLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
                        setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Smart Watches, Gaming"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Section ID / Slug</label>
                  <input
                    type="text"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    placeholder="e.g. smart-watches"
                    className="w-full text-xs font-mono font-semibold px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Section</span>
                </button>
              </div>
            </form>

            {/* List of Existing Categories */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Sections ({categories.length})
                </span>
                <span className="text-[11px] text-slate-500">Live in Navigation & Storefront</span>
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                {categories.map((cat) => {
                  const productCount = cat.id === 'all'
                    ? products.length
                    : products.filter((p) => p.category === cat.id).length;
                  const isCore = cat.id === 'all';

                  return (
                    <div key={cat.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {cat.label.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-white">{cat.label}</h5>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              #{cat.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {productCount} product{productCount === 1 ? '' : 's'} assigned
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCore ? (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                            Core Store Section
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete custom category section "${cat.label}"? Products in it will remain in catalog.`)) {
                                onDeleteCategory?.(cat.id);
                                showToast(`Section "${cat.label}" removed.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/30 transition-colors cursor-pointer"
                            title="Delete custom section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCategoryManagerOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Printdoors POD Modal */}
      <PrintdoorsModal
        isOpen={isPrintdoorsOpen}
        onClose={() => setIsPrintdoorsOpen(false)}
        onImportProducts={(imported) => {
          imported.forEach((p) => onAddProduct(p));
          showToast(`Imported ${imported.length} Printdoors products!`);
        }}
      />

    </div>
  );
};
