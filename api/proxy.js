export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { dataset, data_id, start_date, end_date } = req.query;
  const token = process.env.FINMIND_TOKEN;

  if (!dataset || !data_id) {
    return res.status(400).json({ error: "缺少參數" });
  }

  const params = new URLSearchParams({
    dataset,
    data_id,
    start_date,
    end_date: end_date || new Date().toISOString().slice(0, 10),
  });

  try {
    const response = await fetch(
      `https://api.finmindtrade.com/api/v4/data?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
