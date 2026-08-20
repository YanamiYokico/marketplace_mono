export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type Product = {
  id: string;
  name: string;
  price: number;
  rating: number | null;
  stock: number;
  tags: string[];
  imageUrl: string;
  images?: string[];
  shortDescription?: string | null;
  description?: string | null;
  brand?: string | null;
  sku?: string | null;
  status?: ProductStatus;
  storeId: string;
  categoryId?: string | null;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
};
