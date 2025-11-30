import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService, CategoryService } from '@core/services';
import { ProductCardComponent } from '@shared/components';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span
              class="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full mb-4"
            >
              🐱 Premium Cat Care
            </span>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything Your
              <span class="text-amber-600">Feline Friend</span>
              Deserves
            </h1>
            <p class="text-lg text-gray-600 mb-8 max-w-lg">
              Discover premium food, toys, and accessories curated for your cat's health and
              happiness. Free shipping on orders over $50!
            </p>
            <div class="flex flex-wrap gap-4">
              <a
                routerLink="/products"
                class="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
              >
                Shop Now
                <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                routerLink="/category/food-treats"
                class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Browse Food
              </a>
            </div>
          </div>
          <div class="hidden md:block relative">
            <div
              class="absolute -top-8 -right-8 w-72 h-72 bg-amber-200 rounded-full opacity-50 blur-3xl"
            ></div>
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600"
              alt="Happy cat"
              class="relative rounded-2xl shadow-2xl w-full max-w-md ml-auto"
            />
          </div>
        </div>
      </div>

      <!-- Wave decoration -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>

    <!-- Features -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center p-4">
            <div
              class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-7 h-7 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Free Shipping</h3>
            <p class="text-sm text-gray-500">On orders over $50</p>
          </div>
          <div class="text-center p-4">
            <div
              class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-7 h-7 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Quality Assured</h3>
            <p class="text-sm text-gray-500">Vet-approved products</p>
          </div>
          <div class="text-center p-4">
            <div
              class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-7 h-7 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Easy Returns</h3>
            <p class="text-sm text-gray-500">30-day return policy</p>
          </div>
          <div class="text-center p-4">
            <div
              class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-7 h-7 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">24/7 Support</h3>
            <p class="text-sm text-gray-500">Here to help always</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p class="text-gray-600">Find everything your cat needs in one place</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          @for (category of categoryService.categories(); track category.id) {
          <a
            [routerLink]="['/category', category.slug]"
            class="group bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <span class="text-4xl mb-3 block">{{ category.icon }}</span>
            <h3 class="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
              {{ category.name }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">{{ category.productCount }} products</p>
          </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p class="text-gray-600">Our most popular picks for your furry friend</p>
          </div>
          <a
            routerLink="/products"
            class="hidden md:inline-flex items-center text-amber-600 font-medium hover:text-amber-700 transition-colors"
          >
            View All
            <svg class="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (product of productService.featuredProducts(); track product.id) {
          <app-product-card [product]="product" />
          }
        </div>
        <div class="mt-8 text-center md:hidden">
          <a
            routerLink="/products"
            class="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    @if (productService.newProducts().length > 0) {
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">New Arrivals</h2>
            <p class="text-gray-600">Check out what's new in store</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (product of productService.newProducts(); track product.id) {
          <app-product-card [product]="product" />
          }
        </div>
      </div>
    </section>
    }

    <!-- CTA Section -->
    <section class="py-16 bg-amber-600">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Join the Pawshop Family! 🐾</h2>
        <p class="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and get 15% off your first order, plus exclusive deals and
          tips for your cat!
        </p>
        <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <label for="cta-email" class="sr-only">Email address</label>
          <input
            id="cta-email"
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  `,
})
export default class HomeComponent {
  protected readonly productService = inject(ProductService);
  protected readonly categoryService = inject(CategoryService);
}
