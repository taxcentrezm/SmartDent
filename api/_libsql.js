// api/_libsql.js
import { Client } from '@libsql/client';

/**
 * Returns a Turso SQL client connected via environment variables.
 * Make sure TURSO_DB_URL (and optionally TURSO_DB_AUTH_TOKEN) are set in Vercel.
 */
export function getClient() {
  const url = process.env.TURSO_DB_URL;
  const authToken = process.env.TURSO_DB_AUTH_TOKEN; // optional

  if (!url) {
    throw new Error('TURSO_DB_URL environment variable is not set');
  }

  return new Client({
    url,
    authToken
  });
}
