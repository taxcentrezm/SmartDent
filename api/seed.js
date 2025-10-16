import { getClient } from "./_libsql.js";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  const client = getClient();
  try {
    await client.execute(`
      INSERT INTO employees (id, name, role, base_salary, currency)
      VALUES
        ('${randomUUID()}', 'Dr. Banda', 'Dentist', 18000, 'ZMW'),
        ('${randomUUID()}', 'Mary Zulu', 'Receptionist', 8500, 'ZMW');

      INSERT INTO patients (id, first_name, last_name, phone, email, notes)
      VALUES
        ('${randomUUID()}', 'John', 'Phiri', '0977123456', 'john@example.com', 'Routine checkup'),
        ('${randomUUID()}', 'Agnes', 'Mwila', '0977890123', 'agnes@example.com', 'Cleaning');
    `);
    res.status(200).json({ message: "✅ Seed data inserted successfully" });
  } catch (err) {
    console.error("SEED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
