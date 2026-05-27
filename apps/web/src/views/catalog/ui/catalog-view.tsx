"use client";

import { ProductCard } from "@/features/products/ui/product-card";
import { useCatalog, CatalogSort } from "@/features/catalog";
import { CatalogSidebar } from "@/widgets/catalog-sidebar";
import { Pagination } from "@/shared/ui/pagination";

export function CatalogView() {
  const {
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
  } = useCatalog();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex gap-8">
        <CatalogSidebar
          categories={categories}
          filters={filters}
          onApply={applyFilters}
        />

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/50">
              {isLoading ? "Loading…" : `Page ${page} of ${totalPages}`}
            </p>
            <CatalogSort value={sort} onChange={applySort} />
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
