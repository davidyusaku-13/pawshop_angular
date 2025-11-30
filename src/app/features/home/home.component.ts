import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-br from-orange-50 via-white to-amber-100 overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div class="z-10">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Everything Your
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600"
                >Cat</span
              >
              Needs 🐱
            </h1>
            <p class="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
              Temukan makanan premium, mainan seru, dan aksesoris lengkap untuk kucing kesayangan
              Anda. Gratis ongkir untuk pembelian di atas Rp 500.000!
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <a
                routerLink="/products"
                class="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-600/30 hover:bg-orange-700 hover:shadow-orange-600/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-5 h-5 ml-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              <a
                routerLink="/categories"
                class="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              >
                Browse Categories
              </a>
            </div>
          </div>
          <div class="relative">
            <div
              class="absolute inset-0 bg-gradient-to-tr from-orange-200/20 to-amber-200/20 rounded-full blur-3xl -z-10 transform scale-90"
            ></div>
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600"
              alt="Happy cat with toys"
              class="w-full h-auto rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
            />
            <div
              class="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl hidden md:block border border-white/50"
            >
              <div class="flex items-center gap-4">
                <div class="bg-orange-100 p-3 rounded-full">
                  <span class="text-3xl">🚚</span>
                </div>
                <div>
                  <p class="font-bold text-gray-900">Free Shipping</p>
                  <p class="text-sm text-gray-500">Orders over Rp 500K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-12 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            class="flex items-center gap-4 p-6 rounded-2xl hover:bg-orange-50 transition-colors duration-300 group cursor-default"
          >
            <span class="text-4xl group-hover:scale-110 transition-transform duration-300">🚚</span>
            <div>
              <p class="font-bold text-gray-900">Free Shipping</p>
              <p class="text-sm text-gray-500">Pesanan > Rp 500K</p>
            </div>
          </div>
          <div
            class="flex items-center gap-4 p-6 rounded-2xl hover:bg-orange-50 transition-colors duration-300 group cursor-default"
          >
            <span class="text-4xl group-hover:scale-110 transition-transform duration-300">🔒</span>
            <div>
              <p class="font-bold text-gray-900">Secure Payment</p>
              <p class="text-sm text-gray-500">100% aman</p>
            </div>
          </div>
          <div
            class="flex items-center gap-4 p-6 rounded-2xl hover:bg-orange-50 transition-colors duration-300 group cursor-default"
          >
            <span class="text-4xl group-hover:scale-110 transition-transform duration-300">💬</span>
            <div>
              <p class="font-bold text-gray-900">24/7 Support</p>
              <p class="text-sm text-gray-500">Chat via WhatsApp</p>
            </div>
          </div>
          <div
            class="flex items-center gap-4 p-6 rounded-2xl hover:bg-orange-50 transition-colors duration-300 group cursor-default"
          >
            <span class="text-4xl group-hover:scale-110 transition-transform duration-300">↩️</span>
            <div>
              <p class="font-bold text-gray-900">Easy Returns</p>
              <p class="text-sm text-gray-500">7 hari pengembalian</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Shop by Category</h2>
          <p class="mt-3 text-lg text-gray-600">Find exactly what your cat needs</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          @for (category of categoryService.categories(); track category.id) {
          <a
            [routerLink]="['/products']"
            [queryParams]="{ category: category.slug }"
            class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-gray-100"
          >
            <span
              class="text-5xl block mb-4 transform group-hover:scale-110 transition-transform duration-300"
              >{{ category.icon }}</span
            >
            <h3
              class="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors text-lg"
            >
              {{ category.name }}
            </h3>
            <p class="text-sm text-gray-500 mt-2">{{ category.productCount }} products</p>
          </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
            <p class="mt-3 text-lg text-gray-600">Handpicked products for your feline friend</p>
          </div>
          <a
            routerLink="/products"
            class="hidden md:inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (product of productService.featuredProducts().slice(0, 8); track product.id) {
          <app-product-card [product]="product" class="h-full" />
          }
        </div>
        <div class="mt-12 text-center md:hidden">
          <a
            routerLink="/products"
            class="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    @if (productService.newProducts().length > 0) {
    <section class="py-20 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">✨ New Arrivals</h2>
          <p class="mt-3 text-lg text-gray-600">Check out the latest additions to our collection</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (product of productService.newProducts(); track product.id) {
          <app-product-card [product]="product" class="h-full" />
          }
        </div>
      </div>
    </section>
    }

    <!-- Newsletter -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-orange-600 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          <!-- Decorative circles -->
          <div
            class="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
          ></div>
          <div
            class="absolute bottom-0 right-0 w-64 h-64 bg-orange-900/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"
          ></div>

          <div class="relative z-10">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Join Our Newsletter</h2>
            <p class="text-orange-100 text-lg max-w-2xl mx-auto mb-8">
              Subscribe to get special offers, free giveaways, and exclusive deals sent directly to
              your inbox!
            </p>
            <form class="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <label for="email-input" class="sr-only">Email address</label>
              <input
                id="email-input"
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-orange-400/50 text-gray-900 placeholder-gray-500 shadow-lg bg-white"
              />
              <button
                type="submit"
                class="px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p class="mt-4 text-sm text-orange-200">No spam, unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  protected readonly productService = inject(ProductService);
  protected readonly categoryService = inject(CategoryService);
}
