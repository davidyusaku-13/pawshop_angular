import { Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { OrderConfirmationComponent } from './order-confirmation.component';
import { OrdersComponent } from './orders.component';
import { authGuard } from '../../core/guards/auth.guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    canActivate: [authGuard],
    title: 'Checkout - Pawshop',
  },
  {
    path: 'confirmation/:orderId',
    component: OrderConfirmationComponent,
    canActivate: [authGuard],
    title: 'Order Confirmation - Pawshop',
  },
];

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrdersComponent,
    canActivate: [authGuard],
    title: 'My Orders - Pawshop',
  },
];
