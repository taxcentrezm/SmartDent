
import { Client } from '@libsql/client';

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
