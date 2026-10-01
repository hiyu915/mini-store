import { z } from "zod";
import { findValidCoupon } from "@/app/lib/pricing";

const bodySchema = z.object({ code: z.string().max(50) });

// POST /api/coupons/validate … { code } を受け取り、使えるクーポンなら内容を返す
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, message: "入力内容が正しくありません。" }, { status: 400 });
  }
  const coupon = findValidCoupon(parsed.data.code);
  if (!coupon) {
    return Response.json({ ok: false, message: "クーポンコードを確認できませんでした。" }, { status: 404 });
  }
  return Response.json({ ok: true, ...coupon });
}