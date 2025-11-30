import { Component, ChangeDetectionStrategy, input, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full"
    >
      <a
        [routerLink]="['/products', product().slug]"
        class="block relative overflow-hidden aspect-square"
      >
        <img
          [src]="product().images[0]"
          [alt]="product().name"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"
        ></div>

        @if (product().isNew) {
        <span
          class="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
        >
          NEW
        </span>
        } @if (product().originalPrice) {
        <span
          class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
        >
          -{{ getDiscountPercentage() }}%
        </span>
        }
      </a>

      <div class="p-5 flex flex-col flex-1">
        <a [routerLink]="['/products', product().slug]">
          <h3
            class="font-semibold text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors text-lg leading-snug mb-2"
          >
            {{ product().name }}
          </h3>
        </a>

        <div class="flex items-center gap-1 mb-3">
          <div class="flex items-center">
            @for (star of [1, 2, 3, 4, 5]; track star) {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-4 h-4"
              [class]="star <= Math.round(product().rating) ? 'text-yellow-400' : 'text-gray-200'"
            >
              <path
                fill-rule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                clip-rule="evenodd"
              />
            </svg>
            }
          </div>
          <span class="text-xs text-gray-500 font-medium"
            >({{ product().reviewCount }} reviews)</span
          >
        </div>

        <div class="flex items-baseline gap-2 mb-4 mt-auto">
          <span class="text-xl font-bold text-gray-900">
            {{ cartService.formatPrice(product().price) }}
          </span>
          @if (product().originalPrice) {
          <span class="text-sm text-gray-400 line-through">
            {{ cartService.formatPrice(product().originalPrice!) }}
          </span>
          }
        </div>

        <button
          type="button"
          class="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95"
          [class]="
            product().stock > 0
              ? addingState() === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          "
          [disabled]="product().stock === 0 || addingState() !== 'idle'"
          (click)="onAddToCart($event)"
        >
          @if (product().stock > 0) { @switch (addingState()) { @case ('idle') {
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
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          Add to Cart } @case ('loading') {
          <svg class="w-5 h-5 animate-spin-once" viewBox="0 0 24 24" fill="none">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="3"
            ></circle>
            <path
              class="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Adding... } @case ('success') {
          <svg
            class="w-5 h-5 animate-checkmark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path class="checkmark-path" d="M4 12l5 5L20 6" />
          </svg>
          Added! } } } @else { Out of Stock }
        </button>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  protected readonly Math = Math;
  protected readonly addingState = signal<'idle' | 'loading' | 'success'>('idle');

  protected getDiscountPercentage(): number {
    const originalPrice = this.product().originalPrice;
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - this.product().price) / originalPrice) * 100);
  }

  protected onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      sessionStorage.setItem('returnUrl', this.router.url);
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.addingState() !== 'idle') return;

    this.addingState.set('loading');

    // Spinner completes one full rotation (600ms), then show checkmark
    setTimeout(() => {
      this.cartService.addToCart(this.product());
      this.addToCart.emit(this.product());
      this.addingState.set('success');

      // Reset to idle after showing checkmark
      setTimeout(() => {
        this.addingState.set('idle');
      }, 1000);
    }, 600);
  }
}
