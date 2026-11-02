# 🚀 KIUIXSHOP — Universal Stripe Multi-Payment & Linking Guide

এই গাইডে বিস্তারিতভাবে দেওয়া হয়েছে কিভাবে আপনি আপনার আসল **Stripe অ্যাকাউন্ট সাইটের সাথে লিংক করবেন** এবং কিভাবে শুধু কার্ড বা অ্যাপল পে ছাড়াও **Klarna (৪ কিস্তি), Google Pay, Cash App, Afterpay, এবং ব্যাংক ট্রান্সফার** সহ সব ধরণের পেমেন্ট মেথড সক্রিয় করবেন।

---

## 🔗 ১. Stripe সাইটের সাথে লিংক করতে কি করতে হবে? (How to Link Stripe)

Stripe কানেক্ট করা খুবই সহজ। ৩টি ধাপে এটি সম্পন্ন করা যায়:

### ধাপ ১: Stripe অ্যাকাউন্ট তৈরি ও API Key নেওয়া
1. [stripe.com](https://stripe.com)-এ গিয়ে একটি ফ্রি অ্যাকাউন্ট খুলুন (বা লগইন করুন)।
2. ড্যাশবোর্ডের ডান পাশে উপরে **Developers** &rarr; **API keys** ট্যাবে যান।
3. সেখান থেকে ২টি কি কপি করুন:
   - **Publishable Key:** `pk_live_...` (বা টেস্ট করার জন্য `pk_test_...`)
   - **Secret Key:** `sk_live_...` (বা টেস্ট করার জন্য `sk_test_...`)

### ধাপ ২: প্রজেক্টে Key বসানো
প্রজেক্টের `.env.example` ফাইলটি কপি করে `.env` নামে সেভ করুন এবং কিগুলো বসান:
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_আপনার_পাবলিশেবল_কি
STRIPE_SECRET_KEY=sk_live_আপনার_সিক্রেট_কি
MERCHANT_EMAIL=kiuixshop@gmail.com
```

### ধাপ ৩: রান করা
প্রজেক্টে দেওয়া `stripe-server-sample.js` সার্ভারলেস কোড রান করলেই আপনার সাইটের চেকআউট বাটনটি সরাসরি আসল স্ট্রাইপের সাথে যুক্ত হয়ে যাবে।

---

## 💳 ২. কার্ড এবং অ্যাপল পে ছাড়াও Stripe-এর সব কিছু দিয়ে পেমেন্ট নেওয়ার নিয়ম

Stripe-এ কার্ড ও Apple Pay ছাড়াও **১০০টিরও বেশি পেমেন্ট মেথড** রয়েছে। আপনি এগুলো ১ ক্লিকেই সক্রিয় করতে পারেন:

### Stripe Dashboard-এ মেথড অন করার নিয়ম:
1. আপনার Stripe Dashboard-এ যান &rarr; **Settings** &rarr; **Payment methods**-এ ক্লিক করুন।
2. সেখানে তালিকা দেখতে পাবেন:
   - **Cards:** Visa, Mastercard, American Express, Discover
   - **Wallets:** Apple Pay, Google Pay, Cash App Pay, Link
   - **Buy Now, Pay Later (BNPL):** Klarna (৪ কিস্তিতে পে), Afterpay / Clearpay, Affirm
   - **Bank Transfers & Local:** iDEAL (ইউরোপ), SEPA Direct Debit, ACH (আমেরিকা)
3. প্রতিটি মেথডের পাশে **"Turn On"** বা **"Enable"** বাটনে ক্লিক করুন। কোনো অতিরিক্ত কোডিং করতে হবে না!

### স্বয়ংক্রিয় ডিটেকশন (`automatic_payment_methods: { enabled: true }`):
আমাদের কোডে দেওয়া হয়েছে:
```javascript
const session = await stripe.checkout.sessions.create({
  line_items,
  mode: 'payment',
  customer_email: customerEmail,
  automatic_payment_methods: {
    enabled: true, // এটি অন থাকলেই কাস্টমারের দেশ অনুযায়ী সব মেথড ভেসে উঠবে!
  },
  success_url: '...',
  cancel_url: '...'
});
```
- **আইফোন বা ম্যাক ব্যবহারকারী:** সরাসরি **Apple Pay** দেখতে পাবে।
- **অ্যান্ড্রয়েড বা ক্রোম ব্যবহারকারী:** সরাসরি **Google Pay** দেখতে পাবে।
- **আমেরিকান ক্রেতারা:** **Cash App Pay**, **Afterpay** দেখতে পাবে।
- **কিস্তিতে কিনতে চাওয়া ক্রেতারা:** **Klarna (Pay in 4)** দেখতে পাবে।
- **ইউরোপীয় ক্রেতারা:** **iDEAL** ও **SEPA Direct Debit** দেখতে পাবে।
- **অন্যান্য সবাই:** যেকোনো **Credit/Debit Card** দিয়ে পে করতে পারবে।

সব টাকা সরাসরি আপনার একটাই Stripe ব্যাংক অ্যাকাউন্টে জমা হবে!

---

## 📧 ৩. পেমেন্ট রিসিট (Receipt) ইমেইল স্বয়ংক্রিয়ভাবে যাওয়ার নিয়ম

যেকোনো মেথড (Card, Klarna, Cash App, ইত্যাদি) দিয়ে পেমেন্ট সম্পন্ন হওয়ামাত্র:
1. **Stripe Webhook** ট্রিগার হয়ে স্বয়ংক্রিয়ভাবে একটি চমৎকার HTML চালান/রিসিট কাস্টমারের ইমেইলে পাঠিয়ে দেবে।
2. সাথে সাথে এর একটি নোটিফিকেশন কপি আপনার অফিসিয়াল ইমেইল **`kiuixshop@gmail.com`**-এ চলে আসবে।
3. সাইটের সাকসেস স্ক্রিনে কাস্টমার যেকোনো সময় **"Send Receipt to Another Email"** বা **"Print Invoice"** করতে পারবে।
