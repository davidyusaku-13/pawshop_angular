import { Address } from './user.model';
import { CartItem } from './cart.model';

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface PaymentMethod {
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
}

export interface OrderSummary {
  id: string;
  total: number;
  itemCount: number;
  status: OrderStatus;
  createdAt: string;
}
