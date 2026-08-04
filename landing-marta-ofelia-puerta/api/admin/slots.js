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
        SELECT id, start_at, end_at, is_booked
        FROM availability_slots
        WHERE start_at > now()
        ORDER BY start_at ASC
        LIMIT 200
      `;
      res.status(200).json({ slots: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al cargar los horarios' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { startAt, endAt } = req.body || {};
      if (!startAt || !endAt) {
        res.status(400).json({ error: 'Faltan startAt/endAt' });
        return;
      }
      await sql`INSERT INTO availability_slots (start_at, end_at) VALUES (${startAt}, ${endAt})`;
      res.status(201).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el horario' });
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
      await sql`DELETE FROM availability_slots WHERE id = ${id} AND is_booked = false`;
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar el horario' });
    }
    return;
  }

  res.status(405).json({ error: 'Método no permitido' });
};
