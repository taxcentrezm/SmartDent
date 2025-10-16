import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  const client = getClient();
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        birthdate TEXT,
        phone TEXT,
        email TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name TEXT,
        role TEXT,
        base_salary REAL,
        currency TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payroll (
        id TEXT PRIMARY KEY,
        employee_id TEXT,
        period_start DATE,
        period_end DATE,
        gross_amount REAL,
        tax_amount REAL,
        net_amount REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        start_time DATETIME,
        end_time DATETIME,
        provider TEXT,
        status TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.status(200).json({ message: "✅ Tables created successfully" });
  } catch (err) {
    console.error("MIGRATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
