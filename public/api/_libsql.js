// api/_libsql.js
import { createClient } from "@libsql/client";

export function getClient() {
  // Vercel will expose env vars as process.env
  const url = process.env.TURSO_DB_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error("TURSO_DB_URL is not set");
  return createClient({
    url,
    // some deployments require authToken; others use public URLs
    authToken,
  });
}
