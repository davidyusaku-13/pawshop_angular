import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Order, OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-white">Orders</h1>
        <p class="text-slate-400">Manage and track customer orders</p>
      </div>

      <!-- Filters -->
      <div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-4">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            [class]="
              statusFilter() === ''
                ? 'bg-orange-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            "
            (click)="statusFilter.set('')"
          >
            All ({{ orders().length }})
          </button>
          @for (status of orderStatuses; track status) {
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            [class]="
              statusFilter() === status
                ? 'bg-orange-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            "
            (click)="statusFilter.set(status)"
          >
            {{ adminService.getStatusLabel(status) }}
            ({{ getStatusCount(status) }})
          </button>
          }
        </div>
      </div>

      <!-- Orders List -->
      <div class="space-y-4">
        @for (order of filteredOrders(); track order.id) {
        <div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
          <!-- Order Header -->
          <div
            class="p-4 bg-slate-700/50 border-b border-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div class="flex items-center gap-4">
              <div>
                <p class="font-semibold text-white">{{ order.orderNumber }}</p>
                <p class="text-sm text-slate-400">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="px-3 py-1 text-sm font-medium rounded-full"
                [class]="getStatusColorDark(order.status)"
              >
                {{ adminService.getStatusLabel(order.status) }}
              </span>
              <button
                type="button"
                class="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors cursor-pointer"
                title="View details"
                (click)="toggleOrderDetails(order.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 transition-transform"
                  [class.rotate-180]="expandedOrderId() === order.id"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="p-4">
            <div class="flex flex-wrap items-center gap-6 text-sm">
              <div>
                <span class="text-slate-400">Items:</span>
                <span class="font-medium text-white ml-1">{{ order.items.length }}</span>
              </div>
              <div>
                <span class="text-slate-400">Total:</span>
                <span class="font-medium text-white ml-1">
                  {{ adminService.formatPrice(order.total) }}
                </span>
              </div>
              <div>
                <span class="text-slate-400">Payment:</span>
                <span class="font-medium text-white ml-1 capitalize">
                  {{ order.paymentMethod.replace('-', ' ') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Expanded Details -->
          @if (expandedOrderId() === order.id) {
          <div class="border-t border-slate-700">
            <!-- Items -->
            <div class="p-4">
              <h4 class="font-medium text-white mb-3">Order Items</h4>
              <div class="space-y-2">
                @for (item of order.items; track item.product.id) {
                <div class="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                  <img
                    [src]="item.product.images[0]"
                    [alt]="item.product.name"
                    class="w-10 h-10 rounded object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">
                      {{ item.product.name }}
                    </p>
                    <p class="text-xs text-slate-400">
                      {{ adminService.formatPrice(item.product.price) }} × {{ item.quantity }}
                    </p>
                  </div>
                  <p class="text-sm font-medium text-white">
                    {{ adminService.formatPrice(item.product.price * item.quantity) }}
                  </p>
                </div>
                }
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="p-4 border-t border-slate-700">
              <h4 class="font-medium text-white mb-2">Shipping Address</h4>
              <div class="text-sm text-slate-300">
                <p class="font-medium">{{ order.shippingAddress.recipientName }}</p>
                <p>{{ order.shippingAddress.phone }}</p>
                <p>{{ order.shippingAddress.street }}</p>
                <p>{{ order.shippingAddress.district }}, {{ order.shippingAddress.city }}</p>
                <p>{{ order.shippingAddress.province }} {{ order.shippingAddress.postalCode }}</p>
              </div>
            </div>

            @if (order.notes) {
            <div class="p-4 border-t border-slate-700">
              <h4 class="font-medium text-white mb-2">Order Notes</h4>
              <p class="text-sm text-slate-300">{{ order.notes }}</p>
            </div>
            }

            <!-- Update Status -->
            <div class="p-4 border-t border-slate-700 bg-slate-700/30">
              <h4 class="font-medium text-white mb-3">Update Status</h4>
              <div class="flex flex-wrap gap-2">
                @for (status of orderStatuses; track status) {
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  [class]="
                    order.status === status
                      ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-800'
                      : ''
                  "
                  [class]="getStatusColorDark(status)"
                  [disabled]="order.status === status"
                  (click)="updateOrderStatus(order.id, status)"
                >
                  {{ adminService.getStatusLabel(status) }}
                </button>
                }
              </div>
            </div>
          </div>
          }
        </div>
        } @empty {
        <div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-12 text-center">
          <span class="text-5xl block mb-4">📦</span>
          <p class="text-slate-400">No orders found</p>
        </div>
        }
      </div>
    </div>
  `,
})
export class AdminOrdersComponent implements OnInit {
  protected readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  protected readonly orders = this.adminService.orders;
  protected readonly statusFilter = signal<OrderStatus | ''>('');
  protected readonly expandedOrderId = signal<string | null>(null);

  protected readonly orderStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  protected readonly filteredOrders = computed(() => {
    const filter = this.statusFilter();
    let orders = this.orders();

    if (filter) {
      orders = orders.filter((o) => o.status === filter);
    }

    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['status']) {
        this.statusFilter.set(params['status'] as OrderStatus);
      }
    });
  }

  protected getStatusCount(status: OrderStatus): number {
    return this.orders().filter((o) => o.status === status).length;
  }

  protected toggleOrderDetails(orderId: string): void {
    this.expandedOrderId.update((id) => (id === orderId ? null : orderId));
  }

  protected updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.adminService.updateOrderStatus(orderId, status);
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  protected getStatusColorDark(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      confirmed: 'bg-blue-500/20 text-blue-400',
      processing: 'bg-purple-500/20 text-purple-400',
      shipped: 'bg-cyan-500/20 text-cyan-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return colors[status] ?? 'bg-slate-500/20 text-slate-400';
  }
}
