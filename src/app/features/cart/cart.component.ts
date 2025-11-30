import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '@core/services';
import { SHIPPING_THRESHOLD } from '@models/cart.model';

@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 py-3">
          <nav class="flex items-center gap-2 text-sm">
            <a routerLink="/" class="text-gray-500 hover:text-amber-600">Home</a>
            <span class="text-gray-300">/</span>
            <span class="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        @if (cartService.isEmpty()) {
        <!-- Empty Cart -->
        <div class="bg-white rounded-xl shadow-sm p-12 text-center">
          <span class="text-6xl mb-4 block">🛒</span>
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p class="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
          <a
            routerLink="/products"
            class="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
        } @else {
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of cartService.items(); track item.product.id) {
            <div class="bg-white rounded-xl shadow-sm p-4 flex gap-4">
              <!-- Image -->
              <a [routerLink]="['/product', item.product.slug]" class="shrink-0">
                <img
                  [src]="item.product.images[0]"
                  [alt]="item.product.name"
                  class="w-24 h-24 object-cover rounded-lg"
                />
              </a>

              <!-- Details -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between gap-4">
                  <div>
                    <h3 class="font-medium text-gray-900">
                      <a
                        [routerLink]="['/product', item.product.slug]"
                        class="hover:text-amber-600 transition-colors"
                      >
                        {{ item.product.name }}
                      </a>
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">{{ item.product.brand }}</p>
                  </div>
                  <button
                    type="button"
                    class="text-gray-400 hover:text-red-500 transition-colors p-1"
                    (click)="removeItem(item.product.id)"
                    aria-label="Remove item"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div class="flex items-center justify-between mt-4">
                  <!-- Quantity -->
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button
                      type="button"
                      class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      [disabled]="item.quantity <= 1"
                      (click)="updateQuantity(item.product.id, item.quantity - 1)"
                      aria-label="Decrease quantity"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span class="w-10 text-center font-medium text-sm">{{ item.quantity }}</span>
                    <button
                      type="button"
                      class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      [disabled]="item.quantity >= item.product.stock"
                      (click)="updateQuantity(item.product.id, item.quantity + 1)"
                      aria-label="Increase quantity"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Price -->
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">
                      {{ item.product.price * item.quantity | currency }}
                    </p>
                    @if (item.quantity > 1) {
                    <p class="text-sm text-gray-500">{{ item.product.price | currency }} each</p>
                    }
                  </div>
                </div>
              </div>
            </div>
            }

            <!-- Clear cart -->
            <div class="flex justify-end">
              <button
                type="button"
                class="text-red-500 hover:text-red-700 font-medium transition-colors"
                (click)="clearCart()"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <!-- Free shipping progress -->
              @if (cartService.shipping() > 0) {
              <div class="mb-6 p-4 bg-amber-50 rounded-lg">
                <p class="text-sm text-amber-800 mb-2">
                  Add <strong>{{ amountToFreeShipping() | currency }}</strong> more for free
                  shipping!
                </p>
                <div class="w-full bg-amber-200 rounded-full h-2">
                  <div
                    class="bg-amber-600 h-2 rounded-full transition-all"
                    [style.width.%]="freeShippingProgress()"
                  ></div>
                </div>
              </div>
              } @else {
              <div class="mb-6 p-4 bg-emerald-50 rounded-lg flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p class="text-sm text-emerald-800 font-medium">You've got free shipping! 🎉</p>
              </div>
              }

              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal ({{ cartService.itemCount() }} items)</span>
                  <span class="font-medium">{{ cartService.subtotal() | currency }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Shipping</span>
                  @if (cartService.shipping() === 0) {
                  <span class="text-emerald-600 font-medium">FREE</span>
                  } @else {
                  <span class="font-medium">{{ cartService.shipping() | currency }}</span>
                  }
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Estimated Tax</span>
                  <span class="font-medium">{{ cartService.tax() | currency }}</span>
                </div>
                <hr class="border-gray-200" />
                <div class="flex justify-between text-base">
                  <span class="font-semibold text-gray-900">Total</span>
                  <span class="font-bold text-gray-900">{{ cartService.total() | currency }}</span>
                </div>
              </div>

              <button
                type="button"
                class="w-full mt-6 py-3 px-6 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
              >
                Proceed to Checkout
              </button>

              <a
                routerLink="/products"
                class="block mt-4 text-center text-amber-600 font-medium hover:text-amber-700 transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export default class CartComponent {
  protected readonly cartService = inject(CartService);

  protected readonly amountToFreeShipping = computed(
    () => SHIPPING_THRESHOLD - this.cartService.subtotal()
  );

  protected readonly freeShippingProgress = computed(() =>
    Math.min((this.cartService.subtotal() / SHIPPING_THRESHOLD) * 100, 100)
  );

  protected updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  protected removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  protected clearCart(): void {
    this.cartService.clearCart();
  }
}
