import { Suspense } from "react";
import { OrdersView } from "@/views/orders";

export const metadata = { title: "My orders" };

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersView />
    </Suspense>
  );
}
