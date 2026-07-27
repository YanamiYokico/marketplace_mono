"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { fetchFavorites, type Favorite } from "@/features/favorites";
import { ProductCard } from "@/features/products/ui/product-card";
import { Button } from "@/shared/ui";

export function FavoritesView() {
  const router = useRouter();
  const { token, hydrated } = useSession();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      setFavorites(await fetchFavorites(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/auth");
      return;
    }
    void load();
  }, [hydrated, token, router, load]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold">Favorites</h1>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-foreground/50">Loading favorites…</p>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-foreground/50">You have no favorites yet.</p>
          <Button onClick={() => router.push("/catalog")}>Browse catalog</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <ProductCard
              key={fav.id}
              product={{ ...fav.product, isFavorite: true }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
