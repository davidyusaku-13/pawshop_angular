import { Injectable, signal, computed, effect } from '@angular/core';
import {
  Cart,
  CartItem,
  Product,
  SHIPPING_COST,
  SHIPPING_THRESHOLD,
  TAX_RATE,
} from '@models/index';

const CART_STORAGE_KEY = 'pawshop_cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this.itemsSignal.asReadonly();

  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly shipping = computed(() => (this.subtotal() >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST));

  readonly tax = computed(() => this.subtotal() * TAX_RATE);

  readonly total = computed(() => this.subtotal() + this.shipping() + this.tax());

  readonly cart = computed<Cart>(() => ({
    items: this.itemsSignal(),
    subtotal: this.subtotal(),
    shipping: this.shipping(),
    tax: this.tax(),
    total: this.total(),
  }));

  readonly isEmpty = computed(() => this.itemsSignal().length === 0);

  constructor() {
    // Auto-save to localStorage whenever cart changes
    effect(() => {
      this.saveToStorage(this.itemsSignal());
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.itemsSignal.update((items) => {
      const existingIndex = items.findIndex((item) => item.product.id === product.id);

      if (existingIndex >= 0) {
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(updated[existingIndex].quantity + quantity, product.stock),
        };
        return updated;
      }

      return [...items, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }

  removeFromCart(productId: string): void {
    this.itemsSignal.update((items) => items.filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.itemsSignal.update((items) =>
      items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  }

  clearCart(): void {
    this.itemsSignal.set([]);
  }

  isInCart(productId: string): boolean {
    return this.itemsSignal().some((item) => item.product.id === productId);
  }

  getCartItem(productId: string): CartItem | undefined {
    return this.itemsSignal().find((item) => item.product.id === productId);
  }

  private loadFromStorage(): CartItem[] {
    if (typeof localStorage === 'undefined') return [];

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      console.error('Failed to load cart from storage');
    }
    return [];
  }

  private saveToStorage(items: CartItem[]): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      console.error('Failed to save cart to storage');
    }
  }
}
