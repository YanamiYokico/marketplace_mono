import { apiFetch } from "@/shared/api/api-fetch";
import type { Product } from "@/entities/product";

export type CreateProductPayload = {
  name: string;
  price: number;
  rating?: number;
  imageUrl: string;
};

export async function fetchProductsByStore(storeId: string): Promise<Product[]> {
  return apiFetch(`/products?storeId=${storeId}`);
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
