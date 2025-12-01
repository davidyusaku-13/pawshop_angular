import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Category } from '../../../models/category.model';

type ModalMode = 'create' | 'edit' | null;

@Component({
  selector: 'app-admin-categories',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Categories</h1>
          <p class="text-slate-400">Organize your products into categories</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
          (click)="openCreateModal()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (category of categories(); track category.id) {
        <div
          class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden group"
        >
          <div class="relative h-32">
            <img [src]="category.image" [alt]="category.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <span class="absolute top-3 left-3 text-3xl">{{ category.icon }}</span>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-white">{{ category.name }}</h3>
            <p class="text-sm text-slate-400 line-clamp-2 mt-1">{{ category.description }}</p>
            <div class="flex items-center justify-between mt-4">
              <span class="text-sm text-slate-500">{{ category.productCount }} products</span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit category"
                  (click)="openEditModal(category)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete category"
                  (click)="confirmDelete(category)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        } @empty {
        <div class="col-span-full text-center py-12">
          <span class="text-5xl block mb-4">🏷️</span>
          <p class="text-slate-400">No categories yet</p>
        </div>
        }
      </div>
    </div>

    <!-- Category Modal -->
    @if (modalMode()) {
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" (click)="closeModal()"></div>
        <div
          class="relative bg-slate-800 rounded-2xl shadow-xl w-full max-w-md border border-slate-700"
        >
          <div class="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">
              {{ modalMode() === 'create' ? 'Add New Category' : 'Edit Category' }}
            </h2>
            <button
              type="button"
              class="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              (click)="closeModal()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (submit)="saveCategory($event)" class="p-6 space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-slate-300 mb-1">
                Category Name *
              </label>
              <input
                id="name"
                type="text"
                [(ngModel)]="form.name"
                name="name"
                required
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Food & Treats"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                [(ngModel)]="form.description"
                name="description"
                required
                rows="2"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Describe this category..."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="icon" class="block text-sm font-medium text-slate-300 mb-1">
                  Icon (Emoji) *
                </label>
                <input
                  id="icon"
                  type="text"
                  [(ngModel)]="form.icon"
                  name="icon"
                  required
                  maxlength="4"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-2xl"
                  placeholder="🐱"
                />
              </div>

              <div>
                <label for="slug" class="block text-sm font-medium text-slate-300 mb-1">Slug</label>
                <input
                  id="slug"
                  type="text"
                  [(ngModel)]="form.slug"
                  name="slug"
                  class="w-full px-4 py-2 bg-slate-600 border border-slate-500 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  [placeholder]="adminService.generateSlug(form.name || 'category-name')"
                  readonly
                />
              </div>
            </div>

            <div>
              <label for="image" class="block text-sm font-medium text-slate-300 mb-1">
                Image URL *
              </label>
              <input
                id="image"
                type="url"
                [(ngModel)]="form.image"
                name="image"
                required
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                class="px-4 py-2 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                (click)="closeModal()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
              >
                {{ modalMode() === 'create' ? 'Create Category' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (categoryToDelete()) {
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" (click)="categoryToDelete.set(null)"></div>
        <div
          class="relative bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700"
        >
          <div class="text-center">
            @if (deleteError()) {
            <div
              class="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 text-yellow-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Cannot Delete</h3>
            <p class="text-slate-400 mb-6">{{ deleteError() }}</p>
            <button
              type="button"
              class="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
              (click)="categoryToDelete.set(null); deleteError.set('')"
            >
              Close
            </button>
            } @else {
            <div
              class="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 text-red-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Delete Category</h3>
            <p class="text-slate-400 mb-6">
              Are you sure you want to delete "{{ categoryToDelete()?.name }}"? This action cannot
              be undone.
            </p>
            <div class="flex justify-center gap-3">
              <button
                type="button"
                class="px-4 py-2 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                (click)="categoryToDelete.set(null)"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                (click)="deleteCategory()"
              >
                Delete
              </button>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export class AdminCategoriesComponent implements OnInit {
  protected readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  protected readonly categories = this.adminService.categories;

  protected readonly modalMode = signal<ModalMode>(null);
  protected readonly editingCategory = signal<Category | null>(null);
  protected readonly categoryToDelete = signal<Category | null>(null);
  protected readonly deleteError = signal('');

  protected form = this.getEmptyForm();

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'new') {
        this.openCreateModal();
      }
    });
  }

  protected openCreateModal(): void {
    this.form = this.getEmptyForm();
    this.editingCategory.set(null);
    this.modalMode.set('create');
  }

  protected openEditModal(category: Category): void {
    this.editingCategory.set(category);
    this.form = {
      name: category.name,
      description: category.description,
      icon: category.icon,
      slug: category.slug,
      image: category.image,
    };
    this.modalMode.set('edit');
  }

  protected closeModal(): void {
    this.modalMode.set(null);
    this.editingCategory.set(null);
    this.form = this.getEmptyForm();
  }

  protected confirmDelete(category: Category): void {
    this.deleteError.set('');
    this.categoryToDelete.set(category);
  }

  protected deleteCategory(): void {
    const category = this.categoryToDelete();
    if (category) {
      const result = this.adminService.deleteCategory(category.id);
      if (!result.success) {
        this.deleteError.set(result.error ?? 'Failed to delete category');
      } else {
        this.categoryToDelete.set(null);
      }
    }
  }

  protected saveCategory(event: Event): void {
    event.preventDefault();

    const categoryData = {
      name: this.form.name,
      slug: this.adminService.generateSlug(this.form.name),
      description: this.form.description,
      icon: this.form.icon,
      image: this.form.image,
    };

    if (this.modalMode() === 'create') {
      this.adminService.createCategory(categoryData);
    } else {
      const editing = this.editingCategory();
      if (editing) {
        this.adminService.updateCategory(editing.id, categoryData);
      }
    }

    this.closeModal();
  }

  private getEmptyForm() {
    return {
      name: '',
      description: '',
      icon: '',
      slug: '',
      image: '',
    };
  }
}
