"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/entities/product";
import type { Store } from "@/entities/store";
import type { Category } from "@/entities/category";
import { fetchCategories } from "@/entities/category";
import { useSession } from "@/entities/session";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import {
  createProduct,
  updateProduct,
  deleteProduct,
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addError, setAddError] = useState<string>();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editError, setEditError] = useState<string>();

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
    fetchCategories().then(setCategories).catch(() => {});
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
      stock: values.stock,
      imageUrl: values.imageUrl,
      ...(values.rating !== undefined && { rating: values.rating }),
      ...(values.categoryId && { categoryId: values.categoryId }),
    };
    try {
      const product = await createProduct(payload, token);
      setProducts((prev) => [product, ...prev]);
      setIsAddOpen(false);
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Failed to add product");
    }
  };

  const handleEditProduct = async (values: ProductFormValues) => {
    if (!token || !editingProduct) return;
    setEditError(undefined);
    try {
      const updated = await updateProduct(editingProduct.id, values, token);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProduct(null);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Failed to update product");
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!token) return;
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id, token);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      // silently ignore — could add a toast here
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
        <Button onClick={() => setIsAddOpen(true)} variant="secondary">
          + Add product
        </Button>
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => { setIsAddOpen(false); setAddError(undefined); }}
        title="Add product"
      >
        <ProductForm
          categories={categories}
          onSubmit={handleAddProduct}
          onCancel={() => { setIsAddOpen(false); setAddError(undefined); }}
          error={addError}
        />
      </Modal>

      <Modal
        isOpen={!!editingProduct}
        onClose={() => { setEditingProduct(null); setEditError(undefined); }}
        title="Edit product"
      >
        {editingProduct && (
          <ProductForm
            categories={categories}
            defaultValues={{
              name: editingProduct.name,
              price: Number(editingProduct.price),
              stock: editingProduct.stock,
              rating: editingProduct.rating ?? undefined,
              imageUrl: editingProduct.imageUrl,
              categoryId: "",
            }}
            onSubmit={handleEditProduct}
            onCancel={() => { setEditingProduct(null); setEditError(undefined); }}
            error={editError}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      {isLoadingProducts ? (
        <p className="py-8 text-center text-sm text-foreground/50">
          Loading products…
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-foreground/20 py-16 text-center">
          <p className="text-foreground/40">No products yet.</p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="mt-2 text-sm font-semibold underline underline-offset-2 opacity-75 hover:opacity-100"
          >
            Add your first product
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isOwner
              onEdit={setEditingProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
