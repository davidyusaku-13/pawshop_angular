import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-orange-600">Home</a>
        <span>/</span>
        <span class="text-gray-900">My Orders</span>
      </nav>

      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      @if (orderService.userOrders().length > 0) {
      <div class="space-y-4">
        @for (order of orderService.userOrders(); track order.id) {
        <article class="bg-white rounded-xl shadow-sm overflow-hidden">
          <!-- Order Header -->
          <div
            class="p-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          >
            <div>
              <p class="font-medium text-gray-900">{{ order.orderNumber }}</p>
              <p class="text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium self-start"
              [class]="orderService.getStatusColor(order.status)"
            >
              {{ orderService.getStatusLabel(order.status) }}
            </span>
          </div>

          <!-- Order Items Preview -->
          <div class="p-4">
            <div class="flex gap-4 items-center">
              <div class="flex -space-x-2">
                @for (item of order.items.slice(0, 3); track item.product.id) {
                <img
                  [src]="item.product.images[0]"
                  [alt]="item.product.name"
                  class="w-12 h-12 object-cover rounded-lg border-2 border-white"
                />
                } @if (order.items.length > 3) {
                <div
                  class="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600"
                >
                  +{{ order.items.length - 3 }}
                </div>
                }
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-600">
                  {{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}
                </p>
                <p class="font-semibold text-gray-900">
                  {{ orderService.formatPrice(order.total) }}
                </p>
              </div>
              <a
                [routerLink]="['/checkout/confirmation', order.id]"
                class="px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition-colors"
              >
                View Details
              </a>
            </div>
          </div>
        </article>
        }
      </div>
      } @else {
      <div class="text-center py-16">
        <span class="text-6xl mb-4 block">📦</span>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p class="text-gray-500 mb-6">Start shopping to see your orders here.</p>
        <a
          routerLink="/products"
          class="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Browse Products
        </a>
      </div>
      }
    </div>
  `,
})
export class OrdersComponent {
  protected readonly orderService = inject(OrderService);

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
