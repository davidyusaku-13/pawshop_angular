import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductFilter } from '../../models';
import productsData from '../../data/products.json';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>(productsData as Product[]);

  readonly products = this.productsSignal.asReadonly();

  readonly featuredProducts = computed(() =>
    this.productsSignal().filter((product) => product.isFeatured)
  );

  readonly newProducts = computed(() => this.productsSignal().filter((product) => product.isNew));

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find((product) => product.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.productsSignal().find((product) => product.slug === slug);
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.productsSignal().filter((product) => product.categoryId === categoryId);
  }

  filterProducts(filter: ProductFilter): Product[] {
    let filtered = [...this.productsSignal()];

    if (filter.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === filter.categoryId);
    }

    if (filter.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filter.maxPrice!);
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((p) => filter.tags!.some((tag) => p.tags.includes(tag)));
    }

    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    return filtered;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}
