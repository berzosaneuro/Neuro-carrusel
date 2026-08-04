import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { signToken, requireAuth } from './auth-middleware.js';

export const authRouter = Router();

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    currentStreak: user.current_streak,
    bestStreak: user.best_streak,
  };
}

// No login screen: each new visitor silently gets an anonymous account so
// progress can still be saved server-side, keyed by the token in localStorage.
authRouter.post('/anonymous', async (req, res) => {
  const id = crypto.randomUUID();
  const email = `anon-${id}@device.local`;
  const passwordHash = await bcrypt.hash(id, 10);

  const info = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run('Alumno', email, passwordHash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  const token = signToken(user.id);
  res.status(201).json({ token, user: publicUser(user) });
});

authRouter.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ user: publicUser(user) });
});
