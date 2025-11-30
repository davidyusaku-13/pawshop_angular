import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../../models';
import categoriesData from '../../data/categories.json';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoriesSignal = signal<Category[]>(categoriesData as Category[]);

  readonly categories = this.categoriesSignal.asReadonly();

  getCategoryById(id: string): Category | undefined {
    return this.categoriesSignal().find((category) => category.id === id);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categoriesSignal().find((category) => category.slug === slug);
  }
}
