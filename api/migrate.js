// api/migrate.js
import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  // simple token check
  if (req.headers['x-migrate-token'] !== process.env.MIGRATE_TOKEN) return res.status(403).json({ error: 'forbidden' });

  const db = getClient();
  const sql = `CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  birthdate TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES patients(id),
  start_time DATETIME,
  end_time DATETIME,
  provider TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT,
  role TEXT,
  base_salary REAL,
  currency TEXT DEFAULT 'USD'
);

CREATE TABLE IF NOT EXISTS payroll (
  id TEXT PRIMARY KEY,
  employee_id TEXT REFERENCES employees(id),
  period_start DATE,
  period_end DATE,
  gross_amount REAL,
  tax_amount REAL,
  net_amount REAL
);

CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  name TEXT,
  quantity INTEGER,
  reorder_level INTEGER,
  cost REAL
);

` 
  try {
    await db.execute(sql);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
