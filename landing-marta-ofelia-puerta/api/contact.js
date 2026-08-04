const { sql, ensureSchema } = require('./_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  try {
    const { name, contact, message } = req.body || {};
    if (!name || !contact) {
      res.status(400).json({ error: 'Nombre y datos de contacto son obligatorios' });
      return;
    }
    await ensureSchema();
    await sql`INSERT INTO leads (name, contact, message) VALUES (${name}, ${contact}, ${message || null})`;
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
};
