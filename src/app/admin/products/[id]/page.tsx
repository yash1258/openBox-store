import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Check if product belongs to this seller
  if (product.sellerId !== session.sellerId) {
    notFound();
  }

  return <ProductForm product={product} sellerId={session.sellerId} />;
}
