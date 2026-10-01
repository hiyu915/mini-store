import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "ミニストア" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        style={{
          fontFamily: "sans-serif",
          maxWidth: 720,
          margin: "0 auto",
          padding: 16,
        }}
      >
        <header>
          <Link href="/">ミニストア</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
