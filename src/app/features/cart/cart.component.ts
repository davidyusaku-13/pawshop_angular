import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
                    (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
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
                  (click)="cartService.removeFromCart(item.product.id)"
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
              (click)="cartService.clearCart()"
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
}
