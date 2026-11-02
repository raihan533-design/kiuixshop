import React, { useState } from 'react';
import { CheckCircle2, Download, ArrowRight, Mail, ShieldCheck, Send, Check, Sparkles } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderDetails: {
    orderId: string;
    customerEmail: string;
    customerName: string;
    totalAmount: string;
    paymentMethod: string;
    itemsCount: number;
  } | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderDetails,
  onClose,
}) => {
  if (!isOpen || !orderDetails) return null;

  const [resendEmail, setResendEmail] = useState(orderDetails.customerEmail);
  const [isSending, setIsSending] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleResendReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setEmailSentSuccess(true);
      setTimeout(() => setEmailSentSuccess(false), 4000);
    }, 1200);
  };

  const mailtoSubject = encodeURIComponent(`Payment Receipt for Order #${orderDetails.orderId} - KIUIXSHOP`);
  const mailtoBody = encodeURIComponent(
`KIUIXSHOP PAYMENT RECEIPT
--------------------------------------
Order ID: ${orderDetails.orderId}
Customer Name: ${orderDetails.customerName}
Customer Email: ${orderDetails.customerEmail}
Total Amount Paid: ${orderDetails.totalAmount}
Payment Method: ${orderDetails.paymentMethod}
Status: Confirmed & Paid
Items Count: ${orderDetails.itemsCount}

Merchant: KIUIX Store (kiuixshop@gmail.com)
Thank you for shopping with KIUIXSHOP!`
  );

  const mailtoLink = `mailto:${orderDetails.customerEmail}?cc=kiuixshop@gmail.com&subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Banner with Animated Celebration */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 ring-8 ring-white/10 shadow-lg">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Payment Successful!</h2>
          <p className="text-blue-100 text-xs mt-1">Thank you for choosing KIUIX. Your order is confirmed.</p>
        </div>

        {/* Receipt Content */}
        <div className="p-5 sm:p-8 space-y-4 sm:space-y-5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Order Number</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {orderDetails.orderId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Customer</span>
              <span className="font-semibold text-slate-800">{orderDetails.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Recipient Email</span>
              <span className="font-semibold text-slate-800">{orderDetails.customerEmail}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Payment Method</span>
              <span className="font-semibold text-blue-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {orderDetails.paymentMethod}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-950">
              <span>Paid Amount</span>
              <span className="text-blue-600 text-base">{orderDetails.totalAmount}</span>
            </div>
          </div>

          {/* Email Notification Status */}
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-start gap-2.5 text-xs text-blue-900">
              <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Payment Receipt Email Dispatched</p>
                <p className="text-[11px] text-blue-700/80 mt-0.5">
                  A copy of this invoice was sent to <strong>{orderDetails.customerEmail}</strong> and logged at <strong>kiuixshop@gmail.com</strong>.
                </p>
              </div>
            </div>

            {/* Interactive Resend Email Box */}
            <form onSubmit={handleResendReceipt} className="pt-2 border-t border-blue-200/50 flex gap-2">
              <input
                type="email"
                required
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="Send receipt to another email..."
                className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 font-medium"
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-75"
              >
                {isSending ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : emailSentSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </form>

            {emailSentSuccess && (
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                ✓ Receipt email sent to {resendEmail}!
              </p>
            )}
          </div>

          {/* Action Buttons: Print, Mailto, Return to Store */}
          <div className="space-y-2 pt-1">
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Invoice</span>
              </button>

              <a
                href={mailtoLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs text-center"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Open in Email</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <span>Back to Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
