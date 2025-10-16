import { createClient } from "@libsql/client";

export function getClient() {
  const url = process.env.TURSO_DB_URL || process.env.smartdent_TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.smartdent_TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("❌ Turso configuration missing. Please set TURSO_DB_URL and TURSO_AUTH_TOKEN in your environment.");
    throw new Error("TURSO environment variables missing");
  }

  console.log(`✅ Connected to Turso at ${url}`);
  return createClient({ url, authToken });
}
