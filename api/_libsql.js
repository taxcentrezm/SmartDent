// _libsql.js
import { createClient } from "@libsql/client";

export function getClient() {
  const url = process.env.TURSO_DB_URL;
  const authToken = process.env.TURSO_DB_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DB_URL is not set. Please configure it in your environment variables.");
  }

  return createClient({
    url,
    authToken,
  });
}
