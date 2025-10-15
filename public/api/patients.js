// api/patients.js
import { json } from '@vercel/node'; // not required; Vercel accepts plain exports
import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const db = getClient();

  if (req.method === 'GET') {
    try {
      const r = await db.execute('SELECT id, first_name, last_name, phone, email, created_at FROM patients ORDER BY created_at DESC LIMIT 100');
      // r.rows is array of rows; transform to JS objects
      const rows = r.rows.map(row => Object.fromEntries(row));
      return res.status(200).json({ data: rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const id = body.id || crypto.randomUUID();
      await db.execute(
        `INSERT INTO patients (id, first_name, last_name, birthdate, phone, email, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, body.first_name, body.last_name, body.birthdate || null, body.phone || null, body.email || null, body.notes || null]
      );
      return res.status(201).json({ id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
}
