import { listProducts } from "@/app/lib/pricing";

// GET /api/products … 商品一覧を返す
export async function GET() {
  return Response.json({ ok: true, products: listProducts() });
}