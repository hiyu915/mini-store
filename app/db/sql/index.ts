import "server-only";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import path from "node:path";

// 練習用のダミーDB。プロジェクト直下に mini-store.db というファイルができる。
// （goma-order2 ではここが mssql で Azure SQL に接続している）
const g = globalThis as unknown as { db?: DatabaseSync };

export function getDb() {
  if (!g.db) {
    const db = new DatabaseSync(path.join(process.cwd(), "mini-store.db"));
    // 初回起動時にテーブル作成と初期データ投入（IF NOT EXISTS / OR IGNORE なので何度実行しても安全）
    for (const file of ["001_create.sql", "002_seed.sql"]) {
      db.exec(readFileSync(path.join(process.cwd(), "db/sql", file), "utf8"));
    }
    g.db = db;
  }
  return g.db;
}