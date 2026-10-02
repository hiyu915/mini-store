import { getDb } from "@/db";

// GET /api/orders/MINI-XXXX … 注文1件と明細を返す
export async function GET(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const db = getDb();
  const order = db.prepare("SELECT * FROM orders WHERE order_number = ?").get(orderNumber) as
    { id: number } | undefined;
  if (!order) {
    return Response.json({ ok: false, message: "注文が見つかりません。" }, { status: 404 });
  }
  const items = db.prepare("SELECT product_name, unit_price, quantity FROM order_items WHERE order_id = ?").all(order.id);
  return Response.json({ ok: true, order, items });
}