"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/features/products/ui/product-card";
import { useCatalog, CatalogSort } from "@/features/catalog";
import { SidebarFilters, type FilterState } from "@/widgets/catalog-sidebar";
import { CatalogBanner } from "@/widgets/catalog-banner";
import { Pagination } from "@/shared/ui/pagination";
import { useSession } from "@/entities/session";
import { fetchMyStore } from "@/features/products/api/store-api";

export function CatalogView() {
  const { token } = useSession();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const [myStoreId, setMyStoreId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchMyStore(token)
      .then((store) => { if (store) setMyStoreId(store.id); })
      .catch(() => {});
  }, [token]);

  const {
    products,
    isLoading,
    error,
    page,
    totalPages,
    sort,
    applyFilters,
    applySort,
    setPage,
  } = useCatalog(search);

  // Map the sidebar's "Price" buckets to the backend min/max range.
  // (The other sections are UI-only until product attributes exist on the backend.)
  const PRICE_BUCKETS: Record<string, [number, number | null]> = {
    "Up to 5": [0, 5],
    "10–100": [10, 100],
    "More than 100": [100, null],
  };

  const handleFilterChange = (state: FilterState) => {
    // Tag facets that map to real product tags on the backend.
    const tags = [
      ...(state.condition ?? []),
      ...(state.gender ?? []),
      ...(state.season ?? []),
      ...(state.promotions ?? []),
    ];

    const price = state.price ?? [];
    let minPrice = "";
    let maxPrice = "";
    if (price.length > 0) {
      const ranges = price.map((b) => PRICE_BUCKETS[b]).filter(Boolean) as [
        number,
        number | null,
      ][];
      minPrice = String(Math.min(...ranges.map((r) => r[0])));
      const hasOpenTop = ranges.some((r) => r[1] === null);
      maxPrice = hasOpenTop
        ? ""
        : String(Math.max(...ranges.map((r) => r[1] as number)));
    }

    applyFilters({ categoryId: "", minPrice, maxPrice, tags });
  };

  return (
    <div className="mx-auto max-w-379.5 px-6 py-12">
      <CatalogBanner />
      <div className="flex gap-8">
        <SidebarFilters onChange={handleFilterChange} />

        <div className="flex flex-1 flex-col gap-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5 text-xs font-medium text-foreground/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              {isLoading
                ? "Loading…"
                : search
                  ? `Results for “${search}” — page ${page} of ${totalPages}`
                  : `Page ${page} of ${totalPages}`}
            </span>
            <CatalogSort value={sort} onChange={applySort} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl bg-foreground/5"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-1 items-center justify-center py-24">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-24">
              <p className="text-foreground/40">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isOwner={myStoreId !== null && product.storeId === myStoreId}
                />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
