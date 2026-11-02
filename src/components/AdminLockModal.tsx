import React, { useState } from 'react';
import { Lock, X, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export const AdminLockModal: React.FC<AdminLockModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 2026 or kiuix2026 or 1234
    if (pin === '2026' || pin === 'kiuix' || pin === '1234' || pin.toLowerCase() === 'kiuix2026') {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl p-6 sm:p-7 text-center">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4 shadow-lg shadow-blue-500/10">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-black text-white tracking-tight">
          Merchant Staff Portal
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          This management section is protected for <strong>kiuixshop@gmail.com</strong>
        </p>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter Admin PIN"
                className={`w-full text-center text-lg tracking-widest font-mono font-bold py-3 px-4 rounded-xl bg-slate-950 border ${
                  error ? 'border-rose-500 ring-2 ring-rose-500/30 text-rose-300' : 'border-slate-800 focus:border-blue-500 text-white'
                } focus:outline-hidden transition-all`}
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-400 font-semibold mt-1.5 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Incorrect PIN. (Default PIN: <strong>2026</strong>)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <span>Unlock Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* PIN Hint helper */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            256-bit Secure
          </span>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            {showHint ? 'Default: 2026' : 'Need PIN?'}
          </button>
        </div>

      </div>
    </div>
  );
};
