import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  stock: z.number().int("Stock must be a whole number").min(0, "Stock must be 0 or more"),
  rating: z.number().min(0).max(5).optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  categoryId: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
