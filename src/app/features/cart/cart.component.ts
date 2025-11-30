import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

interface ConfirmDialog {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  type: 'remove' | 'clear';
  productId?: string;
}

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Confirmation Modal -->
    @if (dialog().isOpen) {
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        (click)="closeDialog()"
      ></div>

      <!-- Modal -->
      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        <div class="p-6">
          <!-- Icon -->
          <div
            class="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-7 h-7 text-red-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>

          <!-- Content -->
          <h3 id="modal-title" class="text-lg font-semibold text-gray-900 text-center mb-2">
            {{ dialog().title }}
          </h3>
          <p class="text-gray-500 text-center text-sm">
            {{ dialog().message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 p-6 pt-0">
          <button
            type="button"
            class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            (click)="closeDialog()"
          >
            Cancel
          </button>
          <button
            type="button"
            class="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer"
            (click)="confirmAction()"
          >
            {{ dialog().confirmText }}
          </button>
        </div>
      </div>
    </div>
    }

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-orange-600">Home</a>
        <span>/</span>
        <span class="text-gray-900">Shopping Cart</span>
      </nav>

      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      @if (cartService.items().length > 0) {
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          @for (item of cartService.items(); track item.product.id) {
          <article class="bg-white rounded-xl p-4 shadow-sm flex gap-4 items-start">
            <a [routerLink]="['/products', item.product.slug]" class="flex-shrink-0">
              <img
                [src]="item.product.images[0]"
                [alt]="item.product.name"
                class="w-24 h-24 object-cover rounded-lg"
              />
            </a>
            <div class="flex-1 min-w-0">
              <a
                [routerLink]="['/products', item.product.slug]"
                class="font-medium text-gray-900 hover:text-orange-600 line-clamp-2"
              >
                {{ item.product.name }}
              </a>
              <p class="text-orange-600 font-semibold mt-1">
                {{ cartService.formatPrice(item.product.price) }}
              </p>
              <div class="mt-3 flex items-center gap-4">
                <div class="flex items-center border border-gray-200 rounded-lg">
                  <button
                    type="button"
                    class="px-3 py-1 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
                    (click)="decreaseQuantity(item.product.id, item.quantity)"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span class="w-10 text-center py-1">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="px-3 py-1 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    [disabled]="item.quantity >= item.product.stock"
                    (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  class="text-red-500 hover:text-red-700 active:text-red-800 text-sm cursor-pointer transition-colors"
                  (click)="confirmRemove(item.product.id)"
                >
                  Remove
                </button>
              </div>
            </div>
            <p class="font-semibold text-gray-900">
              {{ cartService.formatPrice(item.product.price * item.quantity) }}
            </p>
          </article>
          }

          <div class="flex justify-between items-center pt-4">
            <a
              routerLink="/products"
              class="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2 cursor-pointer transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Continue Shopping
            </a>
            <button
              type="button"
              class="text-gray-500 hover:text-red-600 active:text-red-700 text-sm cursor-pointer transition-colors"
              (click)="confirmClearCart()"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">{{
                  cartService.formatPrice(cartService.subtotal())
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                @if (cartService.shipping() === 0) {
                <span class="text-green-600 font-medium">FREE</span>
                } @else {
                <span class="font-medium">{{
                  cartService.formatPrice(cartService.shipping())
                }}</span>
                }
              </div>
              @if (cartService.shipping() > 0) {
              <p class="text-xs text-gray-500">Free shipping for orders over Rp 500.000</p>
              }
              <hr class="my-4" />
              <div class="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span class="text-orange-600">{{
                  cartService.formatPrice(cartService.total())
                }}</span>
              </div>
            </div>

            <button
              type="button"
              class="w-full mt-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 active:bg-orange-800 transition-colors cursor-pointer"
              routerLink="/checkout"
            >
              Proceed to Checkout
            </button>

            <div class="mt-6 space-y-2 text-sm text-gray-500">
              <div class="flex items-center gap-2">
                <span>🔒</span>
                <span>Secure checkout</span>
              </div>
              <div class="flex items-center gap-2">
                <span>↩️</span>
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      } @else {
      <div class="text-center py-16">
        <span class="text-6xl mb-4 block">🛒</span>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <a
          routerLink="/products"
          class="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Start Shopping
        </a>
      </div>
      }
    </div>
  `,
})
export class CartComponent {
  protected readonly cartService = inject(CartService);

  protected readonly dialog = signal<ConfirmDialog>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    type: 'remove',
  });

  protected decreaseQuantity(productId: string, currentQuantity: number): void {
    if (currentQuantity === 1) {
      this.openRemoveDialog(productId);
    } else {
      this.cartService.updateQuantity(productId, currentQuantity - 1);
    }
  }

  protected openRemoveDialog(productId: string): void {
    this.dialog.set({
      isOpen: true,
      title: 'Remove Item',
      message:
        'Are you sure you want to remove this item from your cart? This action cannot be undone.',
      confirmText: 'Remove',
      type: 'remove',
      productId,
    });
  }

  protected confirmRemove(productId: string): void {
    this.openRemoveDialog(productId);
  }

  protected confirmClearCart(): void {
    this.dialog.set({
      isOpen: true,
      title: 'Clear Cart',
      message:
        'Are you sure you want to remove all items from your cart? This action cannot be undone.',
      confirmText: 'Clear All',
      type: 'clear',
    });
  }

  protected closeDialog(): void {
    this.dialog.update((d) => ({ ...d, isOpen: false }));
  }

  protected confirmAction(): void {
    const currentDialog = this.dialog();
    if (currentDialog.type === 'remove' && currentDialog.productId) {
      this.cartService.removeFromCart(currentDialog.productId);
    } else if (currentDialog.type === 'clear') {
      this.cartService.clearCart();
    }
    this.closeDialog();
  }
}
