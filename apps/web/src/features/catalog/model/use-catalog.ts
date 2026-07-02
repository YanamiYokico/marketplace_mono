"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/entities/product";
import type { Category } from "@/entities/category";
import { fetchCategories } from "@/entities/category";
import {
  fetchAllProducts,
  type FetchAllProductsParams,
} from "@/features/products/api/products-api";

const LIMIT = 4;

export type SortOption = "price_asc" | "price_desc" | "rating_desc";

export type CatalogFilters = {
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  tags: string[];
};

export function useCatalog(search = "") {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<CatalogFilters>({
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    tags: [],
  });
  const [sort, setSort] = useState<SortOption>("rating_desc");

  const load = useCallback(
    async (
      currentFilters: CatalogFilters,
      currentSort: SortOption,
      currentPage: number,
      currentSearch: string,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const params: FetchAllProductsParams = { page: currentPage, limit: LIMIT };
        if (currentSearch) params.search = currentSearch;
        if (currentFilters.tags.length > 0) params.tags = currentFilters.tags;
        if (currentFilters.categoryId) params.categoryId = currentFilters.categoryId;
        if (currentFilters.minPrice !== "") params.minPrice = Number(currentFilters.minPrice);
        if (currentFilters.maxPrice !== "") params.maxPrice = Number(currentFilters.maxPrice);

        if (currentSort === "price_asc") { params.sortBy = "price"; params.sortOrder = "asc"; }
        else if (currentSort === "price_desc") { params.sortBy = "price"; params.sortOrder = "desc"; }
        else if (currentSort === "rating_desc") { params.sortBy = "rating"; params.sortOrder = "desc"; }

        const result = await fetchAllProducts(params);
        setProducts(result.data);
        setTotalPages(result.totalPages);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load products");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  // Reset to the first page whenever the search term changes.
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    load(filters, sort, page, search);
  }, [filters, sort, page, search, load]);

  const applyFilters = (next: CatalogFilters) => {
    setFilters(next);
    setPage(1);
  };

  const applySort = (next: SortOption) => {
    setSort(next);
    setPage(1);
  };

  return {
    products,
    categories,
    isLoading,
    error,
    page,
    totalPages,
    filters,
    sort,
    applyFilters,
    applySort,
    setPage,
  };
}
