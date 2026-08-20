import { ProductDetailView } from "@/views/product";

export const metadata = { title: "Product" };

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailView productId={id} />;
}
