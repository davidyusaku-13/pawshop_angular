import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductService, CategoryService } from '@core/services';
import { ProductCardComponent } from '@shared/components';
import { Product, SortOption } from '@models/product.model';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 py-3">
          <nav class="flex items-center gap-2 text-sm">
            <a routerLink="/" class="text-gray-500 hover:text-amber-600">Home</a>
            <span class="text-gray-300">/</span>
            @if (currentCategory()) {
            <a routerLink="/products" class="text-gray-500 hover:text-amber-600">Products</a>
            <span class="text-gray-300">/</span>
            <span class="text-gray-900 font-medium">{{ currentCategory()?.name }}</span>
            } @else {
            <span class="text-gray-900 font-medium">All Products</span>
            }
          </nav>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filters -->
          <aside class="lg:w-64 shrink-0">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 class="font-semibold text-gray-900 mb-4">Categories</h2>
              <ul class="space-y-2">
                <li>
                  <a
                    routerLink="/products"
                    class="block px-3 py-2 rounded-lg transition-colors"
                    [class]="
                      !categorySlug()
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    "
                  >
                    All Products
                  </a>
                </li>
                @for (category of categoryService.categories(); track category.id) {
                <li>
                  <a
                    [routerLink]="['/category', category.slug]"
                    class="flex items-center justify-between px-3 py-2 rounded-lg transition-colors"
                    [class]="
                      categorySlug() === category.slug
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    "
                  >
                    <span class="flex items-center gap-2">
                      <span>{{ category.icon }}</span>
                      <span>{{ category.name }}</span>
                    </span>
                    <span class="text-xs text-gray-400">{{ category.productCount }}</span>
                  </a>
                </li>
                }
              </ul>

              <hr class="my-6 border-gray-200" />

              <h2 class="font-semibold text-gray-900 mb-4">Price Range</h2>
              <div class="space-y-2">
                @for (range of priceRanges; track range.label) {
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    [value]="range.label"
                    [checked]="selectedPriceRange() === range.label"
                    (change)="selectPriceRange(range.label)"
                    class="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                  <span class="text-gray-600">{{ range.label }}</span>
                </label>
                }
              </div>

              <hr class="my-6 border-gray-200" />

              <h2 class="font-semibold text-gray-900 mb-4">Availability</h2>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  [checked]="inStockOnly()"
                  (change)="toggleInStock()"
                  class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <span class="text-gray-600">In Stock Only</span>
              </label>

              @if (hasActiveFilters()) {
              <button
                type="button"
                class="mt-6 w-full py-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
                (click)="clearFilters()"
              >
                Clear All Filters
              </button>
              }
            </div>
          </aside>

          <!-- Products Grid -->
          <main class="flex-1">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  @if (currentCategory()) {
                  {{ currentCategory()?.name }}
                  } @else { All Products }
                </h1>
                <p class="text-gray-500 mt-1">{{ filteredProducts().length }} products</p>
              </div>
              <div class="flex items-center gap-3">
                <label for="sort" class="text-sm text-gray-600">Sort by:</label>
                <select
                  id="sort"
                  [value]="sortOption()"
                  (change)="onSortChange($event)"
                  class="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>
            </div>

            <!-- Products -->
            @if (sortedProducts().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (product of sortedProducts(); track product.id) {
              <app-product-card [product]="product" />
              }
            </div>
            } @else {
            <div class="bg-white rounded-xl p-12 text-center">
              <span class="text-6xl mb-4 block">🐱</span>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p class="text-gray-500 mb-6">Try adjusting your filters or browse all products.</p>
              <a
                routerLink="/products"
                class="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
              >
                View All Products
              </a>
            </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
})
export default class ProductListComponent {
  protected readonly productService = inject(ProductService);
  protected readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);

  protected readonly categorySlug = toSignal(
    this.route.params.pipe(map((params) => params['slug'] as string | undefined))
  );

  protected readonly sortOption = signal<SortOption>('newest');
  protected readonly selectedPriceRange = signal<string>('All');
  protected readonly inStockOnly = signal(false);

  protected readonly priceRanges = [
    { label: 'All', min: 0, max: Infinity },
    { label: 'Under $10', min: 0, max: 10 },
    { label: '$10 - $25', min: 10, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: 'Over $50', min: 50, max: Infinity },
  ];

  protected readonly currentCategory = computed(() => {
    const slug = this.categorySlug();
    return slug ? this.categoryService.getCategoryBySlug(slug) : undefined;
  });

  protected readonly filteredProducts = computed(() => {
    const category = this.currentCategory();
    const priceRange = this.priceRanges.find((r) => r.label === this.selectedPriceRange());
    const inStock = this.inStockOnly();

    return this.productService.filterProducts({
      categoryId: category?.id,
      minPrice: priceRange?.min,
      maxPrice: priceRange?.max === Infinity ? undefined : priceRange?.max,
      inStock: inStock || undefined,
    });
  });

  protected readonly sortedProducts = computed(() =>
    this.productService.sortProducts(this.filteredProducts(), this.sortOption())
  );

  protected readonly hasActiveFilters = computed(
    () => this.selectedPriceRange() !== 'All' || this.inStockOnly()
  );

  protected onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption.set(select.value as SortOption);
  }

  protected selectPriceRange(range: string): void {
    this.selectedPriceRange.set(range);
  }

  protected toggleInStock(): void {
    this.inStockOnly.update((value) => !value);
  }

  protected clearFilters(): void {
    this.selectedPriceRange.set('All');
    this.inStockOnly.set(false);
  }
}
