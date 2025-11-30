import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { ProductService, CartService } from '@core/services';
import { ProductCardComponent } from '@shared/components';

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, ProductCardComponent],
  template: `
    @if (product()) {
    <div class="bg-gray-50 min-h-screen">
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 py-3">
          <nav class="flex items-center gap-2 text-sm">
            <a routerLink="/" class="text-gray-500 hover:text-amber-600">Home</a>
            <span class="text-gray-300">/</span>
            <a routerLink="/products" class="text-gray-500 hover:text-amber-600">Products</a>
            <span class="text-gray-300">/</span>
            <span class="text-gray-900 font-medium line-clamp-1">{{ product()!.name }}</span>
          </nav>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <!-- Product Details -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            <!-- Images -->
            <div class="space-y-4">
              <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  [src]="selectedImage()"
                  [alt]="product()!.name"
                  class="w-full h-full object-cover"
                />
              </div>
              @if (product()!.images.length > 1) {
              <div class="flex gap-3">
                @for (image of product()!.images; track image; let i = $index) {
                <button
                  type="button"
                  class="w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors"
                  [class]="
                    selectedImageIndex() === i
                      ? 'border-amber-600'
                      : 'border-transparent hover:border-gray-300'
                  "
                  (click)="selectImage(i)"
                >
                  <img [src]="image" [alt]="product()!.name" class="w-full h-full object-cover" />
                </button>
                }
              </div>
              }
            </div>

            <!-- Info -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm text-gray-500 uppercase tracking-wider">
                  {{ product()!.brand }}
                </span>
                @if (product()!.isNew) {
                <span
                  class="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded"
                >
                  NEW
                </span>
                }
              </div>

              <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product()!.name }}</h1>

              <!-- Rating -->
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="flex items-center"
                  [attr.aria-label]="'Rating: ' + product()!.rating + ' out of 5'"
                >
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                  <svg
                    class="w-5 h-5"
                    [class]="star <= product()!.rating ? 'text-amber-400' : 'text-gray-200'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  }
                </div>
                <span class="text-gray-600"
                  >{{ product()!.rating }} ({{ product()!.reviewCount }} reviews)</span
                >
              </div>

              <!-- Price -->
              <div class="flex items-baseline gap-3 mb-6">
                <span class="text-3xl font-bold text-gray-900">
                  {{ product()!.price | currency }}
                </span>
                @if (product()!.originalPrice) {
                <span class="text-xl text-gray-400 line-through">
                  {{ product()!.originalPrice | currency }}
                </span>
                <span class="bg-red-100 text-red-700 text-sm font-semibold px-2 py-1 rounded">
                  Save {{ discountPercent() }}%
                </span>
                }
              </div>

              <!-- Description -->
              <p class="text-gray-600 mb-6 leading-relaxed">{{ product()!.description }}</p>

              <!-- Features -->
              @if (product()!.features.length > 0) {
              <div class="mb-6">
                <h3 class="font-semibold text-gray-900 mb-3">Features</h3>
                <ul class="space-y-2">
                  @for (feature of product()!.features; track feature) {
                  <li class="flex items-center gap-2 text-gray-600">
                    <svg
                      class="w-5 h-5 text-emerald-500 shrink-0"
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
                    {{ feature }}
                  </li>
                  }
                </ul>
              </div>
              }

              <!-- Stock -->
              <div class="flex items-center gap-2 mb-6">
                @if (product()!.stock > 0) {
                <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span class="text-emerald-600 font-medium">In Stock</span>
                <span class="text-gray-500">({{ product()!.stock }} available)</span>
                } @else {
                <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                <span class="text-red-600 font-medium">Out of Stock</span>
                }
              </div>

              <!-- Quantity & Add to Cart -->
              <div class="flex items-center gap-4 mb-6">
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    [disabled]="quantity() <= 1"
                    (click)="decrementQuantity()"
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
                  <span class="w-12 text-center font-medium">{{ quantity() }}</span>
                  <button
                    type="button"
                    class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    [disabled]="quantity() >= product()!.stock"
                    (click)="incrementQuantity()"
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

                <button
                  type="button"
                  class="flex-1 py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  [class]="
                    isInCart()
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  "
                  [disabled]="product()!.stock === 0"
                  (click)="addToCart()"
                >
                  @if (product()!.stock === 0) { Out of Stock } @else if (isInCart()) { ✓ Added to
                  Cart } @else { Add to Cart }
                </button>
              </div>

              <!-- Info -->
              <div class="grid grid-cols-2 gap-4 text-sm">
                @if (product()!.weight) {
                <div class="flex items-center gap-2 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                  <span>Weight: {{ product()!.weight }}</span>
                </div>
                } @if (product()!.dimensions) {
                <div class="flex items-center gap-2 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                  <span>Size: {{ product()!.dimensions }}</span>
                </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        @if (relatedProducts().length > 0) {
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (relatedProduct of relatedProducts(); track relatedProduct.id) {
            <app-product-card [product]="relatedProduct" />
            }
          </div>
        </div>
        }
      </div>
    </div>
    } @else {
    <!-- Not Found -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <span class="text-6xl mb-4 block">🐱</span>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p class="text-gray-500 mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <a
          routerLink="/products"
          class="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
        >
          Browse Products
        </a>
      </div>
    </div>
    }
  `,
})
export default class ProductDetailComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);

  private readonly slug = toSignal(
    this.route.params.pipe(map((params) => params['slug'] as string))
  );

  protected readonly product = computed(() => {
    const slug = this.slug();
    return slug ? this.productService.getProductBySlug(slug) : undefined;
  });

  protected readonly quantity = signal(1);
  protected readonly selectedImageIndex = signal(0);

  protected readonly selectedImage = computed(() => {
    const product = this.product();
    return product?.images[this.selectedImageIndex()] ?? '';
  });

  protected readonly relatedProducts = computed(() => {
    const product = this.product();
    if (!product) return [];

    return this.productService
      .getProductsByCategory(product.categoryId)
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  });

  protected discountPercent(): number {
    const product = this.product();
    if (!product?.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  protected isInCart(): boolean {
    const product = this.product();
    return product ? this.cartService.isInCart(product.id) : false;
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected incrementQuantity(): void {
    const product = this.product();
    if (product && this.quantity() < product.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  protected decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  protected addToCart(): void {
    const product = this.product();
    if (product && !this.isInCart()) {
      this.cartService.addToCart(product, this.quantity());
    }
  }
}
