export interface CategoryItem {
  id: string;
  label: string;
  isCustom?: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
  image?: string; // Linked image for this color variant
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
  images?: string[]; // Gallery of up to 5+ images for slider
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors: ProductColor[];
  inStock: boolean;
  stockCount: number;
  supplierUrl?: string; // Private supplier/dropshipping shopping link (admin only)
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedColor: string;
  supplierUrl?: string;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  totalAmount: string;
  totalUSD: number;
  paymentMethod: string;
  items: OrderItem[];
  status: 'PENDING_FULFILLMENT' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
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

export interface HeroConfig {
  featuredProductId?: string;
  customImage?: string;
  badgeText?: string;
  headline?: string;
  headlineHighlight?: string;
  subtitle?: string;
  featurePill?: string;
}
