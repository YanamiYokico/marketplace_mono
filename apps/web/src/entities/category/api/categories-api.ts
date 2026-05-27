import { apiFetch } from "@/shared/api/api-fetch";
import type { Category } from "../model/types";

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch("/categories");
}
