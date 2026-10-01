import Link from "next/link";
import { listProducts } from "@/app/lib/pricing";

// サーバーコンポーネントなので、DBを直接読んでよい（ブラウザにはHTMLだけが届く）
export const dynamic = "force-dynamic";

export default function Home() {
  const products = listProducts();
  return (
    <>
      <h1>商品一覧</h1>
      <ul>
        {products.map((p) => (
          <li key={p.slug}>
            <Link href={`/products/${p.slug}`}>
              {p.name}
            </Link>
            （税抜 {p.price.toLocaleString()} 円）
          </li>
        ))}
      </ul>
    </>
  );
}
