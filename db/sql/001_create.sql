CREATE TABLE IF NOT EXISTS products (
  slug      TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  price     INTEGER NOT NULL CHECK (price >= 0),
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS coupons (
  code             TEXT PRIMARY KEY,
  label            TEXT NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 0 AND 100),
  is_active        INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  coupon_code  TEXT,
  subtotal     INTEGER NOT NULL,
  discount     INTEGER NOT NULL,
  tax          INTEGER NOT NULL,
  total        INTEGER NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INTEGER NOT NULL REFERENCES orders(id),
  product_slug TEXT NOT NULL REFERENCES products(slug),
  product_name TEXT NOT NULL,
  unit_price   INTEGER NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0)
);