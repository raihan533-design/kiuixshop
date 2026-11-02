import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Key, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Package, 
  Truck, 
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { 
  getPrintdoorsConfig, 
  savePrintdoorsConfig, 
  authenticatePrintdoors, 
  fetchPrintdoorsProducts, 
  PrintdoorsConfig,
  PrintdoorsProduct 
} from '../services/printdoors';
import { Product } from '../types';

interface PrintdoorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProducts: (products: Product[]) => void;
}

export const PrintdoorsModal: React.FC<PrintdoorsModalProps> = ({
  isOpen,
  onClose,
  onImportProducts
}) => {
  const [config, setConfig] = useState<PrintdoorsConfig>(getPrintdoorsConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);

  useEffect(() => {
    setConfig(getPrintdoorsConfig());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePrintdoorsConfig(config);
    setTestResult({ success: true, message: 'Settings saved locally!' });
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTestConnection = async () => {
    if (!config.appKey || !config.appSecret) {
      setTestResult({ success: false, message: 'Please enter both App Key and App Secret.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const authRes = await authenticatePrintdoors(config.appKey, config.appSecret);
    setIsTesting(false);

    if (authRes.success) {
      const updated = { ...config, connected: true };
      setConfig(updated);
      savePrintdoorsConfig(updated);
      setTestResult({ success: true, message: 'Successfully connected to Printdoors Open API!' });
    } else {
      const updated = { ...config, connected: false };
      setConfig(updated);
      savePrintdoorsConfig(updated);
      setTestResult({ success: false, message: authRes.error || 'Connection failed.' });
    }
  };

  const handleSyncProducts = async () => {
    if (!config.appKey || !config.appSecret) {
      setTestResult({ success: false, message: 'Authenticate first before syncing products.' });
      return;
    }

    setIsSyncing(true);
    const authRes = await authenticatePrintdoors(config.appKey, config.appSecret);
    if (!authRes.success || !authRes.token) {
      setIsSyncing(false);
      setTestResult({ success: false, message: authRes.error || 'Authentication error.' });
      return;
    }

    const prodRes = await fetchPrintdoorsProducts(authRes.token);
    setIsSyncing(false);

    if (prodRes.success && prodRes.products && prodRes.products.length > 0) {
      // Map Printdoors products to KIUIX format
      const converted: Product[] = prodRes.products.map((p: PrintdoorsProduct) => ({
        id: `pd-${p.id}`,
        name: p.en_name || `Printdoors POD Item #${p.code}`,
        tagline: `High-definition Print-on-Demand custom merchandise (Code: ${p.code})`,
        price: 29.99,
        originalPrice: 45.0,
        rating: 4.8,
        reviewCount: 12,
        category: 'merch',
        categoryLabel: 'Print-on-Demand',
        badge: 'NEW',
        image: p.show_master_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        description: `Custom manufactured on-demand by Printdoors. High quality material with full edge-to-edge printing.`,
        features: [
          'Direct-to-Garment / High-Res Thermal Sublimation',
          'Premium combed ring-spun cotton & durable polyester',
          'Automated print-on-demand fulfillment'
        ],
        specs: {
          'Fulfillment Partner': 'Printdoors Global POD Network',
          'Item Code': p.code,
          'Printdoors ID': String(p.id)
        },
        colors: p.colors?.map(c => ({ name: c.en_name, hex: c.tone || '#111827', inStock: true })) || [
          { name: 'Black', hex: '#0a0a0c', inStock: true },
          { name: 'White', hex: '#ffffff', inStock: true }
        ],
        inStock: true,
        stockCount: 999
      }));

      onImportProducts(converted);
      setSyncedCount(converted.length);
      const updated = { ...config, lastSync: new Date().toLocaleString() };
      setConfig(updated);
      savePrintdoorsConfig(updated);
      setTestResult({ success: true, message: `Successfully imported ${converted.length} products from Printdoors!` });
    } else {
      setTestResult({ 
        success: false, 
        message: prodRes.error || 'No products found on this Printdoors account yet. Create products in your Printdoors merchant console first.' 
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Printdoors POD Integration</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  config.connected 
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
                    : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                }`}>
                  {config.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official API integration for custom apparel, merchandise & automatic order fulfillment
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Documentation Banner */}
        <div className="px-6 py-3 bg-blue-950/40 border-b border-blue-900/30 flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Connects directly with <strong>Printdoors Open API v1</strong></span>
          </div>
          <a
            href="https://doc.printdoors.com/web/#/637765744/264741693"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold underline underline-offset-2"
          >
            <span>View API Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Message */}
          {testResult && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 border ${
              testResult.success 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                  <span>Application Key (app_key) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={config.appKey}
                  onChange={(e) => setConfig({ ...config, appKey: e.target.value })}
                  placeholder="e.g. pd_live_key_..."
                  className="w-full text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Application Secret (app_secret) *</span>
                </label>
                <input
                  type="password"
                  required
                  value={config.appSecret}
                  onChange={(e) => setConfig({ ...config, appSecret: e.target.value })}
                  placeholder="••••••••••••••••"
                  className="w-full text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>Store ID (store_id)</span>
                </label>
                <input
                  type="text"
                  value={config.storeId || ''}
                  onChange={(e) => setConfig({ ...config, storeId: e.target.value })}
                  placeholder="e.g. 406"
                  className="w-full text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Provided in your Printdoors store list</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Logistics Channel ID</span>
                </label>
                <input
                  type="text"
                  value={config.logisticsPlatformId || '774'}
                  onChange={(e) => setConfig({ ...config, logisticsPlatformId: e.target.value })}
                  placeholder="Default: 774"
                  className="w-full text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Logistics channel identifier (default: 774)</span>
              </div>
            </div>

            {/* Auto-fulfill toggle */}
            <div className="pt-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Automatic Print & Fulfillment Forwarding</span>
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automatically submit customer orders to Printdoors upon successful Stripe checkout
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.autoFulfill}
                onChange={(e) => setConfig({ ...config, autoFulfill: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-blue-400' : ''}`} />
                <span>{isTesting ? 'Testing API...' : 'Test Connection'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncProducts}
                disabled={isSyncing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Package className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Importing Products...' : 'Sync Products from Printdoors'}</span>
              </button>

              <button
                type="submit"
                className="ml-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>

          {/* Sync Information */}
          {config.lastSync && (
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span>Last synced with Printdoors: {config.lastSync}</span>
              {syncedCount !== null && (
                <span className="text-emerald-400 font-semibold">{syncedCount} items active</span>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Endpoint: <code className="text-blue-400 font-mono text-[11px]">https://openapi.printdoors.com</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
