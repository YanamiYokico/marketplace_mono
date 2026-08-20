"use client";

import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/entities/cart";
import { useSession } from "@/entities/session";
import type { Product } from "@/entities/product";
import { FavoriteButton } from "@/features/favorites";
import {
  fetchAllProducts,
  fetchProductById,
} from "@/features/products/api/products-api";
import { ProductCarousel } from "@/widgets/product-carousel";
import { Image } from "@/shared/ui";
import { useRouter } from "next/navigation";

type ProductDetailViewProps = {
  productId: string;
};

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const router = useRouter();
  const { token } = useSession();
  const { addItem, isMutating } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [related, setRelated] = useState<Product[]>([]);
  const [alsoBuy, setAlsoBuy] = useState<Product[]>([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);

  // Main product
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    fetchProductById(productId)
      .then((p) => {
        if (active) setProduct(p);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "Product not found");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  // Recommendations: same category first, then generally popular.
  // (There is no dedicated recommendations endpoint yet — this is derived from the catalog.)
  useEffect(() => {
    if (!product) return;
    let active = true;
    setIsRelatedLoading(true);

    const exclude = (list: Product[]) =>
      list.filter((p) => p.id !== product.id).slice(0, 8);

    Promise.all([
      fetchAllProducts(
        product.categoryId
          ? { categoryId: product.categoryId, limit: 10 }
          : { limit: 10 },
      ),
      fetchAllProducts({ sortBy: "rating", sortOrder: "desc", limit: 10 }),
    ])
      .then(([sameCategory, popular]) => {
        if (!active) return;
        setRelated(exclude(sameCategory.data));
        setAlsoBuy(exclude(popular.data));
      })
      .catch(() => {
        if (active) {
          setRelated([]);
          setAlsoBuy([]);
        }
      })
      .finally(() => {
        if (active) setIsRelatedLoading(false);
      });

    return () => {
      active = false;
    };
  }, [product]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    if (!token) {
      router.push("/auth");
      return;
    }
    await addItem(product.id, quantity);
  }, [product, token, quantity, addItem, router]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm text-foreground/50">Loading product…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm text-red-500">{error ?? "Product not found"}</p>
      </main>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 font-[family-name:var(--font-poppins)]">
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Image */}
        <div className="relative shrink-0 lg:w-[520px]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full rounded-3xl bg-black/[0.04] object-cover"
          />
          <FavoriteButton
            productId={product.id}
            initialFavorite={product.isFavorite}
            className="absolute bottom-4 right-4"
          />
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col">
          <h1 className="text-[40px] font-normal leading-tight">{product.name}</h1>

          {product.shortDescription && (
            <p className="mt-2 text-[15px] text-foreground/70">
              {product.shortDescription}
            </p>
          )}

          {product.brand && (
            <p className="mt-1 text-[15px] text-foreground/60">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          )}

          {product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#C5DD98] px-5 py-2 text-sm text-black/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-foreground/80">
              {product.description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-4 text-sm text-foreground/60">
            <span>
              {outOfStock ? (
                <span className="text-red-500">Out of stock</span>
              ) : (
                <>In stock: {product.stock}</>
              )}
            </span>
            {product.sku && <span>SKU: {product.sku}</span>}
          </div>

          {/* Quantity + add to cart */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 rounded-full bg-[#C5DD98] px-5 py-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="text-xl leading-none text-black/70 disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-6 text-center text-lg tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock || 1, q + 1))
                }
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
                className="text-xl leading-none text-black/70 disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock || isMutating}
              className="rounded-full bg-[#8BC53F] px-12 py-3.5 text-lg font-medium text-black transition hover:bg-[#7CB332] disabled:opacity-50"
            >
              {outOfStock
                ? "Unavailable"
                : `${(Number(product.price) * quantity).toFixed(2)} $`}
            </button>
          </div>
        </div>
      </div>

      <ProductCarousel
        title="You might also like"
        products={related}
        isLoading={isRelatedLoading}
      />
      <ProductCarousel
        title="People also buy these items"
        products={alsoBuy}
        isLoading={isRelatedLoading}
      />
    </main>
  );
}
