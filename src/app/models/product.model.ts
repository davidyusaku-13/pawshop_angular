export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating' | 'newest';
}
