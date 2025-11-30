import { Injectable, signal, computed, effect } from '@angular/core';
import { Cart, CartItem, Product } from '../../models';

const CART_STORAGE_KEY = 'pawshop_cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>(this.loadCartFromStorage());

  readonly items = this.itemsSignal.asReadonly();

  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  readonly shipping = computed(() => {
    const subtotal = this.subtotal();
    if (subtotal === 0) return 0;
    // Free shipping for orders above Rp 500.000
    return subtotal >= 500000 ? 0 : 25000;
  });

  readonly total = computed(() => this.subtotal() + this.shipping());

  readonly cart = computed<Cart>(() => ({
    items: this.itemsSignal(),
    subtotal: this.subtotal(),
    shipping: this.shipping(),
    total: this.total(),
  }));

  constructor() {
    // Persist cart to localStorage whenever it changes
    effect(() => {
      const items = this.itemsSignal();
      this.saveCartToStorage(items);
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.itemsSignal();
    const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: Math.min(newQuantity, product.stock),
      };
      this.itemsSignal.set(updatedItems);
    } else {
      this.itemsSignal.set([
        ...currentItems,
        { product, quantity: Math.min(quantity, product.stock) },
      ]);
    }
  }

  removeFromCart(productId: string): void {
    this.itemsSignal.set(this.itemsSignal().filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.itemsSignal();
    const itemIndex = currentItems.findIndex((item) => item.product.id === productId);

    if (itemIndex >= 0) {
      const updatedItems = [...currentItems];
      const maxQuantity = updatedItems[itemIndex].product.stock;
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: Math.min(quantity, maxQuantity),
      };
      this.itemsSignal.set(updatedItems);
    }
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  private loadCartFromStorage(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}
