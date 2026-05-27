import type { Product } from "@/entities/product";

export type CartItem = {
  product: Product;
  quantity: number;
};
