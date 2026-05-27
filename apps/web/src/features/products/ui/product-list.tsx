"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/entities/product";
import type { Store } from "@/entities/store";
import { useSession } from "@/entities/session";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  createProduct,
  fetchProductsByStore,
  type CreateProductPayload,
} from "../api/products-api";
import { createStore, fetchMyStore } from "../api/store-api";
import { ProductCard } from "./product-card";
import { ProductForm } from "./product-form";
import type { ProductFormValues } from "../model/product-schema";

type StoreState = Store | null | "loading" | "error";

export function ProductList() {
  const { token } = useSession();

  const [storeState, setStoreState] = useState<StoreState>("loading");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addError, setAddError] = useState<string>();

  const [storeName, setStoreName] = useState("");
  const [storeNameError, setStoreNameError] = useState<string>();
  const [isCreatingStore, setIsCreatingStore] = useState(false);

  const loadProducts = useCallback(async (store: Store) => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchProductsByStore(store.id);
      setProducts(data);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchMyStore(token)
      .then((store) => {
        setStoreState(store);
        if (store) loadProducts(store);
      })
      .catch(() => setStoreState("error"));
  }, [token, loadProducts]);

  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      setStoreNameError("Store name is required");
      return;
    }
    if (!token) return;
    setIsCreatingStore(true);
    setStoreNameError(undefined);
    try {
      const store = await createStore(storeName.trim(), token);
      setStoreState(store);
      setProducts([]);
    } catch (e) {
      setStoreNameError(e instanceof Error ? e.message : "Failed to create store");
    } finally {
      setIsCreatingStore(false);
    }
  };

  const handleAddProduct = async (values: ProductFormValues) => {
    if (!token) return;
    setAddError(undefined);
    const payload: CreateProductPayload = {
      name: values.name,
      price: values.price,
      imageUrl: values.imageUrl,
      ...(values.rating !== undefined && { rating: values.rating }),
    };
    try {
      const product = await createProduct(payload, token);
      setProducts((prev) => [product, ...prev]);
      setIsAddOpen(false);
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Failed to add product");
    }
  };

  if (storeState === "loading") {
    return (
      <p className="py-8 text-center text-sm text-foreground/50">Loading…</p>
    );
  }

  if (storeState === "error") {
    return (
      <p className="py-8 text-center text-sm text-red-500">
        Failed to load store data.
      </p>
    );
  }

  if (storeState === null) {
    return (
      <div className="rounded-xl border border-foreground/10 bg-background p-6">
        <p className="font-semibold">You don&apos;t have a store yet</p>
        <p className="mt-1 text-sm text-foreground/60">
          Create a store to start adding products.
        </p>
        <div className="mt-4 flex items-end gap-3">
          <div className="w-full max-w-xs">
            <Input
              label="Store name"
              placeholder="My awesome store"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              error={storeNameError}
            />
          </div>
          <Button onClick={handleCreateStore} disabled={isCreatingStore}>
            {isCreatingStore ? "Creating…" : "Create store"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Products</h2>
          <p className="text-sm text-foreground/50">{storeState.name}</p>
        </div>
        {!isAddOpen && (
          <Button onClick={() => setIsAddOpen(true)} variant="secondary">
            + Add product
          </Button>
        )}
      </div>

      {isAddOpen && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => {
            setIsAddOpen(false);
            setAddError(undefined);
          }}
          error={addError}
        />
      )}

      {isLoadingProducts ? (
        <p className="py-8 text-center text-sm text-foreground/50">
          Loading products…
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-foreground/20 py-16 text-center">
          <p className="text-foreground/40">No products yet.</p>
          {!isAddOpen && (
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="mt-2 text-sm font-semibold underline underline-offset-2 opacity-75 hover:opacity-100"
            >
              Add your first product
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
