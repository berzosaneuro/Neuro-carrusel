const { sql } = require('@vercel/postgres');

let schemaReady;

async function ensureSchema() {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        contact TEXT NOT NULL,
        message TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS availability_slots (
        id SERIAL PRIMARY KEY,
        start_at TIMESTAMPTZ NOT NULL,
        end_at TIMESTAMPTZ NOT NULL,
        is_booked BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        slot_id INTEGER NOT NULL REFERENCES availability_slots(id),
        name TEXT NOT NULL,
        contact TEXT NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'confirmed',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;
  })();
  return schemaReady;
}

module.exports = { sql, ensureSchema };
