import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product(); as prod) {
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-orange-600">Home</a>
        <span>/</span>
        <a routerLink="/products" class="hover:text-orange-600">Products</a>
        @if (category(); as cat) {
        <span>/</span>
        <a
          routerLink="/products"
          [queryParams]="{ category: cat.slug }"
          class="hover:text-orange-600"
        >
          {{ cat.name }}
        </a>
        }
        <span>/</span>
        <span class="text-gray-900 truncate max-w-[200px]">{{ prod.name }}</span>
      </nav>

      <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
        <!-- Product Images -->
        <div class="space-y-4">
          <div class="bg-white rounded-xl overflow-hidden shadow-sm">
            <img
              [src]="prod.images[selectedImage()]"
              [alt]="prod.name"
              class="w-full h-96 object-cover"
            />
          </div>
          @if (prod.images.length > 1) {
          <div class="flex gap-2">
            @for (image of prod.images; track image; let i = $index) {
            <button
              type="button"
              class="w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors"
              [class]="
                selectedImage() === i ? 'border-orange-500' : 'border-transparent opacity-60'
              "
              (click)="selectedImage.set(i)"
            >
              <img
                [src]="image"
                [alt]="prod.name + ' thumbnail ' + (i + 1)"
                class="w-full h-full object-cover"
              />
            </button>
            }
          </div>
          }
        </div>

        <!-- Product Info -->
        <div>
          <div class="flex items-start justify-between gap-4">
            <div>
              @if (prod.isNew) {
              <span
                class="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full mb-2"
              >
                New
              </span>
              }
              <h1 class="text-3xl font-bold text-gray-900">{{ prod.name }}</h1>
            </div>
          </div>

          <!-- Rating -->
          <div class="mt-4 flex items-center gap-2">
            <div class="flex items-center">
              @for (star of [1, 2, 3, 4, 5]; track star) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-5 h-5"
                [class]="star <= Math.round(prod.rating) ? 'text-yellow-400' : 'text-gray-200'"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                  clip-rule="evenodd"
                />
              </svg>
              }
            </div>
            <span class="text-gray-600">{{ prod.rating }} ({{ prod.reviewCount }} reviews)</span>
          </div>

          <!-- Price -->
          <div class="mt-6 flex items-center gap-3">
            <span class="text-3xl font-bold text-orange-600">
              {{ productService.formatPrice(prod.price) }}
            </span>
            @if (prod.originalPrice) {
            <span class="text-xl text-gray-400 line-through">
              {{ productService.formatPrice(prod.originalPrice) }}
            </span>
            <span class="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded-full">
              Save {{ getDiscountPercentage() }}%
            </span>
            }
          </div>

          <!-- Stock -->
          <div class="mt-4">
            @if (prod.stock > 0) {
            <span class="text-green-600 font-medium">✓ In Stock ({{ prod.stock }} available)</span>
            } @else {
            <span class="text-red-600 font-medium">✕ Out of Stock</span>
            }
          </div>

          <!-- Description -->
          <div class="mt-6">
            <h2 class="font-semibold text-gray-900 mb-2">Description</h2>
            <p class="text-gray-600 leading-relaxed">{{ prod.description }}</p>
          </div>

          <!-- Tags -->
          @if (prod.tags.length > 0) {
          <div class="mt-6">
            <h2 class="font-semibold text-gray-900 mb-2">Tags</h2>
            <div class="flex flex-wrap gap-2">
              @for (tag of prod.tags; track tag) {
              <span class="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                {{ tag }}
              </span>
              }
            </div>
          </div>
          }

          <!-- Quantity & Add to Cart -->
          <div class="mt-8 space-y-4">
            <div class="flex items-center gap-4">
              <label for="quantity" class="font-medium text-gray-900">Quantity:</label>
              <div class="flex items-center border border-gray-200 rounded-lg">
                <button
                  type="button"
                  class="px-4 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  [disabled]="quantity() <= 1"
                  (click)="decreaseQuantity()"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  [value]="quantity()"
                  (input)="onQuantityInput($event)"
                  min="1"
                  [max]="prod.stock"
                  class="w-16 text-center border-x border-gray-200 py-2 focus:outline-none"
                />
                <button
                  type="button"
                  class="px-4 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  [disabled]="quantity() >= prod.stock"
                  (click)="increaseQuantity(prod.stock)"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div class="flex gap-4">
              <button
                type="button"
                class="flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                [class]="
                  prod.stock > 0
                    ? addingState() === 'success'
                      ? 'bg-green-600 text-white'
                      : 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                "
                [disabled]="prod.stock === 0 || addingState() !== 'idle'"
                (click)="addToCart()"
              >
                @if (prod.stock > 0) { @switch (addingState()) { @case ('idle') {
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
              <button
                type="button"
                class="py-3 px-6 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Add to wishlist"
              >
                ♡
              </button>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-8 border-t pt-6 space-y-3">
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <span class="text-xl">🚚</span>
              <span>Free shipping for orders over Rp 500.000</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <span class="text-xl">↩️</span>
              <span>Easy 7-day returns</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <span class="text-xl">🔒</span>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    } @else {
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <span class="text-6xl mb-4 block">🐱</span>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
      <p class="text-gray-500 mb-6">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <a
        routerLink="/products"
        class="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
      >
        Browse Products
      </a>
    </div>
    }
  `,
})
export class ProductDetailComponent implements OnInit {
  protected readonly productService = inject(ProductService);
  protected readonly cartService = inject(CartService);
  protected readonly categoryService = inject(CategoryService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly product = signal<Product | undefined>(undefined);
  protected readonly selectedImage = signal(0);
  protected readonly quantity = signal(1);
  protected readonly addingState = signal<'idle' | 'loading' | 'success'>('idle');
  protected readonly Math = Math;

  protected readonly category = computed(() => {
    const prod = this.product();
    if (!prod) return undefined;
    return this.categoryService.getCategoryById(prod.categoryId);
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      const prod = this.productService.getProductBySlug(slug);
      this.product.set(prod);
      this.selectedImage.set(0);
      this.quantity.set(1);
    });
  }

  protected getDiscountPercentage(): number {
    const prod = this.product();
    if (!prod || !prod.originalPrice) return 0;
    return Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);
  }

  protected decreaseQuantity(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  protected increaseQuantity(maxStock: number): void {
    this.quantity.update((q) => Math.min(maxStock, q + 1));
  }

  protected onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    const prod = this.product();
    if (!prod) return;
    if (!isNaN(value) && value >= 1 && value <= prod.stock) {
      this.quantity.set(value);
    }
  }

  protected addToCart(): void {
    const prod = this.product();
    if (!prod || prod.stock === 0 || this.addingState() !== 'idle') return;

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      sessionStorage.setItem('returnUrl', this.router.url);
      this.router.navigate(['/auth/login']);
      return;
    }

    this.addingState.set('loading');

    // Spinner completes one full rotation (600ms), then show checkmark
    setTimeout(() => {
      this.cartService.addToCart(prod, this.quantity());
      this.addingState.set('success');

      // Reset to idle after showing checkmark
      setTimeout(() => {
        this.addingState.set('idle');
        this.quantity.set(1);
      }, 1000);
    }, 600);
  }
}
