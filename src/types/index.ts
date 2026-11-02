export interface CategoryItem {
  id: string;
  label: string;
  isCustom?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  categoryLabel: string;
  badge?: 'BEST SELLER' | 'NEW' | 'FEATURED' | 'HOT DEAL';
  image: string;
  secondaryImage?: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors: { name: string; hex: string; inStock: boolean }[];
  inStock: boolean;
  stockCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD
}

export interface CustomerReview {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  productName: string;
}
