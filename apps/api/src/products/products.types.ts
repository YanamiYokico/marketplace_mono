import { Product } from '@prisma/client';

export type ProductsPageResult = {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
};

export type FindCatalogParams = {
  search?: string;
  tags?: string[];
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  userId?: string;
};
