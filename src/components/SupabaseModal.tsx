import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Check, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  CloudUpload, 
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  getSupabaseClient, 
  SUPABASE_SQL_SCHEMA,
  rowToProduct,
  supabaseBulkUpsert
} from '../lib/supabase';
import { Product } from '../types';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSyncProductsFromCloud: (cloudProducts: Product[]) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  products,
  onSyncProductsFromCloud,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    saveSupabaseConfig({ url: url.trim(), anonKey: anonKey.trim() });
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    handleSaveConfig();

    try {
      const client = getSupabaseClient();
      if (!client) {
        setTestResult({
          success: false,
          message: 'Please provide both Supabase Project URL and anon public key.',
        });
        setTesting(false);
        return;
      }

      const { data, error } = await client.from('products').select('id').limit(1);

      if (error) {
        setTestResult({
          success: false,
          message: `Database Error: ${error.message}. Did you run the SQL script in Supabase SQL editor?`,
        });
      } else {
        setTestResult({
          success: true,
          message: `Connected successfully! Table "products" is active. (Found ${data?.length ?? 0} items)`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection failed. Please check your credentials.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleUploadCatalogToCloud = async () => {
    setUploading(true);
    handleSaveConfig();

    try {
      const { error } = await supabaseBulkUpsert(products);

      if (error) {
        alert(`Upload failed: ${error.message}`);
      } else {
        alert(`Success! ${products.length} products uploaded to Supabase Cloud Database! Now everyone in the world can see them.`);
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePullFromCloud = async () => {
    setTesting(true);
    handleSaveConfig();

    try {
      const client = getSupabaseClient();
      if (!client) return;

      const { data, error } = await client.from('products').select('*');
      if (error) {
        alert(`Pull error: ${error.message}`);
      } else if (data && data.length > 0) {
        const cloudProducts = data.map(rowToProduct);
        onSyncProductsFromCloud(cloudProducts);
        alert(`Loaded ${cloudProducts.length} live products directly from Supabase Cloud!`);
      } else {
        alert('Cloud database currently has 0 products. Click "Upload Current Catalog to Cloud" to send your store products.');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Global Cloud Database (Supabase)</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Real-Time Storefront
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every product you add will instantly sync live across all browsers and devices worldwide.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Quick Guide Card */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 space-y-2 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                How to setup your 100% Free Supabase Database in 2 Minutes:
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Go to <strong className="text-white">supabase.com</strong>, log in, and click <strong className="text-white">&quot;New Project&quot;</strong>.</li>
              <li>In your project, click <strong className="text-white">SQL Editor</strong> on the left menu.</li>
              <li>
                Click the button below to copy the table schema, paste it in SQL Editor, and click <strong className="text-white">&quot;Run&quot;</strong>:
              </li>
            </ol>

            <button
              type="button"
              onClick={handleCopySQL}
              className="mt-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSQL ? 'SQL Script Copied!' : 'Copy Supabase SQL Table Script'}</span>
            </button>
          </div>

          {/* Credentials Inputs */}
          <div className="space-y-3.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Database API Credentials (From Project Settings → API)
            </h4>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Project URL (e.g. https://your-project.supabase.co)
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                anon public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !url.trim() || !anonKey.trim()}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleUploadCatalogToCloud}
              disabled={uploading || !url.trim() || !anonKey.trim()}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 transition-all"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${uploading ? 'animate-bounce' : ''}`} />
              <span>{uploading ? 'Uploading...' : 'Upload All to Cloud'}</span>
            </button>

            <button
              type="button"
              onClick={handlePullFromCloud}
              disabled={testing || !url.trim() || !anonKey.trim()}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 transition-all"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Load Live from Cloud</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure SSL Cloud Database</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
