// migrate.js
import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  const client = getClient();

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        note TEXT,
        date TEXT,
        status TEXT
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS payroll (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT,
        baseSalary REAL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS revenue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT,
        revenue REAL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service TEXT,
        count INTEGER
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT,
        appointment_date TEXT,
        treatment TEXT,
        status TEXT
      );
    `);

    res.status(200).json({ success: true, message: "Database migration complete." });
  } catch (err) {
    console.error("MIGRATION ERROR:", err);
    res.status(500).json({ error: "Migration failed", details: err.message });
  }
}
