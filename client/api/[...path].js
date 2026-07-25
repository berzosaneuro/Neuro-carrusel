if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'demo-insecure-secret-change-me';
}

import express from 'express';
import cors from 'cors';
import './_lib/db.js';
import { authRouter } from './_lib/auth-routes.js';
import { courseRouter } from './_lib/course-routes.js';
import { progressRouter } from './_lib/progress-routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/course', courseRouter);
app.use('/api/progress', progressRouter);

export default app;
