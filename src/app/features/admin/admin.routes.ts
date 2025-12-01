import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/products.component').then((m) => m.AdminProductsComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/categories.component').then((m) => m.AdminCategoriesComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/orders.component').then((m) => m.AdminOrdersComponent),
      },
    ],
  },
];
