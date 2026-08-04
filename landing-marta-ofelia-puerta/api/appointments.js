const { sql, ensureSchema } = require('./_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  try {
    const { slotId, name, contact, notes } = req.body || {};
    if (!slotId || !name || !contact) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }
    await ensureSchema();

    const { rows } = await sql`
      UPDATE availability_slots
      SET is_booked = true
      WHERE id = ${slotId} AND is_booked = false
      RETURNING id
    `;
    if (rows.length === 0) {
      res.status(409).json({ error: 'Ese horario ya no está disponible' });
      return;
    }
    await sql`
      INSERT INTO appointments (slot_id, name, contact, notes)
      VALUES (${slotId}, ${name}, ${contact}, ${notes || null})
    `;
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agendar la cita' });
  }
};
