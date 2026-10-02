"use client"; // ← ブラウザで動く部品（useState や onClick を使うときに必要）

import { useState } from "react";

type Result = { ok: boolean; message?: string; orderNumber?: string; total?: number };

export default function OrderForm({ slug }: { slug: string }) {
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const submit = async () => {
    // API を呼ぶ（goma-order2 の GomaOrderPage.tsx と同じやり方）
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ slug, quantity }],
        couponCode: couponCode || undefined,
        customer: { name, email },
      }),
    });
    setResult(await res.json());
  };

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 320 }}>
      <label>数量 <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></label>
      <label>クーポン <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} /></label>
      <label>お名前 <input value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>メール <input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <button onClick={submit}>注文する</button>
      {result && (result.ok
        ? <p>注文番号 {result.orderNumber}（合計 {result.total?.toLocaleString()} 円）</p>
        : <p style={{ color: "crimson" }}>{result.message}</p>)}
    </div>
  );
}