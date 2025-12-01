import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Dashboard</h1>
          <p class="text-slate-400 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span
            class="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full font-medium flex items-center gap-2"
          >
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Store Online
          </span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Products -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400">Total Products</p>
              <p class="text-3xl font-bold text-white mt-2">{{ stats().totalProducts }}</p>
              <p class="text-xs text-slate-500 mt-2">Active listings</p>
            </div>
            <div class="p-3 bg-blue-500/10 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-blue-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Orders -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400">Total Orders</p>
              <p class="text-3xl font-bold text-white mt-2">{{ stats().totalOrders }}</p>
              <p class="text-xs text-slate-500 mt-2">All time orders</p>
            </div>
            <div class="p-3 bg-green-500/10 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-green-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div
          class="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-orange-300/80">Total Revenue</p>
              <p class="text-3xl font-bold text-white mt-2">
                {{ adminService.formatPrice(stats().totalRevenue) }}
              </p>
              <p class="text-xs text-orange-300/60 mt-2">Lifetime earnings</p>
            </div>
            <div class="p-3 bg-orange-500/20 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-orange-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Pending Orders -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400">Pending Orders</p>
              <p class="text-3xl font-bold text-white mt-2">{{ stats().pendingOrders }}</p>
              <p class="text-xs text-slate-500 mt-2">Awaiting action</p>
            </div>
            <div class="p-3 bg-yellow-500/10 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-yellow-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden"
        >
          <div class="p-6 border-b border-slate-700/50">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-white">Recent Orders</h2>
                <p class="text-sm text-slate-500 mt-0.5">Latest customer orders</p>
              </div>
              <a
                routerLink="/admin/orders"
                class="text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 group"
              >
                View all
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div class="divide-y divide-slate-700/50">
            @for (order of recentOrders(); track order.id) {
            <div class="p-4 hover:bg-slate-700/30 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300 font-mono text-xs"
                  >
                    #{{ order.orderNumber.split('-').pop() }}
                  </div>
                  <div>
                    <p class="font-medium text-white">{{ order.orderNumber }}</p>
                    <p class="text-sm text-slate-500">
                      {{ order.items.length }} item(s) •
                      {{ adminService.formatPrice(order.total) }}
                    </p>
                  </div>
                </div>
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-lg"
                  [class]="getAdminStatusColor(order.status)"
                >
                  {{ adminService.getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
            } @empty {
            <div class="p-12 text-center">
              <div
                class="w-16 h-16 mx-auto rounded-2xl bg-slate-700/50 flex items-center justify-center mb-4"
              >
                <span class="text-3xl">📦</span>
              </div>
              <p class="text-slate-400">No orders yet</p>
              <p class="text-sm text-slate-500 mt-1">Orders will appear here</p>
            </div>
            }
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden"
        >
          <div class="p-6 border-b border-slate-700/50">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-white">Low Stock Alert</h2>
                <p class="text-sm text-slate-500 mt-0.5">Products running low</p>
              </div>
              <span
                class="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
              >
                {{ stats().lowStockProducts }} items
              </span>
            </div>
          </div>
          <div class="divide-y divide-slate-700/50 max-h-80 overflow-y-auto">
            @for (product of lowStockProducts(); track product.id) {
            <div class="p-4 hover:bg-slate-700/30 transition-colors">
              <div class="flex items-center gap-3">
                <img
                  [src]="product.images[0]"
                  [alt]="product.name"
                  class="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-white truncate">{{ product.name }}</p>
                  <p class="text-sm text-slate-500">
                    {{ adminService.formatPrice(product.price) }}
                  </p>
                </div>
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-lg"
                  [class]="
                    product.stock === 0
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  "
                >
                  {{ product.stock }} left
                </span>
              </div>
            </div>
            } @empty {
            <div class="p-12 text-center">
              <div
                class="w-16 h-16 mx-auto rounded-2xl bg-green-500/10 flex items-center justify-center mb-4"
              >
                <span class="text-3xl">✅</span>
              </div>
              <p class="text-slate-400">All products are well stocked!</p>
              <p class="text-sm text-slate-500 mt-1">No action needed</p>
            </div>
            }
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-semibold text-white">Quick Actions</h2>
            <p class="text-sm text-slate-500 mt-0.5">Common tasks and shortcuts</p>
          </div>
        </div>
        <div class="grid sm:grid-cols-3 gap-4">
          <a
            routerLink="/admin/products"
            [queryParams]="{ action: 'new' }"
            class="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all group shadow-lg shadow-orange-500/20"
          >
            <div class="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5 text-white"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-white">Add Product</p>
              <p class="text-sm text-orange-100/80">Create new listing</p>
            </div>
          </a>

          <a
            routerLink="/admin/categories"
            [queryParams]="{ action: 'new' }"
            class="flex items-center gap-4 p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl hover:bg-slate-700 hover:border-slate-500 transition-all group"
          >
            <div
              class="p-2 bg-slate-600/50 rounded-lg group-hover:bg-slate-500/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5 text-slate-300"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-white">Add Category</p>
              <p class="text-sm text-slate-400">Organize products</p>
            </div>
          </a>

          <a
            routerLink="/admin/orders"
            [queryParams]="{ status: 'pending' }"
            class="flex items-center gap-4 p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl hover:bg-slate-700 hover:border-slate-500 transition-all group"
          >
            <div
              class="p-2 bg-slate-600/50 rounded-lg group-hover:bg-slate-500/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5 text-slate-300"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-white">Pending Orders</p>
              <p class="text-sm text-slate-400">Review & process</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {
  protected readonly adminService = inject(AdminService);

  protected readonly stats = this.adminService.dashboardStats;
  protected readonly recentOrders = this.adminService.recentOrders;
  protected readonly lowStockProducts = this.adminService.lowStockProducts;

  protected getAdminStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      confirmed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      processing: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      shipped: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      delivered: 'bg-green-500/10 text-green-400 border border-green-500/20',
      cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };
    return colors[status] || colors['pending'];
  }
}
