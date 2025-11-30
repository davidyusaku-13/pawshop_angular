import { Injectable, signal, computed } from '@angular/core';
import { Product } from '@models/product.model';
import productsData from '@data/products.json';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>(productsData.products as Product[]);

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

  getProductsBySubcategory(subcategoryId: string): Product[] {
    return this.productsSignal().filter((product) => product.subcategoryId === subcategoryId);
  }

  searchProducts(query: string): Product[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return this.productsSignal();

    return this.productsSignal().filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
  }

  filterProducts(options: {
    categoryId?: string;
    subcategoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    brands?: string[];
    inStock?: boolean;
    search?: string;
  }): Product[] {
    let filtered = this.productsSignal();

    if (options.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === options.categoryId);
    }

    if (options.subcategoryId) {
      filtered = filtered.filter((p) => p.subcategoryId === options.subcategoryId);
    }

    if (options.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= options.minPrice!);
    }

    if (options.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= options.maxPrice!);
    }

    if (options.brands && options.brands.length > 0) {
      filtered = filtered.filter((p) => options.brands!.includes(p.brand));
    }

    if (options.inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    if (options.search) {
      const searchTerm = options.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  }

  sortProducts(
    products: Product[],
    sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
  ): Product[] {
    const sorted = [...products];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return sorted;
    }
  }

  getAllBrands(): string[] {
    const brands = new Set(this.productsSignal().map((p) => p.brand));
    return Array.from(brands).sort();
  }

  getPriceRange(): { min: number; max: number } {
    const prices = this.productsSignal().map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}
