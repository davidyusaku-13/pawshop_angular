import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule],
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
              class="p-2 text-gray-600 hover:text-orange-600 active:text-orange-700 transition-colors cursor-pointer"
              (click)="toggleSearch()"
              [attr.aria-expanded]="searchOpen()"
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

            <!-- User Menu -->
            @if (authService.isAuthenticated()) {
            <div class="relative hidden md:block">
              <button
                type="button"
                class="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
                (click)="userMenuOpen.set(!userMenuOpen())"
                [attr.aria-expanded]="userMenuOpen()"
              >
                <img
                  [src]="authService.user()?.avatar"
                  [alt]="authService.user()?.name"
                  class="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-orange-300 transition-colors"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 transition-transform"
                  [class.rotate-180]="userMenuOpen()"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              @if (userMenuOpen()) {
              <div
                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="font-medium text-gray-900">{{ authService.user()?.name }}</p>
                  <p class="text-sm text-gray-500 truncate">{{ authService.user()?.email }}</p>
                </div>
                <a
                  routerLink="/orders"
                  class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2"
                  (click)="userMenuOpen.set(false)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  My Orders
                </a>
                <button
                  type="button"
                  class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
                  (click)="logout()"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
              }
            </div>
            } @else {
            <a
              routerLink="/auth/login"
              class="hidden md:inline-flex items-center gap-2 px-4 py-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
            >
              Sign In
            </a>
            <a
              routerLink="/auth/signup"
              class="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Sign Up
            </a>
            }

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

        <!-- Search Bar -->
        @if (searchOpen()) {
        <div class="pb-4 border-t border-gray-100 pt-4">
          <form (submit)="onSearch($event)" class="relative">
            <label for="header-search" class="sr-only">Search products</label>
            <input
              id="header-search"
              type="text"
              [(ngModel)]="searchQuery"
              name="search"
              placeholder="Search for cat food, toys, accessories..."
              class="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autocomplete="off"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <button
              type="submit"
              class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 active:bg-orange-800 transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
        }

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

            <!-- Mobile Auth -->
            <hr class="my-2 border-gray-100" />
            @if (authService.isAuthenticated()) {
            <div class="px-3 py-2 flex items-center gap-3">
              <img
                [src]="authService.user()?.avatar"
                [alt]="authService.user()?.name"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p class="font-medium text-gray-900">{{ authService.user()?.name }}</p>
                <p class="text-sm text-gray-500">{{ authService.user()?.email }}</p>
              </div>
            </div>
            <a
              routerLink="/orders"
              routerLinkActive="text-orange-600 bg-orange-50 font-semibold"
              class="px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors font-medium flex items-center gap-2"
              (click)="mobileMenuOpen.set(false)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              My Orders
            </a>
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-left flex items-center gap-2"
              (click)="logout(); mobileMenuOpen.set(false)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              Sign Out
            </button>
            } @else {
            <a
              routerLink="/auth/login"
              class="px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors font-medium"
              (click)="mobileMenuOpen.set(false)"
            >
              Sign In
            </a>
            <a
              routerLink="/auth/signup"
              class="mx-3 py-2 bg-orange-600 text-white text-center font-medium rounded-lg hover:bg-orange-700 transition-colors"
              (click)="mobileMenuOpen.set(false)"
            >
              Sign Up
            </a>
            }
          </div>
        </nav>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly searchOpen = signal(false);
  protected readonly userMenuOpen = signal(false);
  protected searchQuery = '';

  protected toggleSearch(): void {
    this.searchOpen.update((open) => !open);
    if (!this.searchOpen()) {
      this.searchQuery = '';
    }
  }

  protected onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchQuery.trim() },
      });
      this.searchOpen.set(false);
      this.searchQuery = '';
    }
  }

  protected logout(): void {
    this.authService.logout();
    this.userMenuOpen.set(false);
    this.router.navigate(['/']);
  }
}
