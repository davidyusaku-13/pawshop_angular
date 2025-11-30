import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 supports-[backdrop-filter]:bg-white/60"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2">
            <span class="text-3xl">🐱</span>
            <span class="text-xl font-bold text-orange-600">Pawshop</span>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <a
              routerLink="/"
              routerLinkActive="text-orange-600 font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-gray-700 hover:text-orange-600 transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-600 after:transition-all hover:after:w-full [&.text-orange-600]:after:w-full"
            >
              Home
            </a>
            <a
              routerLink="/products"
              routerLinkActive="text-orange-600 font-semibold"
              class="text-gray-700 hover:text-orange-600 transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-600 after:transition-all hover:after:w-full [&.text-orange-600]:after:w-full"
            >
              Products
            </a>
            <a
              routerLink="/categories"
              routerLinkActive="text-orange-600 font-semibold"
              class="text-gray-700 hover:text-orange-600 transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-600 after:transition-all hover:after:w-full [&.text-orange-600]:after:w-full"
            >
              Categories
            </a>
          </nav>

          <!-- Right side icons -->
          <div class="flex items-center gap-4">
            <!-- Search button -->
            <button
              type="button"
              class="p-2 text-gray-600 hover:text-orange-600 transition-colors"
              aria-label="Search products"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            <!-- Cart button -->
            <a
              routerLink="/cart"
              class="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
              aria-label="Shopping cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              @if (cartService.itemCount() > 0) {
              <span
                class="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
              >
                {{ cartService.itemCount() }}
              </span>
              }
            </a>

            <!-- Mobile menu button -->
            <button
              type="button"
              class="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              [attr.aria-expanded]="mobileMenuOpen()"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                @if (mobileMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
                }
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        @if (mobileMenuOpen()) {
        <nav class="md:hidden pb-4 border-t border-gray-100 pt-4">
          <div class="flex flex-col gap-3">
            <a
              routerLink="/"
              routerLinkActive="text-orange-600 bg-orange-50 font-semibold border-l-4 border-orange-600"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors font-medium"
              (click)="mobileMenuOpen.set(false)"
            >
              Home
            </a>
            <a
              routerLink="/products"
              routerLinkActive="text-orange-600 bg-orange-50 font-semibold border-l-4 border-orange-600"
              class="px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors font-medium"
              (click)="mobileMenuOpen.set(false)"
            >
              Products
            </a>
            <a
              routerLink="/categories"
              routerLinkActive="text-orange-600 bg-orange-50 font-semibold border-l-4 border-orange-600"
              class="px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors font-medium"
              (click)="mobileMenuOpen.set(false)"
            >
              Categories
            </a>
          </div>
        </nav>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly cartService = inject(CartService);
  protected readonly mobileMenuOpen = signal(false);
}
