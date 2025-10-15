export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=USD');
    const data = await response.json();
    if (!data || !data.rates) throw new Error('No rates returned');
    res.status(200).json(data.rates);
  } catch (err) {
    // fallback sample rates
    res.status(200).json({ USD:1, ZMW:24.5, EUR:0.92, GBP:0.78, ZAR:18.2 });
  }
}
