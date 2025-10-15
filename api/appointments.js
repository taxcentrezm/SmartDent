// api/appointments.js
import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const db = getClient();

  if (req.method === 'GET') {
    const r = await db.execute('SELECT * FROM appointments ORDER BY start_time DESC LIMIT 200');
    return res.status(200).json({ data: r.rows.map(row => Object.fromEntries(row)) });
  }

  if (req.method === 'POST') {
    const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const id = body.id || crypto.randomUUID();
    await db.execute(
      `INSERT INTO appointments (id, patient_id, start_time, end_time, provider, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, body.patient_id, body.start_time, body.end_time || null, body.provider || null, body.status || 'scheduled', body.notes || null]
    );
    return res.status(201).json({ id });
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
}
