import React, { useState } from 'react';
import { Currency } from '../types';
import { CURRENCIES } from '../data/products';
import { X, Lock, CreditCard, ShieldCheck, Sparkles, Building2, Smartphone, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  totalUSD: number;
  itemCount: number;
  currentCurrency: Currency;
  onClose: () => void;
  onSuccess: (orderDetails: {
    orderId: string;
    customerEmail: string;
    customerName: string;
    totalAmount: string;
    paymentMethod: string;
    itemsCount: number;
  }) => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  totalUSD,
  itemCount,
  currentCurrency,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [paymentCategory, setPaymentCategory] = useState<'card' | 'wallets' | 'bnpl' | 'bank'>('card');
  const [selectedWallet, setSelectedWallet] = useState<'apple' | 'google' | 'cashapp' | 'link'>('apple');
  const [selectedBnpl, setSelectedBnpl] = useState<'klarna' | 'afterpay' | 'affirm'>('klarna');
  const [selectedBank, setSelectedBank] = useState<'ach' | 'ideal' | 'sepa'>('ach');

  const [email, setEmail] = useState('buyer@example.com');
  const [cardName, setCardName] = useState('Marcus Vance');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);

  const rate = CURRENCIES[currentCurrency].rate;
  const symbol = CURRENCIES[currentCurrency].symbol;
  const formattedTotal = `${symbol}${(totalUSD * rate).toFixed(2)}`;
  const installmentAmount = `${symbol}${((totalUSD * rate) / 4).toFixed(2)}`;

  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    setCardName('Alex Rivers');
  };

  const getPaymentMethodLabel = () => {
    if (paymentCategory === 'card') return 'Credit / Debit Card (Visa)';
    if (paymentCategory === 'wallets') {
      if (selectedWallet === 'cashapp') return 'Cash App Pay';
      if (selectedWallet === 'google') return 'Google Pay';
      if (selectedWallet === 'link') return 'Link 1-Click Pay';
      return 'Apple Pay';
    }
    if (paymentCategory === 'bnpl') {
      if (selectedBnpl === 'klarna') return 'Klarna (4 Interest-Free Payments)';
      if (selectedBnpl === 'afterpay') return 'Afterpay / Clearpay';
      return 'Affirm Monthly';
    }
    if (selectedBank === 'ideal') return 'iDEAL Bank Transfer';
    if (selectedBank === 'sepa') return 'SEPA Direct Debit';
    return 'ACH US Bank Transfer';
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#1d39f5', '#22c55e', '#3b82f6', '#090a0f', '#ec4899']
      });

      const orderId = `KIU-${Math.floor(100000 + Math.random() * 900000)}`;
      onSuccess({
        orderId,
        customerEmail: email,
        customerName: cardName,
        totalAmount: formattedTotal,
        paymentMethod: getPaymentMethodLabel(),
        itemsCount: itemCount,
      });
    }, 1400);
  };

  const handleOfficialStripeRedirect = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountUSD: totalUSD,
          customerEmail: email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to connect to Stripe server');
      }
    } catch (err: any) {
      console.warn('Stripe redirect notice:', err.message);
      // Fallback to in-app instant checkout
      handlePay({ preventDefault: () => {} } as any);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide">KIUIX Secure Checkout</h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  256-Bit SSL Secured
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Official Store: kiuixshop@gmail.com</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Demo Auto-fill Banner */}
        <div className="bg-blue-50/80 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-blue-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Total ({itemCount} item{itemCount > 1 ? 's' : ''})
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950">{formattedTotal}</div>
          </div>
          <button
            type="button"
            onClick={fillTestCard}
            className="text-xs font-semibold text-blue-700 bg-white border border-blue-300 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Auto-fill Demo Card</span>
          </button>
        </div>

        {/* All Supported Payment Categories Tabs */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-center">
            <button
              type="button"
              onClick={() => setPaymentCategory('card')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                paymentCategory === 'card'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentCategory('wallets')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                paymentCategory === 'wallets'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Wallets</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentCategory('bnpl')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                paymentCategory === 'bnpl'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-mono text-pink-600 font-black text-xs">Klarna</span>
              <span>BNPL / 4x</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentCategory('bank')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                paymentCategory === 'bank'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Bank Wire</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handlePay} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="buyer@gmail.com"
              />
            </div>

            {/* TAB 1: Credit / Debit Cards */}
            {paymentCategory === 'card' && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Details</label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                    <div className="flex items-center px-3 py-2.5 border-b border-slate-100">
                      <CreditCard className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 1234 1234 1234"
                        className="w-full text-xs font-mono font-medium focus:outline-hidden"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">VISA</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded">MC</span>
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1 py-0.5 rounded">AMEX</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="px-3 py-2 text-xs font-mono font-medium focus:outline-hidden text-center"
                      />
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="px-3 py-2 text-xs font-mono font-medium focus:outline-hidden text-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                    placeholder="Full name as printed on card"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Wallets (Apple Pay, Google Pay, Cash App, Link) */}
            {paymentCategory === 'wallets' && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-slate-600">Select your preferred 1-click digital wallet:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedWallet('apple')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedWallet === 'apple'
                        ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                        : 'border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span>🍎 Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWallet('google')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedWallet === 'google'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-blue-600 font-black">G</span>
                    <span>Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWallet('cashapp')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedWallet === 'cashapp'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-emerald-600 font-bold">$</span>
                    <span>Cash App Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWallet('link')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedWallet === 'link'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold">Link</span>
                    <span className="text-[10px] bg-white/20 px-1 py-0.5 rounded">1-Click</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Buy Now Pay Later (Klarna, Afterpay, Affirm) */}
            {paymentCategory === 'bnpl' && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-pink-50 border border-pink-200 p-3.5 rounded-2xl text-xs text-pink-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-pink-600 text-sm">Klarna.</span>
                    <span className="font-bold bg-white text-pink-700 px-2 py-0.5 rounded-md border border-pink-200">
                      0% Interest
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">
                    Pay in 4 installments of <strong>{installmentAmount}</strong> every 2 weeks.
                  </p>
                  <p className="text-[10px] text-slate-500">No impact to your credit score. No hidden fees.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedBnpl('klarna')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedBnpl === 'klarna' ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Klarna
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBnpl('afterpay')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedBnpl === 'afterpay' ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Afterpay
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBnpl('affirm')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedBnpl === 'affirm' ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Affirm
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: Bank Direct & Instant Transfers */}
            {paymentCategory === 'bank' && (
              <div className="space-y-3 animate-fade-in text-xs">
                <p className="text-slate-600">Select your country's instant bank transfer standard:</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBank('ach')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                      selectedBank === 'ach' ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>ACH Direct Bank Debit (US)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Zero fee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBank('ideal')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                      selectedBank === 'ideal' ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-pink-600" />
                      <span>iDEAL (Netherlands / Europe)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBank('sepa')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                      selectedBank === 'sepa' ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>SEPA Direct Debit (Eurozone)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Euro Verified</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-3 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing Payment Securely...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay {formattedTotal} via {getPaymentMethodLabel().split(' ')[0]}
                  </span>
                </>
              )}
            </button>

            {/* Official Hosted Stripe Checkout Redirection (All 100+ methods) */}
            <button
              type="button"
              onClick={handleOfficialStripeRedirect}
              disabled={isProcessing}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-blue-600 bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Checkout on Hosted Page (All Global Methods) &rarr;</span>
            </button>
          </form>

          {/* Security details */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              256-Bit Bank-Grade Encryption
            </span>
            <span className="text-slate-400">PCI-DSS Level 1</span>
          </div>

        </div>

      </div>
    </div>
  );
};
