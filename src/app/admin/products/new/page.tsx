import ProductForm from "@/components/ProductForm";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function NewProductPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <ProductForm sellerId={session.sellerId} />;
}
