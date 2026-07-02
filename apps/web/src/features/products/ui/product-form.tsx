"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import type { Category } from "@/entities/category";
import { PRODUCT_TAG_GROUPS } from "@/entities/product";
import { productSchema, type ProductFormValues } from "../model/product-schema";

type ProductFormProps = {
  categories: Category[];
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
  error?: string;
  defaultValues?: Partial<ProductFormValues>;
  submitLabel?: string;
};

export function ProductForm({ categories, onSubmit, onCancel, error, defaultValues, submitLabel = "Add product" }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: 0, stock: 0, rating: undefined, imageUrl: "", categoryId: "", tags: [], ...defaultValues },
  });

  const selectedTags = watch("tags") ?? [];
  const toggleTag = (value: string) => {
    setValue(
      "tags",
      selectedTags.includes(value)
        ? selectedTags.filter((t) => t !== value)
        : [...selectedTags, value],
      { shouldDirty: true },
    );
  };

  const handleValidSubmit = async (values: ProductFormValues) => {
    try {
      await onSubmit(values);
      reset();
    } catch {
      // error displayed via error prop from parent
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <form
      className="mt-6 flex flex-col gap-4"
      onSubmit={handleSubmit(handleValidSubmit)}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          placeholder="Product name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Price ($)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
        <Input
          label="Stock"
          type="number"
          step="1"
          min="0"
          placeholder="0"
          error={errors.stock?.message}
          {...register("stock", { valueAsNumber: true })}
        />
        <Input
          label="Rating (0–5, optional)"
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="e.g. 4.5"
          error={errors.rating?.message}
          {...register("rating", {
            setValueAs: (v: string) =>
              v === "" ? undefined : parseFloat(v),
          })}
        />
        <Input
          label="Image URL"
          type="url"
          placeholder="https://example.com/image.jpg"
          error={errors.imageUrl?.message}
          {...register("imageUrl")}
        />
        <Select
          label="Category (optional)"
          placeholder="— No category —"
          options={categoryOptions}
          error={errors.categoryId?.message}
          {...register("categoryId")}
        />
      </div>
      <div className="flex flex-col gap-4">
        {PRODUCT_TAG_GROUPS.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            <p className="text-sm font-medium opacity-85">{group.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {group.options.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(option)}
                    onChange={() => toggleTag(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
