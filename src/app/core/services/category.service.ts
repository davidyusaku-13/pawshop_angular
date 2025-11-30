import { Injectable, signal } from '@angular/core';
import { Category, Subcategory } from '@models/category.model';
import categoriesData from '@data/categories.json';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoriesSignal = signal<Category[]>(categoriesData.categories as Category[]);

  readonly categories = this.categoriesSignal.asReadonly();

  getCategoryById(id: string): Category | undefined {
    return this.categoriesSignal().find((category) => category.id === id);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categoriesSignal().find((category) => category.slug === slug);
  }

  getSubcategoryById(categoryId: string, subcategoryId: string): Subcategory | undefined {
    const category = this.getCategoryById(categoryId);
    return category?.subcategories.find((sub) => sub.id === subcategoryId);
  }

  getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Subcategory | undefined {
    const category = this.getCategoryBySlug(categorySlug);
    return category?.subcategories.find((sub) => sub.slug === subcategorySlug);
  }

  getAllSubcategories(): { category: Category; subcategory: Subcategory }[] {
    const result: { category: Category; subcategory: Subcategory }[] = [];

    for (const category of this.categoriesSignal()) {
      for (const subcategory of category.subcategories) {
        result.push({ category, subcategory });
      }
    }

    return result;
  }
}
