import { apiFetch } from "@/shared/api/api-fetch";
import type { Product } from "@/entities/product";

export type CreateProductPayload = {
  name: string;
  price: number;
  rating?: number;
  imageUrl: string;
  categoryId?: string;
};

export type FetchAllProductsParams = {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "rating";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type ProductsPage = {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
};

export async function fetchProductsByStore(storeId: string): Promise<Product[]> {
  return apiFetch(`/products?storeId=${storeId}`);
}

export async function fetchAllProducts(
  params: FetchAllProductsParams = {},
): Promise<ProductsPage> {
  const query = new URLSearchParams();
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiFetch(`/products${qs ? `?${qs}` : ""}`);
}

export async function createProduct(
  payload: CreateProductPayload,
  token: string,
): Promise<Product> {
  return apiFetch("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
