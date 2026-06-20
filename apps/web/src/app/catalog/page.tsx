import { Suspense } from "react";
import { CatalogView } from "@/views/catalog/ui/catalog-view";

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogView />
    </Suspense>
  );
}
