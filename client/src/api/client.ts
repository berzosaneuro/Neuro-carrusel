const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status);
  }
  return data as T;
}

export const api = {
  createAnonymousSession: () =>
    request<{ token: string; user: import('../types').User }>('/auth/anonymous', {
      method: 'POST',
    }),
  me: (token: string) =>
    request<{ user: import('../types').User }>('/auth/me', { token }),
  getCourse: (token: string) =>
    request<{ levels: import('../types').Level[]; units: import('../types').UnitStatus[] }>(
      '/course',
      { token }
    ),
  getUnit: (token: string, unitId: string) =>
    request<{ unit: import('../types').Unit; status: import('../types').UnitStatus }>(
      `/course/units/${unitId}`,
      { token }
    ),
  completeUnit: (token: string, unitId: string, score: number, totalQuestions: number) =>
    request<{
      passed: boolean;
      bestScore: number;
      attempts: number;
      streak: { current: number; best: number };
      units: import('../types').UnitStatus[];
    }>('/progress/complete', {
      method: 'POST',
      token,
      body: { unitId, score, totalQuestions },
    }),
};
