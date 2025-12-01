import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-900 flex">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0"
        [class.-translate-x-full]="!sidebarOpen()"
        [class.translate-x-0]="sidebarOpen()"
      >
        <!-- Logo -->
        <div class="flex items-center justify-between h-20 px-6 border-b border-slate-800">
          <a routerLink="/admin" class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20"
            >
              <span class="text-xl">🐱</span>
            </div>
            <div>
              <span class="text-lg font-bold text-white">Pawshop</span>
              <span class="block text-xs text-slate-500 font-medium tracking-wider uppercase"
                >Admin Panel</span
              >
            </div>
          </a>
          <button
            type="button"
            class="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            (click)="sidebarOpen.set(false)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="p-4 space-y-2">
          <p class="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Main Menu
          </p>
          @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-gradient-to-r from-orange-500/10 to-orange-600/5 text-orange-400 border-l-2 border-orange-500"
            [routerLinkActiveOptions]="{ exact: item.route === '/admin' }"
            class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 border-l-2 border-transparent"
            (click)="closeSidebarOnMobile()"
          >
            <span class="text-xl w-6 text-center" [innerHTML]="item.icon"></span>
            <span class="font-medium">{{ item.label }}</span>
          </a>
          }

          <div class="pt-6">
            <p class="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Links
            </p>
          </div>

          <!-- Back to Store -->
          <a
            routerLink="/"
            class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
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
                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
              />
            </svg>
            <span class="font-medium">View Store</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 ml-auto"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </nav>

        <!-- User Card at Bottom -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
            <img
              [src]="authService.user()?.avatar"
              [alt]="authService.user()?.name"
              class="w-10 h-10 rounded-full ring-2 ring-orange-500/30"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ authService.user()?.name }}</p>
              <p class="text-xs text-slate-500">Administrator</p>
            </div>
            <button
              type="button"
              class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              (click)="logout()"
              title="Logout"
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
            </button>
          </div>
        </div>
      </aside>

      <!-- Mobile sidebar overlay -->
      @if (sidebarOpen()) {
      <div
        class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        (click)="sidebarOpen.set(false)"
      ></div>
      }

      <!-- Main Content -->
      <div class="flex-1 lg:ml-72">
        <!-- Top Header -->
        <header
          class="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800"
        >
          <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <!-- Mobile menu button -->
            <button
              type="button"
              class="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              (click)="sidebarOpen.set(true)"
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            <div class="flex-1 lg:flex-none">
              <h1 class="text-lg font-semibold text-white lg:hidden">Admin Panel</h1>
            </div>

            <!-- Right side header items -->
            <div class="flex items-center gap-3">
              <!-- Notification bell (decorative) -->
              <button
                type="button"
                class="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
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
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
                <span class="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>

              <!-- Current time (decorative) -->
              <div class="hidden sm:block px-3 py-1.5 bg-slate-800 rounded-lg">
                <p class="text-xs text-slate-400 font-mono">{{ currentTime }}</p>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-4 sm:p-6 lg:p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly sidebarOpen = signal(false);
  protected currentTime = '';

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/admin' },
    { label: 'Products', icon: '📦', route: '/admin/products' },
    { label: 'Categories', icon: '🏷️', route: '/admin/categories' },
    { label: 'Orders', icon: '🛒', route: '/admin/orders' },
  ];

  constructor() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    this.currentTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  protected closeSidebarOnMobile(): void {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
