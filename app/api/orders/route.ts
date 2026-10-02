import { z } from "zod";
import { getDb } from "@/db";
import { calcTotals, findProduct, findValidCoupon } from "@/app/lib/pricing";

// ① 受け取るデータの形を決める（ここに合わないリクエストは 400 で弾く）
const orderSchema = z.object({
  items: z.array(z.object({ slug: z.string(), quantity: z.number().int().min(1).max(99) })).min(1),
  couponCode: z.string().max(50).optional(),
  customer: z.object({ name: z.string().min(1), email: z.email() }),
});

// POST /api/orders … 注文を登録する
export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, message: "入力内容を確認してください。" }, { status: 400 });
  }
  const { items, couponCode, customer } = parsed.data;

  // ② 価格は必ずDBから取る（ブラウザから来た金額は信用しない）
  const lines = [];
  for (const item of items) {
    const p = findProduct(item.slug);
    if (!p) return Response.json({ ok: false, message: "販売していない商品が含まれています。" }, { status: 400 });
    lines.push({ productSlug: p.slug, productName: p.name, unitPrice: p.price, quantity: item.quantity });
  }

  const coupon = couponCode ? findValidCoupon(couponCode) : null;
  if (couponCode && !coupon) {
    return Response.json({ ok: false, message: "クーポンが無効です。" }, { status: 400 });
  }

  // ③ 金額を計算
  const totals = calcTotals(lines, coupon?.discountPercent ?? 0);
  const orderNumber = `MINI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  // ④ 注文ヘッダーと明細をまとめて保存（途中で失敗したら全部取り消す＝トランザクション）
  const db = getDb();
  db.exec("BEGIN");
  try {
    const result = db
      .prepare(`INSERT INTO orders (order_number, name, email, coupon_code, subtotal, discount, tax, total)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(orderNumber, customer.name, customer.email, coupon?.code ?? null,
        totals.subtotal, totals.discount, totals.tax, totals.total);
    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_slug, product_name, unit_price, quantity) VALUES (?, ?, ?, ?, ?)`,
    );
    for (const l of lines) insertItem.run(result.lastInsertRowid, l.productSlug, l.productName, l.unitPrice, l.quantity);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }

  // ⑤ 結果を返す
  return Response.json({ ok: true, orderNumber, ...totals }, { status: 201 });
}