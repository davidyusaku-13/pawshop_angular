import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductFilter } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, FormsModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-orange-600">Home</a>
        <span>/</span>
        <span class="text-gray-900">Products</span>
        @if (selectedCategory()) {
        <span>/</span>
        <span class="text-gray-900">{{ selectedCategory()?.name }}</span>
        }
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 class="font-semibold text-gray-900 mb-4">Filters</h2>

            <!-- Search -->
            <div class="mb-6">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                [ngModel]="filter().search"
                (ngModelChange)="updateFilter({ search: $event })"
                placeholder="Search products..."
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <div class="space-y-2">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  [class]="
                    !filter().categoryId
                      ? 'bg-orange-100 text-orange-700 font-semibold border-l-4 border-orange-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  "
                  (click)="updateFilter({ categoryId: undefined })"
                >
                  All Categories
                </button>
                @for (category of categoryService.categories(); track category.id) {
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  [class]="
                    filter().categoryId === category.id
                      ? 'bg-orange-100 text-orange-700 font-semibold border-l-4 border-orange-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  "
                  (click)="updateFilter({ categoryId: category.id })"
                >
                  {{ category.icon }} {{ category.name }}
                </button>
                }
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
              <div class="space-y-2">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                  (click)="updateFilter({ minPrice: undefined, maxPrice: 50000 })"
                >
                  Under Rp 50.000
                </button>
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                  (click)="updateFilter({ minPrice: 50000, maxPrice: 100000 })"
                >
                  Rp 50.000 - Rp 100.000
                </button>
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                  (click)="updateFilter({ minPrice: 100000, maxPrice: 200000 })"
                >
                  Rp 100.000 - Rp 200.000
                </button>
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                  (click)="updateFilter({ minPrice: 200000, maxPrice: undefined })"
                >
                  Over Rp 200.000
                </button>
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm text-orange-600 hover:bg-orange-50 cursor-pointer transition-colors font-medium"
                  (click)="updateFilter({ minPrice: undefined, maxPrice: undefined })"
                >
                  Clear Price Filter
                </button>
              </div>
            </div>

            <!-- Sort -->
            <div>
              <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                id="sort"
                [ngModel]="filter().sortBy"
                (ngModelChange)="updateFilter({ sortBy: $event })"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <main class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-900">
              @if (selectedCategory()) {
              {{ selectedCategory()?.name }}
              } @else { All Products }
            </h1>
            <p class="text-gray-500">{{ filteredProducts().length }} products</p>
          </div>

          @if (filteredProducts().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            @for (product of filteredProducts(); track product.id) {
            <app-product-card [product]="product" />
            }
          </div>
          } @else {
          <div class="text-center py-16">
            <span class="text-6xl mb-4 block">🔍</span>
            <h3 class="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button
              type="button"
              class="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              (click)="clearFilters()"
            >
              Clear All Filters
            </button>
          </div>
          }
        </main>
      </div>
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  protected readonly productService = inject(ProductService);
  protected readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);

  protected readonly filter = signal<ProductFilter>({ sortBy: 'newest' });

  protected readonly selectedCategory = computed(() => {
    const categoryId = this.filter().categoryId;
    if (!categoryId) return undefined;
    return this.categoryService.getCategoryById(categoryId);
  });

  protected readonly filteredProducts = computed(() =>
    this.productService.filterProducts(this.filter())
  );

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        const category = this.categoryService.getCategoryBySlug(params['category']);
        if (category) {
          this.filter.update((f) => ({ ...f, categoryId: category.id }));
        }
      }
    });
  }

  protected updateFilter(updates: Partial<ProductFilter>): void {
    this.filter.update((f) => ({ ...f, ...updates }));
  }

  protected clearFilters(): void {
    this.filter.set({ sortBy: 'newest' });
  }
}
