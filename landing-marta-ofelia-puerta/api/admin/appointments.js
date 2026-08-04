const { sql, ensureSchema } = require('../_lib/db');
const { isAuthenticated } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  await ensureSchema();

  if (req.method === 'GET') {
    try {
      const { rows } = await sql`
        SELECT a.id, a.name, a.contact, a.notes, a.status, a.created_at,
               s.start_at, s.end_at
        FROM appointments a
        JOIN availability_slots s ON s.id = a.slot_id
        ORDER BY s.start_at DESC
        LIMIT 200
      `;
      res.status(200).json({ appointments: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al cargar las citas' });
    }
    return;
  }

  if (req.method === 'DELETE') {
    const id = req.query.id;
    if (!id) {
      res.status(400).json({ error: 'Falta el id' });
      return;
    }
    try {
      const { rows } = await sql`
        UPDATE appointments SET status = 'cancelled'
        WHERE id = ${id} AND status = 'confirmed'
        RETURNING slot_id
      `;
      if (rows.length > 0) {
        await sql`UPDATE availability_slots SET is_booked = false WHERE id = ${rows[0].slot_id}`;
      }
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al cancelar la cita' });
    }
    return;
  }

  res.status(405).json({ error: 'Método no permitido' });
};
