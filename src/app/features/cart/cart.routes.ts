import { Routes } from '@angular/router';
import { CartComponent } from './cart.component';
import { authGuard } from '../../core/guards/auth.guard';

export const CART_ROUTES: Routes = [
  {
    path: '',
    component: CartComponent,
    canActivate: [authGuard],
    title: 'Shopping Cart - Pawshop',
  },
];
