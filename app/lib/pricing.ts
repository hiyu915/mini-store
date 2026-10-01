import "server-only";
import { getDb } from "@/db";

export const TAX_RATE = 0.1;

export type Product = { slug: string; name: string; price: number };
export type Coupon = { code: string; label: string; discountPercent: number };

export function listProducts(): Product[] {
  return getDb()
    .prepare("SELECT slug, name, price FROM products WHERE is_active = 1 ORDER BY price DESC")
    .all() as Product[];
}

export function findProduct(slug: string): Product | null {
  const row = getDb()
    .prepare("SELECT slug, name, price FROM products WHERE slug = ? AND is_active = 1")
    .get(slug);
  return (row as Product | undefined) ?? null;
}

export function findValidCoupon(code: string): Coupon | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const row = getDb()
    .prepare("SELECT code, label, discount_percent AS discountPercent FROM coupons WHERE code = ? AND is_active = 1")
    .get(normalized);
  return (row as Coupon | undefined) ?? null;
}

export function calcTotals(lines: { unitPrice: number; quantity: number }[], discountPercent: number) {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const discount = Math.floor((subtotal * discountPercent) / 100);
  const taxable = subtotal - discount;
  const tax = Math.floor(taxable * TAX_RATE);
  return { subtotal, discount, tax, total: taxable + tax };
}