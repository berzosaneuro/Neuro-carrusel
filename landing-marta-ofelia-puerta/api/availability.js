const { sql, ensureSchema } = require('./_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  try {
    await ensureSchema();
    const { rows } = await sql`
      SELECT id, start_at, end_at
      FROM availability_slots
      WHERE is_booked = false AND start_at > now()
      ORDER BY start_at ASC
      LIMIT 100
    `;
    res.status(200).json({ slots: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar la disponibilidad' });
  }
};
