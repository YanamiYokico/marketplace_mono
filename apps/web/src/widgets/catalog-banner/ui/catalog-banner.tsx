"use client";

import { Image } from "@/shared/ui";

export function CatalogBanner() {
  return (
    <section className="mb-8">
      <div className="overflow-hidden rounded-2xl">
        <Image
          src="/images/dashboard/banner.png"
          alt="Catalog banner"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
