import { Address } from './user.model';
import { CartItem } from './cart.model';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
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

export type PaymentMethod = 'bank-transfer' | 'e-wallet' | 'cod';

export interface PaymentInfo {
  method: PaymentMethod;
  bankName?: string;
  accountNumber?: string;
  eWalletType?: 'gopay' | 'ovo' | 'dana' | 'shopeepay';
}
