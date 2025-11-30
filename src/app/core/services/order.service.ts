import { Injectable, signal, computed, inject } from '@angular/core';
import { Order, PaymentMethod } from '../../models/order.model';
import { Address } from '../../models/user.model';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import ordersData from '../../data/orders.json';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  private readonly orders = signal<Order[]>(ordersData as Order[]);

  readonly userOrders = computed(() => {
    const user = this.authService.user();
    if (!user) return [];
    return this.orders().filter((o) => o.userId === user.id);
  });

  constructor() {
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage(): void {
    const stored = localStorage.getItem('pawshop_orders');
    if (stored) {
      try {
        const storedOrders = JSON.parse(stored) as Order[];
        this.orders.set([...(ordersData as Order[]), ...storedOrders]);
      } catch {
        // Keep default orders
      }
    }
  }

  private saveOrdersToStorage(): void {
    const newOrders = this.orders().filter(
      (o) => !(ordersData as Order[]).some((d) => d.id === o.id)
    );
    localStorage.setItem('pawshop_orders', JSON.stringify(newOrders));
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `PW-${dateStr}-${random}`;
  }

  createOrder(shippingAddress: Address, paymentMethod: PaymentMethod, notes?: string): Order {
    const user = this.authService.user();
    const cartItems = this.cartService.items();
    const subtotal = this.cartService.subtotal();
    const shipping = this.cartService.shipping();
    const total = this.cartService.total();

    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: this.generateOrderNumber(),
      userId: user?.id,
      items: cartItems.map((item) => ({
        product: { ...item.product },
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      subtotal,
      shipping,
      total,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.update((orders) => [...orders, order]);
    this.saveOrdersToStorage();
    this.cartService.clearCart();

    return order;
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders().find((o) => o.id === orderId);
  }

  getOrderByNumber(orderNumber: string): Order | undefined {
    return this.orders().find((o) => o.orderNumber === orderNumber);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  getStatusLabel(status: Order['status']): string {
    const labels: Record<Order['status'], string> = {
      pending: 'Pending Payment',
      confirmed: 'Payment Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status];
  }

  getStatusColor(status: Order['status']): string {
    const colors: Record<Order['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status];
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    const labels: Record<PaymentMethod, string> = {
      'bank-transfer': 'Bank Transfer',
      'e-wallet': 'E-Wallet',
      cod: 'Cash on Delivery',
    };
    return labels[method];
  }
}
