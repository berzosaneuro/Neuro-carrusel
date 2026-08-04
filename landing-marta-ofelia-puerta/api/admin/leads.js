const { sql, ensureSchema } = require('../_lib/db');
const { isAuthenticated } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  try {
    await ensureSchema();
    const { rows } = await sql`
      SELECT id, name, contact, message, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 200
    `;
    res.status(200).json({ leads: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar los mensajes' });
  }
};
