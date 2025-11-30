import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-confirmation',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (order(); as ord) {
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Success Header -->
      <div class="text-center mb-10">
        <div
          class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-10 h-10 text-green-600"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully! 🎉</h1>
        <p class="text-gray-600">Thank you for your order. We'll send you an update soon.</p>
      </div>

      <!-- Order Details Card -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Order Header -->
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p class="text-orange-100 text-sm">Order Number</p>
              <p class="text-2xl font-bold">{{ ord.orderNumber }}</p>
            </div>
            <div class="text-right">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm"
              >
                {{ orderService.getStatusLabel(ord.status) }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Order Items -->
          <section>
            <h2 class="font-semibold text-gray-900 mb-4">Order Items</h2>
            <div class="space-y-3">
              @for (item of ord.items; track item.product.id) {
              <div class="flex gap-4 p-3 bg-gray-50 rounded-lg">
                <img
                  [src]="item.product.images[0]"
                  [alt]="item.product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 line-clamp-1">{{ item.product.name }}</p>
                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                </div>
                <p class="font-medium text-gray-900">
                  {{ orderService.formatPrice(item.product.price * item.quantity) }}
                </p>
              </div>
              }
            </div>
          </section>

          <hr />

          <!-- Order Summary -->
          <section>
            <h2 class="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>{{ orderService.formatPrice(ord.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                @if (ord.shipping === 0) {
                <span class="text-green-600 font-medium">FREE</span>
                } @else {
                <span>{{ orderService.formatPrice(ord.shipping) }}</span>
                }
              </div>
              <div class="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span class="text-orange-600">{{ orderService.formatPrice(ord.total) }}</span>
              </div>
            </div>
          </section>

          <hr />

          <!-- Shipping & Payment -->
          <div class="grid sm:grid-cols-2 gap-6">
            <!-- Shipping Address -->
            <section>
              <h2 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span class="text-xl">📍</span> Shipping Address
              </h2>
              <div class="text-sm text-gray-600 space-y-1">
                <p class="font-medium text-gray-900">{{ ord.shippingAddress.recipientName }}</p>
                <p>{{ ord.shippingAddress.phone }}</p>
                <p>{{ ord.shippingAddress.street }}</p>
                <p>{{ ord.shippingAddress.district }}, {{ ord.shippingAddress.city }}</p>
                <p>{{ ord.shippingAddress.province }} {{ ord.shippingAddress.postalCode }}</p>
              </div>
            </section>

            <!-- Payment Method -->
            <section>
              <h2 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span class="text-xl">💳</span> Payment Method
              </h2>
              <p class="text-sm text-gray-600">
                {{ orderService.getPaymentMethodLabel(ord.paymentMethod) }}
              </p>

              @if (ord.paymentMethod === 'bank-transfer') {
              <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm font-medium text-yellow-800">Payment Instructions</p>
                <p class="text-sm text-yellow-700 mt-1">
                  Please transfer to BCA 1234567890 (Pawshop) within 24 hours.
                </p>
              </div>
              } @else if (ord.paymentMethod === 'e-wallet') {
              <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm font-medium text-blue-800">Payment Instructions</p>
                <p class="text-sm text-blue-700 mt-1">
                  Please complete payment via your e-wallet app within 24 hours.
                </p>
              </div>
              } @else if (ord.paymentMethod === 'cod') {
              <div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm font-medium text-green-800">Pay on Delivery</p>
                <p class="text-sm text-green-700 mt-1">
                  Please prepare {{ orderService.formatPrice(ord.total) }} in cash when your order
                  arrives.
                </p>
              </div>
              }
            </section>
          </div>

          @if (ord.notes) {
          <hr />
          <section>
            <h2 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span class="text-xl">📝</span> Order Notes
            </h2>
            <p class="text-sm text-gray-600">{{ ord.notes }}</p>
          </section>
          }
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 p-6 border-t">
          <div class="flex flex-col sm:flex-row gap-4">
            <a
              routerLink="/orders"
              class="flex-1 py-3 px-6 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              View All Orders
            </a>
            <a
              routerLink="/products"
              class="flex-1 py-3 px-6 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors text-center"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>
          Questions about your order?
          <a href="#" class="text-orange-600 hover:underline">Contact Support</a>
          or WhatsApp us at
          <a href="https://wa.me/6281234567890" class="text-orange-600 hover:underline"
            >+62 812-3456-7890</a
          >
        </p>
      </div>
    </div>
    } @else {
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <span class="text-6xl mb-4 block">🔍</span>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
      <p class="text-gray-500 mb-6">
        The order you're looking for doesn't exist or has been removed.
      </p>
      <a
        routerLink="/"
        class="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
      >
        Go Home
      </a>
    </div>
    }
  `,
})
export class OrderConfirmationComponent implements OnInit {
  protected readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly order = signal<Order | undefined>(undefined);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const orderId = params['orderId'];
      const order = this.orderService.getOrderById(orderId);
      this.order.set(order);
    });
  }
}
