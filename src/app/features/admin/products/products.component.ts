import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Product } from '../../../models/product.model';

type ModalMode = 'create' | 'edit' | null;

@Component({
  selector: 'app-admin-products',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Products</h1>
          <p class="text-slate-400">Manage your product inventory</p>
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
          Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Search products</label>
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                id="search"
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Search by name..."
                class="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div class="sm:w-48">
            <label for="category" class="sr-only">Filter by category</label>
            <select
              id="category"
              [(ngModel)]="selectedCategory"
              class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Categories</option>
              @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-700/50 border-b border-slate-600">
              <tr>
                <th
                  class="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  class="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  class="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  class="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Stock
                </th>
                <th
                  class="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="text-right px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              @for (product of filteredProducts(); track product.id) {
              <tr class="hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      [src]="product.images[0]"
                      [alt]="product.name"
                      class="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p class="font-medium text-white line-clamp-1">{{ product.name }}</p>
                      <p class="text-sm text-slate-400">{{ product.slug }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-slate-300">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-white">
                      {{ adminService.formatPrice(product.price) }}
                    </p>
                    @if (product.originalPrice) {
                    <p class="text-sm text-slate-500 line-through">
                      {{ adminService.formatPrice(product.originalPrice) }}
                    </p>
                    }
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [class]="
                      product.stock === 0
                        ? 'bg-red-500/20 text-red-400'
                        : product.stock < 10
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    "
                  >
                    {{ product.stock }} units
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    @if (product.isFeatured) {
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400"
                    >
                      Featured
                    </span>
                    } @if (product.isNew) {
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400"
                    >
                      New
                    </span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      class="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit product"
                      (click)="openEditModal(product)"
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
                      title="Delete product"
                      (click)="confirmDelete(product)"
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
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center">
                  <span class="text-5xl block mb-4">📦</span>
                  <p class="text-slate-400">No products found</p>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    @if (modalMode()) {
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" (click)="closeModal()"></div>
        <div
          class="relative bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700"
        >
          <div
            class="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between"
          >
            <h2 class="text-xl font-bold text-white">
              {{ modalMode() === 'create' ? 'Add New Product' : 'Edit Product' }}
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

          <form (submit)="saveProduct($event)" class="p-6 space-y-6">
            <!-- Basic Info -->
            <div class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  id="name"
                  type="text"
                  [(ngModel)]="form.name"
                  name="name"
                  required
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Royal Canin Indoor Adult"
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
                  rows="3"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Describe your product..."
                ></textarea>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="categoryId" class="block text-sm font-medium text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    [(ngModel)]="form.categoryId"
                    name="categoryId"
                    required
                    class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select category</option>
                    @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label for="stock" class="block text-sm font-medium text-slate-300 mb-1">
                    Stock *
                  </label>
                  <input
                    id="stock"
                    type="number"
                    [(ngModel)]="form.stock"
                    name="stock"
                    required
                    min="0"
                    class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="price" class="block text-sm font-medium text-slate-300 mb-1">
                    Price (IDR) *
                  </label>
                  <input
                    id="price"
                    type="number"
                    [(ngModel)]="form.price"
                    name="price"
                    required
                    min="0"
                    class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label for="originalPrice" class="block text-sm font-medium text-slate-300 mb-1">
                    Original Price (IDR)
                  </label>
                  <input
                    id="originalPrice"
                    type="number"
                    [(ngModel)]="form.originalPrice"
                    name="originalPrice"
                    min="0"
                    class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Leave empty if no discount"
                  />
                </div>
              </div>

              <div>
                <label for="images" class="block text-sm font-medium text-slate-300 mb-1">
                  Image URL *
                </label>
                <input
                  id="images"
                  type="url"
                  [(ngModel)]="form.imageUrl"
                  name="images"
                  required
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label for="tags" class="block text-sm font-medium text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  [(ngModel)]="form.tags"
                  name="tags"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="premium, adult, indoor"
                />
              </div>

              <div class="flex items-center gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="form.isFeatured"
                    name="isFeatured"
                    class="w-4 h-4 text-orange-600 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
                  />
                  <span class="text-sm text-slate-300">Featured Product</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="form.isNew"
                    name="isNew"
                    class="w-4 h-4 text-orange-600 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
                  />
                  <span class="text-sm text-slate-300">Mark as New</span>
                </label>
              </div>
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
                {{ modalMode() === 'create' ? 'Create Product' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (productToDelete()) {
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70" (click)="productToDelete.set(null)"></div>
        <div
          class="relative bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700"
        >
          <div class="text-center">
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
            <h3 class="text-lg font-bold text-white mb-2">Delete Product</h3>
            <p class="text-slate-400 mb-6">
              Are you sure you want to delete "{{ productToDelete()?.name }}"? This action cannot be
              undone.
            </p>
            <div class="flex justify-center gap-3">
              <button
                type="button"
                class="px-4 py-2 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                (click)="productToDelete.set(null)"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                (click)="deleteProduct()"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export class AdminProductsComponent implements OnInit {
  protected readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  protected readonly categories = this.adminService.categories;

  protected searchQuery = '';
  protected selectedCategory = '';

  protected readonly modalMode = signal<ModalMode>(null);
  protected readonly editingProduct = signal<Product | null>(null);
  protected readonly productToDelete = signal<Product | null>(null);

  protected form = this.getEmptyForm();

  protected readonly filteredProducts = computed(() => {
    let products = this.adminService.products();

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(query));
    }

    if (this.selectedCategory) {
      products = products.filter((p) => p.categoryId === this.selectedCategory);
    }

    return products;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'new') {
        this.openCreateModal();
      }
    });
  }

  protected getCategoryName(categoryId: string): string {
    return this.categories().find((c) => c.id === categoryId)?.name ?? 'Unknown';
  }

  protected openCreateModal(): void {
    this.form = this.getEmptyForm();
    this.editingProduct.set(null);
    this.modalMode.set('create');
  }

  protected openEditModal(product: Product): void {
    this.editingProduct.set(product);
    this.form = {
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      originalPrice: product.originalPrice ?? null,
      stock: product.stock,
      imageUrl: product.images[0] ?? '',
      tags: product.tags.join(', '),
      isFeatured: product.isFeatured,
      isNew: product.isNew,
    };
    this.modalMode.set('edit');
  }

  protected closeModal(): void {
    this.modalMode.set(null);
    this.editingProduct.set(null);
    this.form = this.getEmptyForm();
  }

  protected confirmDelete(product: Product): void {
    this.productToDelete.set(product);
  }

  protected deleteProduct(): void {
    const product = this.productToDelete();
    if (product) {
      this.adminService.deleteProduct(product.id);
      this.productToDelete.set(null);
    }
  }

  protected saveProduct(event: Event): void {
    event.preventDefault();

    const productData = {
      name: this.form.name,
      slug: this.adminService.generateSlug(this.form.name),
      description: this.form.description,
      categoryId: this.form.categoryId,
      price: this.form.price,
      originalPrice: this.form.originalPrice || undefined,
      stock: this.form.stock,
      images: [this.form.imageUrl],
      tags: this.form.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
      isFeatured: this.form.isFeatured,
      isNew: this.form.isNew,
      rating: 0,
      reviewCount: 0,
    };

    if (this.modalMode() === 'create') {
      this.adminService.createProduct(productData);
    } else {
      const editing = this.editingProduct();
      if (editing) {
        this.adminService.updateProduct(editing.id, productData);
      }
    }

    this.closeModal();
  }

  private getEmptyForm() {
    return {
      name: '',
      description: '',
      categoryId: '',
      price: 0,
      originalPrice: null as number | null,
      stock: 0,
      imageUrl: '',
      tags: '',
      isFeatured: false,
      isNew: false,
    };
  }
}
