import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header Section -->
      <div class="mb-8">
        <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <a routerLink="/" class="hover:text-orange-600 transition-colors">Home</a>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span class="text-gray-900 font-medium">My Orders</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">Order History</h1>
        <p class="text-gray-500 mt-2">Track and manage your recent purchases</p>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="flex gap-8 -mb-px overflow-x-auto" aria-label="Tabs">
          @for (tab of tabs; track tab.id) {
          <button
            (click)="activeTab.set(tab.id)"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-0"
            [class]="
              activeTab() === tab.id
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
          >
            {{ tab.label }}
            <span
              class="ml-2 py-0.5 px-2.5 rounded-full text-xs"
              [class]="
                activeTab() === tab.id
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ getCount(tab.id) }}
            </span>
          </button>
          }
        </nav>
      </div>

      @if (filteredOrders().length > 0) {
      <div class="space-y-6">
        @for (order of filteredOrders(); track order.id) {
        <article
          class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
        >
          <!-- Order Header -->
          <div
            class="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="flex flex-wrap gap-x-8 gap-y-2">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Order Placed
                </p>
                <p class="text-sm font-medium text-gray-900 mt-0.5">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Total Amount
                </p>
                <p class="text-sm font-medium text-gray-900 mt-0.5">
                  {{ orderService.formatPrice(order.total) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Order Number
                </p>
                <p class="text-sm font-medium text-gray-900 mt-0.5 font-mono">
                  {{ order.orderNumber }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border"
                [class]="getStatusClasses(order.status)"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  [class]="getStatusDotColor(order.status)"
                ></span>
                {{ orderService.getStatusLabel(order.status) }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-6">
            <div class="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <!-- Images Stack -->
              <div class="flex -space-x-3 overflow-hidden py-1 pl-1">
                @for (item of order.items.slice(0, 4); track item.product.id) {
                <div
                  class="relative inline-block w-16 h-16 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-white ring-1 ring-gray-100"
                >
                  <img
                    [src]="item.product.images[0]"
                    [alt]="item.product.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                } @if (order.items.length > 4) {
                <div
                  class="relative inline-block w-16 h-16 rounded-lg border-2 border-white shadow-sm bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-gray-600"
                    >+{{ order.items.length - 4 }}</span
                  >
                </div>
                }
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-base font-medium text-gray-900 mb-1">
                  {{ order.items.length }} {{ order.items.length === 1 ? 'Item' : 'Items' }}
                </h3>
                <p class="text-sm text-gray-500 truncate">
                  {{ order.items[0].product.name }}
                  @if (order.items.length > 1) {
                  <span class="text-gray-400">& {{ order.items.length - 1 }} more</span>
                  }
                </p>
                <div class="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  {{ orderService.getPaymentMethodLabel(order.paymentMethod) }}
                </div>
              </div>

              <div class="w-full sm:w-auto mt-4 sm:mt-0">
                <a
                  [routerLink]="['/checkout/confirmation', order.id]"
                  class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors shadow-sm"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </article>
        }
      </div>
      } @else {
      <div class="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <div
          class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-1 ring-gray-100"
        >
          <svg
            class="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">
          {{
            activeTab() === 'all'
              ? "Looks like you haven't placed any orders yet."
              : 'No orders found in this category.'
          }}
        </p>
        <a
          routerLink="/products"
          class="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm hover:shadow"
        >
          Start Shopping
          <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
      }
    </div>
  `,
})
export class OrdersComponent {
  protected readonly orderService = inject(OrderService);

  protected readonly tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ] as const;

  protected readonly activeTab = signal<(typeof this.tabs)[number]['id']>('all');

  protected readonly filteredOrders = computed(() => {
    const orders = this.orderService.userOrders();
    const tab = this.activeTab();

    // Sort by date descending (newest first)
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (tab === 'all') return sortedOrders;
    if (tab === 'active')
      return sortedOrders.filter((o) =>
        ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
      );
    if (tab === 'completed') return sortedOrders.filter((o) => o.status === 'delivered');
    if (tab === 'cancelled') return sortedOrders.filter((o) => o.status === 'cancelled');
    return sortedOrders;
  });

  protected getCount(tabId: string): number {
    const orders = this.orderService.userOrders();
    if (tabId === 'all') return orders.length;
    if (tabId === 'active')
      return orders.filter((o) =>
        ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
      ).length;
    if (tabId === 'completed') return orders.filter((o) => o.status === 'delivered').length;
    if (tabId === 'cancelled') return orders.filter((o) => o.status === 'cancelled').length;
    return 0;
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  protected getStatusClasses(status: string): string {
    const base = 'border';
    switch (status) {
      case 'pending':
        return `${base} border-yellow-200 bg-yellow-50 text-yellow-700`;
      case 'confirmed':
        return `${base} border-blue-200 bg-blue-50 text-blue-700`;
      case 'processing':
        return `${base} border-purple-200 bg-purple-50 text-purple-700`;
      case 'shipped':
        return `${base} border-indigo-200 bg-indigo-50 text-indigo-700`;
      case 'delivered':
        return `${base} border-green-200 bg-green-50 text-green-700`;
      case 'cancelled':
        return `${base} border-red-200 bg-red-50 text-red-700`;
      default:
        return `${base} border-gray-200 bg-gray-50 text-gray-700`;
    }
  }

  protected getStatusDotColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400';
      case 'confirmed':
        return 'bg-blue-400';
      case 'processing':
        return 'bg-purple-400';
      case 'shipped':
        return 'bg-indigo-400';
      case 'delivered':
        return 'bg-green-400';
      case 'cancelled':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  }
}
