// seed.js
import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  const client = getClient();

  try {
    await client.execute(`
      INSERT INTO patients (name, note, date, status)
      VALUES
        ('John Banda', 'Root Canal', '2025-10-10', 'Paid'),
        ('Mary Mwila', 'Cleaning', '2025-10-09', 'Pending'),
        ('Peter Tembo', 'Crown Fitting', '2025-10-07', 'Overdue');
    `);

    await client.execute(`
      INSERT INTO payroll (name, role, baseSalary)
      VALUES
        ('Dr. Phiri', 'Dentist', 12000),
        ('L. Zulu', 'Assistant', 5500),
        ('K. Banda', 'Receptionist', 4200);
    `);

    await client.execute(`
      INSERT INTO revenue (month, revenue)
      VALUES
        ('Jan', 23000),
        ('Feb', 26500),
        ('Mar', 29800),
        ('Apr', 31000),
        ('May', 33400);
    `);

    await client.execute(`
      INSERT INTO services (service, count)
      VALUES
        ('Fillings', 45),
        ('Cleanings', 70),
        ('Root Canals', 22),
        ('Implants', 15),
        ('Crowns', 18);
    `);

    await client.execute(`
      INSERT INTO appointments (patient_name, appointment_date, treatment, status)
      VALUES
        ('John Banda', '2025-10-20', 'Follow-up', 'Confirmed'),
        ('Mary Mwila', '2025-10-21', 'Whitening', 'Pending'),
        ('Peter Tembo', '2025-10-22', 'Check-up', 'Cancelled');
    `);

    res.status(200).json({ success: true, message: "Sample data inserted successfully." });
  } catch (err) {
    console.error("SEED ERROR:", err);
    res.status(500).json({ error: "Failed to seed database", details: err.message });
  }
}
