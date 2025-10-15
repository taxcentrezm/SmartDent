// api/migrate.js
import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  // simple token check
  if (req.headers['x-migrate-token'] !== process.env.MIGRATE_TOKEN) return res.status(403).json({ error: 'forbidden' });

  const db = getClient();
  const sql = `...` // copy the SQL from schema above
  try {
    await db.execute(sql);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
