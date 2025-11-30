import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService, CategoryService } from '@core/services';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 bg-white shadow-sm">
      <!-- Top bar -->
      <div class="bg-amber-600 text-white text-sm py-1.5">
        <div class="container mx-auto px-4 flex justify-between items-center">
          <span>🐱 Free shipping on orders over $50!</span>
          <div class="flex gap-4">
            <a href="#" class="hover:underline">Help</a>
            <a href="#" class="hover:underline">Track Order</a>
          </div>
        </div>
      </div>

      <!-- Main header -->
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 shrink-0">
            <span class="text-3xl">🐾</span>
            <span class="text-2xl font-bold text-amber-600">Pawshop</span>
          </a>

          <!-- Search bar -->
          <div class="hidden md:flex flex-1 max-w-xl">
            <div class="relative w-full">
              <input
                type="search"
                placeholder="Search for cat food, toys, accessories..."
                class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <!-- Account -->
            <a
              routerLink="/account"
              class="hidden sm:flex items-center gap-1 text-gray-700 hover:text-amber-600 transition-colors"
              aria-label="Account"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="hidden lg:inline">Account</span>
            </a>

            <!-- Cart -->
            <a
              routerLink="/cart"
              class="relative flex items-center gap-1 text-gray-700 hover:text-amber-600 transition-colors"
              aria-label="Shopping cart"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="hidden lg:inline">Cart</span>
              @if (cartService.itemCount() > 0) {
              <span
                class="absolute -top-2 -right-2 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
              >
                {{ cartService.itemCount() }}
              </span>
              }
            </a>

            <!-- Mobile menu button -->
            <button
              type="button"
              class="md:hidden p-2 text-gray-700 hover:text-amber-600"
              (click)="toggleMobileMenu()"
              [attr.aria-expanded]="mobileMenuOpen()"
              aria-label="Toggle menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (mobileMenuOpen()) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
                } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                }
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile search -->
        <div class="md:hidden mt-4">
          <div class="relative">
            <input
              type="search"
              placeholder="Search products..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:block border-t border-gray-100 bg-gray-50">
        <div class="container mx-auto px-4">
          <ul class="flex items-center gap-1">
            @for (category of categoryService.categories(); track category.id) {
            <li>
              <a
                [routerLink]="['/category', category.slug]"
                routerLinkActive="bg-amber-100 text-amber-700"
                class="flex items-center gap-1.5 px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors font-medium"
              >
                <span>{{ category.icon }}</span>
                <span>{{ category.name }}</span>
              </a>
            </li>
            }
          </ul>
        </div>
      </nav>

      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
      <div class="md:hidden border-t border-gray-200 bg-white">
        <nav class="container mx-auto px-4 py-2">
          <ul class="space-y-1">
            @for (category of categoryService.categories(); track category.id) {
            <li>
              <a
                [routerLink]="['/category', category.slug]"
                routerLinkActive="bg-amber-100 text-amber-700"
                class="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-lg"
                (click)="closeMobileMenu()"
              >
                <span class="text-xl">{{ category.icon }}</span>
                <span>{{ category.name }}</span>
              </a>
            </li>
            }
            <li class="border-t border-gray-100 pt-2 mt-2">
              <a
                routerLink="/account"
                class="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-lg"
                (click)="closeMobileMenu()"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>My Account</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  protected readonly cartService = inject(CartService);
  protected readonly categoryService = inject(CategoryService);

  protected readonly mobileMenuOpen = signal(false);

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
