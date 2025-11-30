import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { Address } from '../../models/user.model';
import { PaymentMethod } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-orange-600">Home</a>
        <span>/</span>
        <a routerLink="/cart" class="hover:text-orange-600">Cart</a>
        <span>/</span>
        <span class="text-gray-900">Checkout</span>
      </nav>

      <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      @if (cartService.items().length > 0) {
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Address -->
          <section class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span
                class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold"
                >1</span
              >
              Shipping Address
            </h2>

            @if (authService.user()?.addresses?.length) {
            <!-- Existing Addresses -->
            <div class="space-y-3 mb-4">
              @for (addr of authService.user()?.addresses; track addr.id) {
              <label
                class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all"
                [class]="
                  selectedAddressId() === addr.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  type="radio"
                  name="address"
                  [value]="addr.id"
                  [checked]="selectedAddressId() === addr.id"
                  (change)="selectAddress(addr)"
                  class="mt-1"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900">{{ addr.label }}</span>
                    @if (addr.isDefault) {
                    <span class="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full"
                      >Default</span
                    >
                    }
                  </div>
                  <p class="text-sm text-gray-600 mt-1">{{ addr.recipientName }}</p>
                  <p class="text-sm text-gray-500">{{ addr.phone }}</p>
                  <p class="text-sm text-gray-500">
                    {{ addr.street }}, {{ addr.district }}, {{ addr.city }}, {{ addr.province }}
                    {{ addr.postalCode }}
                  </p>
                </div>
              </label>
              }
            </div>
            }

            <!-- New Address Toggle -->
            <button
              type="button"
              class="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
              (click)="showNewAddressForm.set(!showNewAddressForm())"
            >
              @if (showNewAddressForm()) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
              </svg>
              Cancel } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New Address }
            </button>

            <!-- New Address Form -->
            @if (showNewAddressForm() || !authService.user()?.addresses?.length) {
            <div class="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="label" class="block text-sm font-medium text-gray-700 mb-1"
                    >Label</label
                  >
                  <input
                    id="label"
                    type="text"
                    [(ngModel)]="newAddress.label"
                    name="label"
                    placeholder="e.g., Home, Office"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label for="recipientName" class="block text-sm font-medium text-gray-700 mb-1"
                    >Recipient Name</label
                  >
                  <input
                    id="recipientName"
                    type="text"
                    [(ngModel)]="newAddress.recipientName"
                    name="recipientName"
                    placeholder="Full name"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1"
                  >Phone Number</label
                >
                <input
                  id="phone"
                  type="tel"
                  [(ngModel)]="newAddress.phone"
                  name="phone"
                  placeholder="+62..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label for="street" class="block text-sm font-medium text-gray-700 mb-1"
                  >Street Address</label
                >
                <textarea
                  id="street"
                  [(ngModel)]="newAddress.street"
                  name="street"
                  rows="2"
                  placeholder="Full street address"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="district" class="block text-sm font-medium text-gray-700 mb-1"
                    >District</label
                  >
                  <input
                    id="district"
                    type="text"
                    [(ngModel)]="newAddress.district"
                    name="district"
                    placeholder="District/Kecamatan"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1"
                    >City</label
                  >
                  <input
                    id="city"
                    type="text"
                    [(ngModel)]="newAddress.city"
                    name="city"
                    placeholder="City"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="province" class="block text-sm font-medium text-gray-700 mb-1"
                    >Province</label
                  >
                  <input
                    id="province"
                    type="text"
                    [(ngModel)]="newAddress.province"
                    name="province"
                    placeholder="Province"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1"
                    >Postal Code</label
                  >
                  <input
                    id="postalCode"
                    type="text"
                    [(ngModel)]="newAddress.postalCode"
                    name="postalCode"
                    placeholder="Postal code"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <button
                type="button"
                class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                (click)="useNewAddress()"
              >
                Use This Address
              </button>
            </div>
            }
          </section>

          <!-- Payment Method -->
          <section class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span
                class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold"
                >2</span
              >
              Payment Method
            </h2>

            <div class="space-y-3">
              <!-- Bank Transfer -->
              <label
                class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all"
                [class]="
                  selectedPayment() === 'bank-transfer'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  type="radio"
                  name="payment"
                  value="bank-transfer"
                  [checked]="selectedPayment() === 'bank-transfer'"
                  (change)="selectedPayment.set('bank-transfer')"
                />
                <div class="flex-1">
                  <span class="font-medium text-gray-900">Bank Transfer</span>
                  <p class="text-sm text-gray-500">BCA, Mandiri, BNI, BRI</p>
                </div>
                <span class="text-2xl">🏦</span>
              </label>

              <!-- E-Wallet -->
              <label
                class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all"
                [class]="
                  selectedPayment() === 'e-wallet'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  type="radio"
                  name="payment"
                  value="e-wallet"
                  [checked]="selectedPayment() === 'e-wallet'"
                  (change)="selectedPayment.set('e-wallet')"
                />
                <div class="flex-1">
                  <span class="font-medium text-gray-900">E-Wallet</span>
                  <p class="text-sm text-gray-500">GoPay, OVO, DANA, ShopeePay</p>
                </div>
                <span class="text-2xl">📱</span>
              </label>

              <!-- COD -->
              <label
                class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all"
                [class]="
                  selectedPayment() === 'cod'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  [checked]="selectedPayment() === 'cod'"
                  (change)="selectedPayment.set('cod')"
                />
                <div class="flex-1">
                  <span class="font-medium text-gray-900">Cash on Delivery (COD)</span>
                  <p class="text-sm text-gray-500">Pay when you receive</p>
                </div>
                <span class="text-2xl">💵</span>
              </label>
            </div>
          </section>

          <!-- Order Notes -->
          <section class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span
                class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold"
                >3</span
              >
              Order Notes (Optional)
            </h2>
            <textarea
              [(ngModel)]="orderNotes"
              name="notes"
              rows="3"
              placeholder="Add any special instructions for your order..."
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </section>
        </div>

        <!-- Order Summary -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <!-- Items -->
            <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
              @for (item of cartService.items(); track item.product.id) {
              <div class="flex gap-3">
                <img
                  [src]="item.product.images[0]"
                  [alt]="item.product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 line-clamp-2">
                    {{ item.product.name }}
                  </p>
                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                  <p class="text-sm font-medium text-orange-600">
                    {{ orderService.formatPrice(item.product.price * item.quantity) }}
                  </p>
                </div>
              </div>
              }
            </div>

            <hr class="my-4" />

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal ({{ cartService.itemCount() }} items)</span>
                <span class="font-medium">{{
                  orderService.formatPrice(cartService.subtotal())
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                @if (cartService.shipping() === 0) {
                <span class="text-green-600 font-medium">FREE</span>
                } @else {
                <span class="font-medium">{{
                  orderService.formatPrice(cartService.shipping())
                }}</span>
                }
              </div>
              <hr class="my-4" />
              <div class="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span class="text-orange-600">{{
                  orderService.formatPrice(cartService.total())
                }}</span>
              </div>
            </div>

            <!-- Error Message -->
            @if (errorMessage()) {
            <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {{ errorMessage() }}
            </div>
            }

            <button
              type="button"
              [disabled]="!canPlaceOrder() || isProcessing()"
              class="w-full mt-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 active:bg-orange-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              (click)="placeOrder()"
            >
              @if (isProcessing()) {
              <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="3"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Processing... } @else { Place Order }
            </button>

            <p class="mt-4 text-xs text-gray-500 text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </aside>
      </div>
      } @else {
      <div class="text-center py-16">
        <span class="text-6xl mb-4 block">🛒</span>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-6">Add some items to your cart before checking out.</p>
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
export class CheckoutComponent {
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  protected readonly orderService = inject(OrderService);

  protected readonly showNewAddressForm = signal(false);
  protected readonly selectedAddressId = signal<string | null>(null);
  protected readonly selectedAddress = signal<Address | null>(null);
  protected readonly selectedPayment = signal<PaymentMethod>('bank-transfer');
  protected readonly isProcessing = signal(false);
  protected readonly errorMessage = signal('');

  protected orderNotes = '';

  protected newAddress: Omit<Address, 'id' | 'isDefault'> = {
    label: '',
    recipientName: '',
    phone: '',
    street: '',
    district: '',
    city: '',
    province: '',
    postalCode: '',
  };

  protected readonly canPlaceOrder = computed(() => {
    return this.selectedAddress() !== null && this.cartService.items().length > 0;
  });

  constructor() {
    // Select default address if available
    const user = this.authService.user();
    if (user?.addresses?.length) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      this.selectedAddressId.set(defaultAddr.id);
      this.selectedAddress.set(defaultAddr);
    }
  }

  protected selectAddress(addr: Address): void {
    this.selectedAddressId.set(addr.id);
    this.selectedAddress.set(addr);
    this.showNewAddressForm.set(false);
  }

  protected useNewAddress(): void {
    // Validate new address
    if (
      !this.newAddress.label ||
      !this.newAddress.recipientName ||
      !this.newAddress.phone ||
      !this.newAddress.street ||
      !this.newAddress.city ||
      !this.newAddress.province ||
      !this.newAddress.postalCode
    ) {
      this.errorMessage.set('Please fill in all address fields');
      return;
    }

    const address: Address = {
      id: `addr-${Date.now()}`,
      ...this.newAddress,
      isDefault: false,
    };

    this.selectedAddress.set(address);
    this.selectedAddressId.set(address.id);
    this.showNewAddressForm.set(false);
    this.errorMessage.set('');
  }

  protected placeOrder(): void {
    const address = this.selectedAddress();
    if (!address) {
      this.errorMessage.set('Please select or add a shipping address');
      return;
    }

    this.errorMessage.set('');
    this.isProcessing.set(true);

    // Simulate order processing
    setTimeout(() => {
      try {
        const order = this.orderService.createOrder(
          address,
          this.selectedPayment(),
          this.orderNotes || undefined
        );

        // Navigate to order confirmation
        this.router.navigate(['/checkout/confirmation', order.id]);
      } catch {
        this.errorMessage.set('Failed to place order. Please try again.');
        this.isProcessing.set(false);
      }
    }, 1500);
  }
}
