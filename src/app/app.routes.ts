import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component'),
    title: 'Pawshop - Premium Cat Care Products',
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list.component'),
    title: 'All Products - Pawshop',
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./features/products/product-list.component'),
    title: 'Category - Pawshop',
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./features/products/product-detail.component'),
    title: 'Product Details - Pawshop',
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component'),
    title: 'Shopping Cart - Pawshop',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
