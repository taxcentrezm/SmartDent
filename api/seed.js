// api/seed.js
import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const db = getClient();
  if (req.headers['x-seed-key'] !== process.env.SEED_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await db.batch([
      db.execute("DELETE FROM patients"),
      db.execute("DELETE FROM appointments"),
      db.execute("DELETE FROM employees"),
      db.execute("DELETE FROM payroll"),
      db.execute("DELETE FROM inventory"),
    ]);

    await db.batch([
      db.execute(`INSERT INTO patients (id, first_name, last_name) VALUES ('p1','Chileshe','Mwape'),('p2','Tandiwe','Phiri')`),
      db.execute(`INSERT INTO employees (id,name,role,base_salary) VALUES ('e1','Dr. Zulu','Dentist',20000)`),
      // ... add more inserts if you like
    ]);

    res.status(200).json({ message: 'Smartdent database seeded ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
