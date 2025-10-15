// api/_libsql.js
import { createClient } from '@libsql/client';

if (!process.env.TURSO_DB_URL) {
  throw new Error('TURSO_DB_URL is not set');
}

export const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN || '', // optional if you have auth
});
