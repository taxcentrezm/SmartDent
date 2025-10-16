// rates.js
export default async function handler(req, res) {
  try {
    // Replace this with a real currency API later
    const rates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.78,
      ZMW: 25.4,
      ZAR: 18.2,
    };

    res.status(200).json(rates);
  } catch (err) {
    console.error("RATES API ERROR:", err);
    res.status(500).json({ error: "Failed to fetch exchange rates", details: err.message });
  }
}
