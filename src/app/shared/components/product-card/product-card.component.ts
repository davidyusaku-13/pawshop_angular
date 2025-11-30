import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '@models/product.model';
import { CartService } from '@core/services';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <article
      class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
    >
      <!-- Image -->
      <a
        [routerLink]="['/product', product().slug]"
        class="block relative aspect-square overflow-hidden"
      >
        <img
          [src]="product().images[0]"
          [alt]="product().name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        @if (product().originalPrice) {
        <span
          class="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded"
        >
          {{ discountPercent() }}% OFF
        </span>
        } @if (product().isNew) {
        <span
          class="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded"
        >
          NEW
        </span>
        } @if (product().stock === 0) {
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span class="text-white font-semibold">Out of Stock</span>
        </div>
        }
      </a>

      <!-- Content -->
      <div class="p-4">
        <!-- Category -->
        <span class="text-xs text-gray-500 uppercase tracking-wider">
          {{ product().brand }}
        </span>

        <!-- Title -->
        <h3 class="mt-1 font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          <a
            [routerLink]="['/product', product().slug]"
            class="hover:text-amber-600 transition-colors"
          >
            {{ product().name }}
          </a>
        </h3>

        <!-- Rating -->
        <div class="flex items-center gap-1 mt-2">
          <div
            class="flex items-center"
            [attr.aria-label]="'Rating: ' + product().rating + ' out of 5 stars'"
          >
            @for (star of [1, 2, 3, 4, 5]; track star) {
            <svg
              class="w-4 h-4"
              [class]="star <= product().rating ? 'text-amber-400' : 'text-gray-200'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            }
          </div>
          <span class="text-xs text-gray-500">({{ product().reviewCount }})</span>
        </div>

        <!-- Price -->
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-lg font-bold text-gray-900">
            {{ product().price | currency }}
          </span>
          @if (product().originalPrice) {
          <span class="text-sm text-gray-400 line-through">
            {{ product().originalPrice | currency }}
          </span>
          }
        </div>

        <!-- Add to cart -->
        <button
          type="button"
          class="mt-4 w-full py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          [class]="
            isInCart()
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          "
          [disabled]="product().stock === 0"
          (click)="onAddToCart($event)"
        >
          @if (product().stock === 0) { Out of Stock } @else if (isInCart()) { ✓ In Cart } @else {
          Add to Cart }
        </button>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);

  readonly product = input.required<Product>();
  readonly addedToCart = output<Product>();

  protected isInCart(): boolean {
    return this.cartService.isInCart(this.product().id);
  }

  protected discountPercent(): number {
    const { price, originalPrice } = this.product();
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  protected onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isInCart()) {
      this.cartService.addToCart(this.product());
      this.addedToCart.emit(this.product());
    }
  }
}
