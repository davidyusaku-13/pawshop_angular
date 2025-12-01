import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Order, OrderStatus } from '../../models/order.model';
import { User } from '../../models/user.model';
import { AuthService } from './auth.service';
import productsData from '../../data/products.json';
import categoriesData from '../../data/categories.json';
import ordersData from '../../data/orders.json';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  lowStockProducts: number;
  pendingOrders: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly authService = inject(AuthService);

  // Products
  private readonly productsSignal = signal<Product[]>(productsData as Product[]);
  readonly products = this.productsSignal.asReadonly();

  // Categories
  private readonly categoriesSignal = signal<Category[]>(categoriesData as Category[]);
  readonly categories = this.categoriesSignal.asReadonly();

  // Orders
  private readonly ordersSignal = signal<Order[]>(ordersData as Order[]);
  readonly orders = this.ordersSignal.asReadonly();

  // Computed stats
  readonly dashboardStats = computed<DashboardStats>(() => {
    const products = this.productsSignal();
    const orders = this.ordersSignal();
    const users = this.authService.allUsers();

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
      totalUsers: users.length,
      lowStockProducts: products.filter((p) => p.stock < 10).length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
    };
  });

  readonly recentOrders = computed(() =>
    [...this.ordersSignal()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  );

  readonly lowStockProducts = computed(() =>
    this.productsSignal()
      .filter((p) => p.stock < 10)
      .sort((a, b) => a.stock - b.stock)
  );

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    // Load products
    const storedProducts = localStorage.getItem('pawshop_admin_products');
    if (storedProducts) {
      try {
        this.productsSignal.set(JSON.parse(storedProducts));
      } catch {
        // Keep default
      }
    }

    // Load categories
    const storedCategories = localStorage.getItem('pawshop_admin_categories');
    if (storedCategories) {
      try {
        this.categoriesSignal.set(JSON.parse(storedCategories));
      } catch {
        // Keep default
      }
    }

    // Load orders
    const storedOrders = localStorage.getItem('pawshop_admin_orders');
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders);
        // Merge with default orders
        const defaultIds = (ordersData as Order[]).map((o) => o.id);
        const newOrders = parsed.filter((o: Order) => !defaultIds.includes(o.id));
        this.ordersSignal.set([...(ordersData as Order[]), ...newOrders]);
      } catch {
        // Keep default
      }
    }
  }

  private saveProducts(): void {
    localStorage.setItem('pawshop_admin_products', JSON.stringify(this.productsSignal()));
  }

  private saveCategories(): void {
    localStorage.setItem('pawshop_admin_categories', JSON.stringify(this.categoriesSignal()));
  }

  private saveOrders(): void {
    localStorage.setItem('pawshop_admin_orders', JSON.stringify(this.ordersSignal()));
  }

  // ========== PRODUCTS ==========

  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.productsSignal.update((products) => [...products, newProduct]);
    this.saveProducts();
    this.updateCategoryProductCount(product.categoryId);

    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    let updatedProduct: Product | null = null;
    const oldProduct = this.productsSignal().find((p) => p.id === id);

    this.productsSignal.update((products) =>
      products.map((p) => {
        if (p.id === id) {
          updatedProduct = { ...p, ...updates };
          return updatedProduct;
        }
        return p;
      })
    );

    if (updatedProduct) {
      this.saveProducts();

      // Update category counts if category changed
      if (oldProduct && updates.categoryId && oldProduct.categoryId !== updates.categoryId) {
        this.updateCategoryProductCount(oldProduct.categoryId);
        this.updateCategoryProductCount(updates.categoryId);
      }
    }

    return updatedProduct;
  }

  deleteProduct(id: string): boolean {
    const product = this.productsSignal().find((p) => p.id === id);
    if (!product) return false;

    this.productsSignal.update((products) => products.filter((p) => p.id !== id));
    this.saveProducts();
    this.updateCategoryProductCount(product.categoryId);

    return true;
  }

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }

  // ========== CATEGORIES ==========

  createCategory(category: Omit<Category, 'id' | 'productCount'>): Category {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };

    this.categoriesSignal.update((categories) => [...categories, newCategory]);
    this.saveCategories();

    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    let updatedCategory: Category | null = null;

    this.categoriesSignal.update((categories) =>
      categories.map((c) => {
        if (c.id === id) {
          updatedCategory = { ...c, ...updates };
          return updatedCategory;
        }
        return c;
      })
    );

    if (updatedCategory) {
      this.saveCategories();
    }

    return updatedCategory;
  }

  deleteCategory(id: string): { success: boolean; error?: string } {
    const productsInCategory = this.productsSignal().filter((p) => p.categoryId === id);

    if (productsInCategory.length > 0) {
      return {
        success: false,
        error: `Cannot delete category with ${productsInCategory.length} products. Please move or delete products first.`,
      };
    }

    this.categoriesSignal.update((categories) => categories.filter((c) => c.id !== id));
    this.saveCategories();

    return { success: true };
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoriesSignal().find((c) => c.id === id);
  }

  private updateCategoryProductCount(categoryId: string): void {
    const count = this.productsSignal().filter((p) => p.categoryId === categoryId).length;

    this.categoriesSignal.update((categories) =>
      categories.map((c) => (c.id === categoryId ? { ...c, productCount: count } : c))
    );
    this.saveCategories();
  }

  // ========== ORDERS ==========

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    let updatedOrder: Order | null = null;

    this.ordersSignal.update((orders) =>
      orders.map((o) => {
        if (o.id === orderId) {
          updatedOrder = { ...o, status, updatedAt: new Date().toISOString() };
          return updatedOrder;
        }
        return o;
      })
    );

    if (updatedOrder) {
      this.saveOrders();
    }

    return updatedOrder;
  }

  getOrderById(id: string): Order | undefined {
    return this.ordersSignal().find((o) => o.id === id);
  }

  // ========== UTILITIES ==========

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      pending: 'Pending Payment',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status];
  }

  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status];
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
