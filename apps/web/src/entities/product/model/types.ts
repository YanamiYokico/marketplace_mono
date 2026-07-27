export type Product = {
  id: string;
  name: string;
  price: number;
  rating: number | null;
  stock: number;
  tags: string[];
  imageUrl: string;
  storeId: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
};
