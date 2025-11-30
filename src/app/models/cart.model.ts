import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const SHIPPING_THRESHOLD = 50; // Free shipping over $50
export const SHIPPING_COST = 5.99;
export const TAX_RATE = 0.08; // 8% tax
