import React, { useState } from 'react';
import { Product, Currency, CategoryItem, ProductColor, HeroConfig, CustomerOrder } from '../types';
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
  Printer,
  Upload,
  Image as ImageIcon,
  Palette,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Link as LinkIcon,
  Database,
  Star,
  ShoppingBag,
  ShoppingCart,
  Copy,
  CheckCheck,
  MapPin,
  User,
  Mail,
  Phone,
  Inbox
} from 'lucide-react';
import { PrintdoorsModal } from './PrintdoorsModal';
import { SupabaseModal } from './SupabaseModal';
import { HeroSettingsModal } from './HeroSettingsModal';

interface AdminPanelProps {
  products: Product[];
  categories?: CategoryItem[];
  currentCurrency: Currency;
  orders?: CustomerOrder[];
  onUpdateOrderStatus?: (orderId: string, status: 'PENDING_FULFILLMENT' | 'FULFILLED' | 'CANCELLED') => void;
  onDeleteOrder?: (orderId: string) => void;
  heroConfig?: HeroConfig;
  onUpdateHeroConfig?: (newConfig: HeroConfig) => void;
  onUpdateProduct: (updated: Product) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  onAddCategory?: (newCategory: CategoryItem) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onClose: () => void;
  onPreviewStore: () => void;
  onLockAdmin?: () => void;
  onSyncProductsFromCloud?: (cloudProducts: Product[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories = DEFAULT_CATEGORIES,
  currentCurrency,
  orders = [],
  onUpdateOrderStatus,
  onDeleteOrder,
  heroConfig,
  onUpdateHeroConfig,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
  onAddCategory,
  onDeleteCategory,
  onClose,
  onPreviewStore,
  onLockAdmin,
  onSyncProductsFromCloud,
}) => {
  const [adminTab, setAdminTab] = useState<'products' | 'orders'>('products');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Modal / Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Hero Banner Settings Modal state
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  // Supabase Cloud Database state
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

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
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formColors, setFormColors] = useState<ProductColor[]>([]);
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState<string>('NONE');
  const [formFeatures, setFormFeatures] = useState<string>('');
  const [formSupplierUrl, setFormSupplierUrl] = useState<string>('');

  // Popular quick-add color presets
  const POPULAR_COLOR_PRESETS = [
    { name: 'Obsidian Black', hex: '#0a0a0c' },
    { name: 'Cobalt Blue', hex: '#1d39f5' },
    { name: 'Arctic White', hex: '#f8fafc' },
    { name: 'Space Gray', hex: '#475569' },
    { name: 'Desert Gold', hex: '#d4af37' },
    { name: 'Emerald Green', hex: '#10b981' },
    { name: 'Crimson Red', hex: '#dc2626' },
    { name: 'Silver Matte', hex: '#cbd5e1' },
  ];

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

  // Process and optimize computer image files for HD crispness + storage safety
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid image file'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            resolve(canvas.toDataURL(mimeType, 0.88));
          } else {
            resolve(rawDataUrl);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = rawDataUrl;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Upload to a specific slot (0..4)
  const handleSlotImageUpload = async (file: File, slotIndex: number) => {
    try {
      const optimized = await processImageFile(file);
      setFormImages((prev) => {
        const next = [...prev];
        next[slotIndex] = optimized;
        return next;
      });
      if (slotIndex === 0) setFormImage(optimized);
      if (slotIndex === 1) setFormSecondaryImage(optimized);
      showToast(`Image #${slotIndex + 1} loaded from computer!`);
    } catch {
      alert('Could not process image.');
    }
  };

  // Batch upload multiple images from computer at once
  const handleBatchImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const newImages = [...formImages];
    for (const file of fileArray) {
      if (newImages.length < 5) {
        try {
          const opt = await processImageFile(file);
          newImages.push(opt);
        } catch {
          // ignore invalid
        }
      }
    }
    const finalImgs = newImages.slice(0, 5);
    setFormImages(finalImgs);
    if (finalImgs[0]) setFormImage(finalImgs[0]);
    if (finalImgs[1]) setFormSecondaryImage(finalImgs[1]);
    showToast(`${fileArray.length} photos loaded from computer into gallery!`);
  };

  // Remove slot image
  const handleRemoveSlotImage = (slotIndex: number) => {
    setFormImages((prev) => {
      const next = prev.filter((_, i) => i !== slotIndex);
      if (next[0]) setFormImage(next[0]);
      else setFormImage('');
      if (next[1]) setFormSecondaryImage(next[1]);
      else setFormSecondaryImage('');
      return next;
    });
    showToast(`Image #${slotIndex + 1} removed.`);
  };

  // Direct file upload fallback
  const handleImageFileUpload = (file: File, isSecondary: boolean = false) => {
    processImageFile(file)
      .then((opt) => {
        if (isSecondary) {
          setFormSecondaryImage(opt);
          setFormImages((prev) => {
            const next = [...prev];
            next[1] = opt;
            return next;
          });
        } else {
          setFormImage(opt);
          setFormImages((prev) => {
            const next = [...prev];
            next[0] = opt;
            return next;
          });
        }
        showToast('Photo uploaded from computer!');
      })
      .catch(() => alert('Could not read image file.'));
  };

  // Color variant management
  const handleAddColor = (preset?: { name: string; hex: string }) => {
    const newColor: ProductColor = preset
      ? { name: preset.name, hex: preset.hex, inStock: true, image: formImages[0] || formImage }
      : { name: `Color ${formColors.length + 1}`, hex: '#1d39f5', inStock: true, image: formImages[0] || formImage };
    setFormColors((prev) => [...prev, newColor]);
    showToast(`Color "${newColor.name}" added!`);
  };

  const handleUpdateColor = (index: number, updates: Partial<ProductColor>) => {
    setFormColors((prev) => prev.map((c, i) => (i === index ? { ...c, ...updates } : c)));
  };

  const handleRemoveColor = (index: number) => {
    setFormColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorImageUpload = async (file: File, colorIndex: number) => {
    try {
      const opt = await processImageFile(file);
      setFormColors((prev) =>
        prev.map((c, i) => (i === colorIndex ? { ...c, image: opt } : c))
      );
      setFormImages((prev) => (prev.length < 5 && !prev.includes(opt) ? [...prev, opt] : prev));
      showToast(`Custom photo linked to "${formColors[colorIndex]?.name || 'color'}"!`);
    } catch {
      alert('Could not process color image.');
    }
  };

  // Metric stats
  const totalStockCount = products.reduce((acc, p) => acc + p.stockCount, 0);
  const lowStockCount = products.filter((p) => p.stockCount > 0 && p.stockCount < 15).length;
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length;
  const totalCatalogValue = products.reduce((acc, p) => acc + p.price * p.stockCount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING_FULFILLMENT').length;
  const fulfilledOrdersCount = orders.filter((o) => o.status === 'FULFILLED').length;

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

  // Export catalog as JSON backup
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `kiuix_products_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    showToast('Catalog exported as JSON backup!');
  };

  // Import catalog from JSON backup
  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach((p: Product) => onAddProduct(p));
          showToast(`Imported ${imported.length} products successfully!`);
        } else {
          alert('Invalid catalog JSON format.');
        }
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
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
    
    // Load up to 5 gallery images
    const initialImages = (product.images && product.images.length > 0)
      ? product.images.slice(0, 5)
      : [product.image, product.secondaryImage].filter(Boolean) as string[];
    setFormImages(initialImages);
    setFormImage(initialImages[0] || product.image);
    setFormSecondaryImage(initialImages[1] || product.secondaryImage || '');

    // Load colors with image mappings
    setFormColors(
      product.colors && product.colors.length > 0
        ? product.colors.map((c) => ({
            ...c,
            image: c.image || initialImages[0] || product.image
          }))
        : [
            { name: 'Obsidian Black', hex: '#0a0a0c', inStock: true, image: initialImages[0] || product.image },
            { name: 'Cobalt Blue', hex: '#1d39f5', inStock: true, image: initialImages[1] || initialImages[0] || product.image },
            { name: 'Arctic White', hex: '#f8fafc', inStock: true, image: initialImages[0] || product.image }
          ]
    );

    setFormDescription(product.description);
    setFormBadge(product.badge || 'NONE');
    setFormFeatures(product.features.join('\n'));
    setFormSupplierUrl(product.supplierUrl || '');
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
    setFormSupplierUrl('');
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
    setFormImages([]);
    setFormImage('');
    setFormSecondaryImage('');
    setFormColors([
      { name: 'Obsidian Black', hex: '#0a0a0c', inStock: true },
      { name: 'Cobalt Blue', hex: '#1d39f5', inStock: true },
      { name: 'Arctic White', hex: '#f8fafc', inStock: true }
    ]);
    setFormDescription('High-end precision crafted hardware engineered for modern workflows.');
    setFormBadge('NEW');
    setFormFeatures('Premium aerospace-grade aluminum alloy\nUltra-long battery life with fast charge\nUniversal compatibility');
    setIsEditing(true);
  };

  // Save changes
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImages = formImages.filter((img) => img && img.trim().length > 0).slice(0, 5);
    const mainCover = finalImages[0] || formImage.trim();

    if (!mainCover) {
      alert('Please upload at least 1 image from your computer for this product before saving!');
      return;
    }

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
      image: mainCover,
      secondaryImage: finalImages[1] || formSecondaryImage.trim() || undefined,
      images: finalImages.length > 0 ? finalImages : [mainCover],
      description: formDescription,
      features: featuresArray.length > 0 ? featuresArray : ['Precision build', 'High durability'],
      specs: editingProduct?.specs || {
        'Build Material': 'Aerospace Anodized Aluminum',
        'Warranty': '2-Year Official KIUIX Warranty',
      },
      colors: formColors.length > 0
        ? formColors.map((c) => ({
            ...c,
            image: c.image || mainCover
          }))
        : [{ name: 'Standard', hex: '#1d39f5', inStock: true, image: mainCover }],
      inStock: Number(formStock) > 0,
      stockCount: Number(formStock),
      supplierUrl: formSupplierUrl.trim() || undefined,
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

        {/* Navigation Tabs: Products Catalog vs Customer Orders */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => setAdminTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'products'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Catalog ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
              adminTab === 'orders'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Customer Orders & Dropshipping</span>
            {pendingOrdersCount > 0 ? (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full ml-1 animate-pulse">
                {pendingOrdersCount} New
              </span>
            ) : (
              <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                {orders.length}
              </span>
            )}
          </button>
        </div>

        {/* Product Management Section */}
        {adminTab === 'products' && (
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

              {/* Hero Banner Settings CTA */}
              <button
                onClick={() => setIsHeroModalOpen(true)}
                title="Configure homepage Hero banner photo, top-seller product, and headlines"
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/25"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Hero Banner Settings</span>
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

              {/* Backup & Sync Buttons */}
              <button
                onClick={handleExportJSON}
                title="Download backup file of all added products to transfer to Chrome or Mobile"
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Backup JSON</span>
              </button>

              <label
                title="Import products from backup file into this browser"
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImportJSON(file);
                  }}
                />
              </label>

              {/* Cloud Database (Supabase) CTA */}
              <button
                onClick={() => setIsSupabaseOpen(true)}
                title="Connect Supabase Cloud Database for Worldwide Real-Time Sync"
                className="px-3.5 py-2 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 active:scale-95 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Cloud DB (Supabase)</span>
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

                  {/* Secret Supplier Shopping Link on Mobile */}
                  <div className="pt-2 border-t border-slate-900">
                    {p.supplierUrl ? (
                      <a
                        href={p.supplierUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Order at Supplier ↗</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="w-full py-1 text-slate-500 hover:text-cyan-400 text-[11px] font-medium transition-colors text-center"
                      >
                        + Add Supplier Shopping Link
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        onUpdateHeroConfig?.({
                          ...heroConfig,
                          featuredProductId: p.id,
                          customImage: undefined,
                        });
                        showToast(`"${p.name}" featured on Homepage Hero Banner!`);
                      }}
                      className={`p-2 rounded-xl border border-slate-800 transition-colors ${
                        heroConfig?.featuredProductId === p.id
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-900 text-amber-400 hover:bg-slate-800'
                      }`}
                      title="Set as Hero Spotlight"
                    >
                      <Star className={`w-4 h-4 ${heroConfig?.featuredProductId === p.id ? 'fill-current' : ''}`} />
                    </button>
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
                  <th className="py-3 px-4">Supplier / Shopping</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {displayProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
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

                      {/* Supplier Shopping Link */}
                      <td className="py-3 px-4">
                        {p.supplierUrl ? (
                          <a
                            href={p.supplierUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all shadow-xs"
                            title={`Open supplier: ${p.supplierUrl}`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Order Supplier ↗</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="text-slate-500 hover:text-cyan-400 text-[11px] font-medium transition-colors cursor-pointer"
                            title="Add secret supplier URL"
                          >
                            + Add Link
                          </button>
                        )}
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
                            onClick={() => {
                              onUpdateHeroConfig?.({
                                ...heroConfig,
                                featuredProductId: p.id,
                                customImage: undefined,
                              });
                              showToast(`"${p.name}" is now featured on the Homepage Hero Banner!`);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              heroConfig?.featuredProductId === p.id
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-slate-400'
                            }`}
                            title="Feature this product in Homepage Hero Banner"
                          >
                            <Star className={`w-4 h-4 ${heroConfig?.featuredProductId === p.id ? 'fill-current' : ''}`} />
                          </button>
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
        )}

        {/* Customer Orders & Dropshipping Section */}
        {adminTab === 'orders' && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl space-y-6 p-5 sm:p-7 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-cyan-400" />
                    <span>Customer Orders & Dropshipping Fulfillment</span>
                  </h2>
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {orders.length} Total Orders
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  কাস্টমার প্রোডাক্ট অর্ডার করলে এখানে দেওয়া সাপ্লায়ার বাটনে ক্লিক করে সাথে সাথে AliExpress বা সাপ্লায়ারের পেজে গিয়ে অর্ডার করে দিতে পারবেন।
                </p>
              </div>

              {pendingOrdersCount > 0 && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>{pendingOrdersCount} orders waiting to be fulfilled</span>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-sm">No Customer Orders Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When a customer completes a checkout on your store, their order details and dropshipping supplier links will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isPending = order.status === 'PENDING_FULFILLMENT';
                  return (
                    <div
                      key={order.id}
                      className={`rounded-2xl border p-5 transition-all ${
                        isPending
                          ? 'bg-slate-900/80 border-amber-500/30 shadow-lg shadow-amber-500/5'
                          : 'bg-slate-900/40 border-slate-800'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono font-black text-white text-sm bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            #{order.id}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isPending
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                              }`}
                            />
                            {isPending ? 'Pending Fulfillment' : 'Fulfilled / Dispatched'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateOrderStatus?.(
                                order.id,
                                isPending ? 'FULFILLED' : 'PENDING_FULFILLMENT'
                              )
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isPending
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isPending ? 'Mark as Fulfilled' : 'Reopen as Pending'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete order #${order.id}?`)) {
                                onDeleteOrder?.(order.id);
                                showToast(`Deleted order #${order.id}`);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Customer Information (Left Column) */}
                        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-blue-400" />
                              Customer Information
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const textToCopy = `Name: ${order.customerName}\nAddress: ${order.shippingAddress || 'N/A'}\nEmail: ${order.customerEmail}\nPhone: ${order.customerPhone || 'N/A'}`;
                                navigator.clipboard.writeText(textToCopy);
                                setCopiedOrderId(order.id);
                                setTimeout(() => setCopiedOrderId(null), 2000);
                              }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Copy customer address to paste into supplier checkout"
                            >
                              {copiedOrderId === order.id ? (
                                <>
                                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Address</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <p className="text-white font-bold">{order.customerName}</p>
                            <p className="text-slate-400 flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {order.customerEmail}
                            </p>
                            {order.customerPhone && (
                              <p className="text-slate-400 flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-slate-500" />
                                {order.customerPhone}
                              </p>
                            )}
                            <div className="pt-1.5 border-t border-slate-800/80">
                              <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-slate-300">Delivery Destination:</strong>
                                  <p className="text-white font-medium mt-0.5">{order.shippingAddress || 'Standard Delivery'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Payment: {order.paymentMethod}</span>
                              <span className="font-bold text-emerald-400 font-mono text-xs">{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>

                        {/* Ordered Items & Supplier Shopping Buttons (Right Column) */}
                        <div className="lg:col-span-7 space-y-3">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Ordered Items & Supplier Fulfillment Links ({order.items.length})
                          </span>

                          <div className="space-y-2.5">
                            {order.items.map((item, idx) => {
                              const catalogProduct = products.find((p) => p.id === item.productId);
                              const targetSupplierUrl = item.supplierUrl || catalogProduct?.supplierUrl;

                              return (
                                <div
                                  key={idx}
                                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 flex-shrink-0"
                                    />
                                    <div>
                                      <h4 className="text-xs font-bold text-white line-clamp-1">
                                        {item.productName}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                                        <span>Color: <strong className="text-slate-300">{item.selectedColor}</strong></span>
                                        <span>•</span>
                                        <span>Qty: <strong className="text-white font-mono">{item.quantity}</strong></span>
                                        <span>•</span>
                                        <span className="text-emerald-400 font-mono">${item.price}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* THE SUPPLIER ACTION BUTTON */}
                                  <div>
                                    {targetSupplierUrl ? (
                                      <a
                                        href={targetSupplierUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap"
                                        title={`Go to: ${targetSupplierUrl}`}
                                      >
                                        <ShoppingBag className="w-4 h-4 text-cyan-200" />
                                        <span>Go to Supplier & Order Product ↗</span>
                                      </a>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (catalogProduct) {
                                            openEditModal(catalogProduct);
                                          } else {
                                            alert('Product not found in current catalog.');
                                          }
                                        }}
                                        className="text-xs text-amber-400 bg-amber-950/40 hover:bg-amber-950/80 border border-amber-800/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                                      >
                                        <span>+ Add Supplier Link</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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

              {/* Product 5-Image Gallery (Upload from Computer) */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      <span>Product Image Gallery (Up to 5 Photos for Slider)</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Customers can slide through these 5 images on storefront and quick view. Image #1 is the store cover.
                    </p>
                  </div>

                  {/* Batch Upload Button */}
                  <label className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all self-start sm:self-auto">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Multiple from PC</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleBatchImageUpload(e.target.files);
                      }}
                    />
                  </label>
                </div>

                {/* 5 Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[0, 1, 2, 3, 4].map((slotIdx) => {
                    const slotImg = formImages[slotIdx];
                    const isCover = slotIdx === 0;

                    return (
                      <div
                        key={slotIdx}
                        className={`relative aspect-square rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                          slotImg
                            ? 'border-slate-700 bg-slate-900 group shadow-md'
                            : 'border-dashed border-slate-800 hover:border-blue-500 bg-slate-900/50'
                        }`}
                      >
                        {slotImg ? (
                          <>
                            <img
                              src={slotImg}
                              alt={`Slot ${slotIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Slot Badge */}
                            <div className="absolute top-1.5 left-1.5 z-10">
                              <span
                                className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm ${
                                  isCover
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-950/80 text-slate-300 backdrop-blur-xs'
                                }`}
                              >
                                {isCover ? '#1 Cover' : `#${slotIdx + 1}`}
                              </span>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                              <label className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1">
                                <Upload className="w-3 h-3" />
                                <span>Change</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleSlotImageUpload(file, slotIdx);
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleRemoveSlotImage(slotIdx)}
                                className="w-full py-1 bg-rose-600/80 hover:bg-rose-600 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center gap-1 p-2 cursor-pointer text-center group">
                            <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 flex items-center justify-center transition-colors">
                              <Upload className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-300 group-hover:text-blue-400 transition-colors">
                              + Photo #{slotIdx + 1}
                            </span>
                            <span className="text-[9px] text-slate-500">
                              {isCover ? 'Main Cover' : 'Slide View'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleSlotImageUpload(file, slotIdx);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Product Colors & Image Mapping Section */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-blue-400" />
                      <span>Product Colors & Image Mapping ({formColors.length} variants)</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Add as many colors as you want and select which image appears for each color.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddColor()}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1 transition-all self-start sm:self-auto shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Color</span>
                  </button>
                </div>

                {/* Popular Presets Quick Bar */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Quick Presets:
                  </span>
                  {POPULAR_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleAddColor(preset)}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer hover:border-slate-700"
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-700" style={{ backgroundColor: preset.hex }} />
                      <span>+ {preset.name}</span>
                    </button>
                  ))}
                </div>

                {/* Colors List */}
                <div className="space-y-2.5 pt-2">
                  {formColors.length === 0 ? (
                    <div className="py-4 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                      No colors added yet. Click &quot;Add Custom Color&quot; or choose from quick presets above.
                    </div>
                  ) : (
                    formColors.map((col, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        {/* Color Picker & Name */}
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          {/* Native Color Picker swatch */}
                          <div className="relative flex-shrink-0">
                            <input
                              type="color"
                              value={col.hex.startsWith('#') ? col.hex : '#1d39f5'}
                              onChange={(e) => handleUpdateColor(idx, { hex: e.target.value })}
                              className="w-9 h-9 rounded-xl border border-slate-700 bg-transparent cursor-pointer p-0.5"
                              title="Click to pick custom color"
                            />
                          </div>

                          <input
                            type="text"
                            required
                            placeholder="Color Name (e.g. Cobalt Blue)"
                            value={col.name}
                            onChange={(e) => handleUpdateColor(idx, { name: e.target.value })}
                            className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500"
                          />

                          <input
                            type="text"
                            placeholder="#1d39f5"
                            value={col.hex}
                            onChange={(e) => handleUpdateColor(idx, { hex: e.target.value })}
                            className="w-20 font-mono text-xs px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-hidden focus:border-blue-500 text-center"
                          />
                        </div>

                        {/* Mapped Image & Actions */}
                        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between md:justify-end">
                          {/* Image Dropdown / Linker */}
                          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
                            <span className="text-[11px] font-bold text-slate-400">Shows Image:</span>
                            <select
                              value={col.image || formImages[0] || ''}
                              onChange={(e) => handleUpdateColor(idx, { image: e.target.value })}
                              className="bg-slate-900 text-[11px] font-semibold text-blue-400 border border-slate-700 rounded-lg px-2 py-1 focus:outline-hidden cursor-pointer max-w-[140px]"
                            >
                              <option value="">Choose photo...</option>
                              {formImages.map((img, imgIdx) => (
                                <option key={imgIdx} value={img}>
                                  Image #{imgIdx + 1} {imgIdx === 0 ? '(Main Cover)' : ''}
                                </option>
                              ))}
                              {col.image && !formImages.includes(col.image) && (
                                <option value={col.image}>Custom Photo</option>
                              )}
                            </select>

                            {/* Small thumbnail of linked image */}
                            {(col.image || formImages[0]) && (
                              <img
                                src={col.image || formImages[0]}
                                alt="Color image"
                                className="w-6 h-6 rounded-md object-cover border border-slate-700 flex-shrink-0"
                              />
                            )}

                            {/* Upload specific photo for this color */}
                            <label
                              title="Upload specific photo for this color from PC"
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5 text-blue-400" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleColorImageUpload(file, idx);
                                }}
                              />
                            </label>
                          </div>

                          {/* In Stock Toggle */}
                          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={col.inStock}
                              onChange={(e) => handleUpdateColor(idx, { inStock: e.target.checked })}
                              className="rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                            />
                            <span className="text-[11px]">In Stock</span>
                          </label>

                          {/* Delete Color */}
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(idx)}
                            className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-600/30 transition-colors cursor-pointer"
                            title="Remove color variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
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

              {/* Secret Supplier / Dropshipping Shopping Link */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-950 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white flex items-center gap-2">
                        <span>🔒 Secret Supplier / Shopping Link (Private)</span>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-500/30">
                          Admin Only
                        </span>
                      </label>
                      <p className="text-[10px] text-cyan-300/80 mt-0.5">
                        গ্রাহকরা এই লিংক দেখতে পাবে না। কাস্টমার এই প্রোডাক্ট অর্ডার করলে আপনি সরাসরি এই লিংকে গিয়ে অর্ডার করে দেবেন।
                      </p>
                    </div>
                  </div>
                  {formSupplierUrl && (
                    <a
                      href={formSupplierUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/40 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test Link ↗</span>
                    </a>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={formSupplierUrl}
                    onChange={(e) => setFormSupplierUrl(e.target.value)}
                    placeholder="https://aliexpress.com/item/... or https://cjdropshipping.com/... or https://amazon.com/..."
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Tip: Paste the AliExpress, CJ Dropshipping, Amazon, Printdoors, or manufacturer item URL here.
                </p>
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

      {/* Supabase Cloud Database Modal */}
      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        products={products}
        onSyncProductsFromCloud={(cloudProducts) => {
          onSyncProductsFromCloud?.(cloudProducts);
          showToast(`Loaded ${cloudProducts.length} live products directly from Supabase Cloud!`);
        }}
      />

      {/* Hero Banner Settings Modal */}
      <HeroSettingsModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        products={products}
        currentConfig={heroConfig}
        onSaveConfig={(newConfig) => {
          onUpdateHeroConfig?.(newConfig);
          showToast('Homepage Hero Banner updated successfully!');
        }}
      />

    </div>
  );
};
