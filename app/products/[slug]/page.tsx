import { notFound } from "next/navigation";
import { findProduct } from "@/app/lib/pricing";
import OrderForm from "@/app/components/OrderForm";

// URL の [slug] 部分が params.slug に入る（/products/goma → "goma"）
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  return (
    <>
      <h1>{product.name}</h1>
      <p>税抜 {product.price.toLocaleString()} 円</p>
      <OrderForm slug={product.slug} />
    </>
  );
}
