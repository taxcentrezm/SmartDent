// /api/_libsql.js
import { createClient } from "@libsql/client";
import { getConfig } from "./config.js";

let client;

export function getClient() {
  if (client) return client;

  const { TURSO_DB_URL, TURSO_DB_AUTH_TOKEN, isConfigured } = getConfig();

  if (!isConfigured) {
    console.warn("⚠️ Database credentials missing — using mock client.");
    return {
      execute: async () => ({ rows: [] }),
    };
  }

  client = createClient({
    url: TURSO_DB_URL,
    authToken: TURSO_DB_AUTH_TOKEN,
  });

  console.log("✅ Connected to Turso successfully.");
  return client;
}
