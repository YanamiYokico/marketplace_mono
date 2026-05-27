import type { Category } from "@/entities/category";
import { CatalogFiltersPanel } from "@/features/catalog";
import type { CatalogFilters } from "@/features/catalog";

type CatalogSidebarProps = {
  categories: Category[];
  filters: CatalogFilters;
  onApply: (filters: CatalogFilters) => void;
};

export function CatalogSidebar({ categories, filters, onApply }: CatalogSidebarProps) {
  return (
    <aside className="w-60 shrink-0 rounded-xl border border-foreground/10 bg-background p-5">
      <CatalogFiltersPanel
        categories={categories}
        filters={filters}
        onApply={onApply}
      />
    </aside>
  );
}
