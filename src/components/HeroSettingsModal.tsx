import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Eye, 
  Save, 
  Layers, 
  Star,
  Trash2
} from 'lucide-react';
import { Product, HeroConfig } from '../types';

interface HeroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentConfig?: HeroConfig;
  onSaveConfig: (newConfig: HeroConfig) => void;
}

export const HeroSettingsModal: React.FC<HeroSettingsModalProps> = ({
  isOpen,
  onClose,
  products,
  currentConfig,
  onSaveConfig,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customImage, setCustomImage] = useState<string>('');
  const [badgeText, setBadgeText] = useState('TOP BESTSELLER 2026');
  const [headline, setHeadline] = useState('Elevate Your Everyday');
  const [headlineHighlight, setHeadlineHighlight] = useState('Performance & Style.');
  const [subtitle, setSubtitle] = useState('Precision-engineered minimalism for creators and trendsetters. Premium quality crafted for everyday excellence.');
  const [featurePill, setFeaturePill] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedProductId(currentConfig?.featuredProductId || (products[0]?.id || ''));
      setCustomImage(currentConfig?.customImage || '');
      setBadgeText(currentConfig?.badgeText || 'TOP BESTSELLER 2026');
      setHeadline(currentConfig?.headline || 'Elevate Your Everyday');
      setHeadlineHighlight(currentConfig?.headlineHighlight || 'Performance & Style.');
      setSubtitle(
        currentConfig?.subtitle ||
        'Precision-engineered minimalism for creators and trendsetters. Premium quality crafted for everyday excellence.'
      );
      setFeaturePill(currentConfig?.featurePill || '');
    }
  }, [isOpen, currentConfig, products]);

  if (!isOpen) return null;

  const currentSelectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleImageUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1400;
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
          setCustomImage(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88));
        } else {
          setCustomImage(raw);
        }
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      featuredProductId: selectedProductId,
      customImage: customImage.trim() || undefined,
      badgeText: badgeText.trim(),
      headline: headline.trim(),
      headlineHighlight: headlineHighlight.trim(),
      subtitle: subtitle.trim(),
      featurePill: featurePill.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Homepage Hero Banner & Spotlight Settings</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose your top-selling product or customize the banner photo and headlines.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Section 1: Choose Spotlight / Best-Selling Product */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Featured Hero Product (Spotlight Card)</span>
              </label>
              <span className="text-[11px] text-blue-400 font-semibold">Select your top seller</span>
            </div>

            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.price} ({p.categoryLabel}) {p.badge ? `[${p.badge}]` : ''}
                </option>
              ))}
            </select>

            {/* Live Preview of Selected Product */}
            {currentSelectedProduct && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                <img
                  src={customImage || currentSelectedProduct.image}
                  alt={currentSelectedProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white truncate text-xs">{currentSelectedProduct.name}</h5>
                    <span className="text-[10px] bg-blue-600/30 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-bold">
                      ${currentSelectedProduct.price}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentSelectedProduct.tagline}</p>
                  <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
                    ✓ Image, title, price, and Quick View button will link directly to this product on homepage.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Custom Hero Image (Optional Override) */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <span>Custom Hero Showcase Photo (Optional)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Leave empty to use the product photo above, or upload a custom promotional banner photo from PC.
                </p>
              </div>

              {customImage && (
                <button
                  type="button"
                  onClick={() => setCustomImage('')}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset to Product Photo</span>
                </button>
              )}
            </div>

            {customImage ? (
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center gap-3">
                <img
                  src={customImage}
                  alt="Custom hero preview"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-600 flex-shrink-0 shadow-md"
                />
                <div className="flex-1">
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Custom Banner Photo Loaded
                  </span>
                  <div className="mt-2 flex gap-2">
                    <label className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-900/60 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="font-bold text-slate-300 group-hover:text-blue-400 text-xs">
                  Upload custom photo from computer
                </span>
                <span className="text-[10px] text-slate-500">JPG, PNG, WEBP (Auto-optimized)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </label>
            )}
          </div>

          {/* Section 3: Headlines & Text Customization */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Homepage Headlines & Badges
            </h4>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Top Badge Pill</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. TOP BESTSELLER 2026 or NEW GENERATION LINEUP"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Main Headline Line 1</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Elevate Your Everyday"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Gradient Highlight Line 2</label>
                <input
                  type="text"
                  value={headlineHighlight}
                  onChange={(e) => setHeadlineHighlight(e.target.value)}
                  placeholder="e.g. Performance & Style."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Subtitle / Bio</label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Describe your brand, collection, or highlight features..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-hidden focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Image Corner Feature Pill</label>
              <input
                type="text"
                value={featurePill}
                onChange={(e) => setFeaturePill(e.target.value)}
                placeholder="e.g. 100% Vintage Heavyweight Cotton (or leave blank to use product feature)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/25"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Homepage</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
