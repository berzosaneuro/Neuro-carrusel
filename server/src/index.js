import 'dotenv/config';

if (!process.env.JWT_SECRET) {
  console.warn(
    '[warn] JWT_SECRET not set in environment, using an insecure default for local development only.'
  );
  process.env.JWT_SECRET = 'dev-only-insecure-secret-change-me';
}

import express from 'express';
import cors from 'cors';
import './db/init.js';
import { authRouter } from './routes/auth.js';
import { courseRouter } from './routes/course.js';
import { progressRouter } from './routes/progress.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/course', courseRouter);
app.use('/api/progress', progressRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`English app server listening on http://localhost:${PORT}`);
});
