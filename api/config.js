// /api/config.js
export function getConfig() {
  const TURSO_DB_URL = process.env.TURSO_DB_URL;
  const TURSO_DB_AUTH_TOKEN = process.env.TURSO_DB_AUTH_TOKEN;

  if (!TURSO_DB_URL) {
    console.error(
      "⚠️  TURSO_DB_URL is missing. Please add it in your Vercel project settings under Environment Variables."
    );
  }

  if (!TURSO_DB_AUTH_TOKEN) {
    console.error(
      "⚠️  TURSO_DB_AUTH_TOKEN is missing. Please add it in your Vercel project settings under Environment Variables."
    );
  }

  return {
    TURSO_DB_URL,
    TURSO_DB_AUTH_TOKEN,
    isConfigured: Boolean(TURSO_DB_URL && TURSO_DB_AUTH_TOKEN),
  };
}
