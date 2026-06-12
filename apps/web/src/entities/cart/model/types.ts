export type CartProduct = {
  id: string;
  name: string;
  price: number | string;
  imageUrl: string;
  stock: number;
  storeId: string;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: CartProduct;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};
