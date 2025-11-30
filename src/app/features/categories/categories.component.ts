import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-orange-600 cursor-pointer">Home</a>
        <span>/</span>
        <span class="text-gray-900">Categories</span>
      </nav>

      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900">Shop by Category</h1>
        <p class="mt-2 text-gray-600">Find everything your cat needs, organized by category</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (category of categoryService.categories(); track category.id) {
        <a
          [routerLink]="['/products']"
          [queryParams]="{ category: category.slug }"
          class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer"
        >
          <div class="relative h-48 overflow-hidden">
            <img
              [src]="category.image"
              [alt]="category.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <div class="flex items-center gap-2">
                <span class="text-3xl">{{ category.icon }}</span>
                <h2 class="text-xl font-bold text-white">{{ category.name }}</h2>
              </div>
            </div>
          </div>
          <div class="p-4">
            <p class="text-gray-600 text-sm line-clamp-2">
              {{ category.description }}
            </p>
            <div class="mt-4 flex items-center justify-between text-sm">
              <span class="text-gray-500"> {{ getProductCount(category.id) }} products </span>
              <span
                class="text-orange-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
              >
                Browse
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </a>
        }
      </div>
    </div>
  `,
})
export class CategoriesComponent {
  protected readonly categoryService = inject(CategoryService);
  protected readonly productService = inject(ProductService);

  protected getProductCount(categoryId: string): number {
    return this.productService.getProductsByCategory(categoryId).length;
  }
}
