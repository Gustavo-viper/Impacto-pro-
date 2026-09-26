const express = require('express');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL || '';
const SYNC_TOKEN = process.env.IMPACTO_SYNC_TOKEN || '';

app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Impacto-Token');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

let sql = null;
function getSql() {
  if (!DATABASE_URL) throw new Error('DATABASE_URL não configurada');
  if (!sql) sql = neon(DATABASE_URL);
  return sql;
}

function authorized(req) {
  if (!SYNC_TOKEN) return true;
  return req.get('X-Impacto-Token') === SYNC_TOKEN;
}

async function ensureSchema() {
  const db = getSql();
  await db`CREATE TABLE IF NOT EXISTS impacto_app_state (
    state_key TEXT PRIMARY KEY,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await db`CREATE INDEX IF NOT EXISTS idx_impacto_app_state_updated_at ON impacto_app_state (updated_at)`;
  await db`INSERT INTO impacto_app_state (state_key, payload) VALUES ('main', '{}'::jsonb) ON CONFLICT (state_key) DO NOTHING`;
}

app.get('/api/health', async (req, res) => {
  try {
    await ensureSchema();
    res.json({ ok: true, database: 'neon', version: '51.0' });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Banco Neon indisponível ou não configurado.' });
  }
});

app.get('/api', async (req, res) => {
  if (!authorized(req)) return res.status(401).json({ ok: false, error: 'Não autorizado' });
  try {
    await ensureSchema();
    const db = getSql();
    const rows = await db`SELECT payload, EXTRACT(EPOCH FROM updated_at) * 1000 AS updated_ms FROM impacto_app_state WHERE state_key='main' LIMIT 1`;
    const row = rows[0];
    res.json({ ok: true, data: row?.payload || null, updatedAt: row ? Math.round(Number(row.updated_ms)) : 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Erro ao consultar o banco Neon.' });
  }
});

app.post('/api', async (req, res) => {
  if (!authorized(req)) return res.status(401).json({ ok: false, error: 'Não autorizado' });
  const data = req.body?.data;
  if (!data || typeof data !== 'object') return res.status(400).json({ ok: false, error: 'Payload inválido' });
  const clientUpdatedAt = Number(req.body?.updatedAt || Date.now());
  try {
    await ensureSchema();
    const db = getSql();
    const rows = await db`SELECT EXTRACT(EPOCH FROM updated_at) * 1000 AS updated_ms FROM impacto_app_state WHERE state_key='main' LIMIT 1`;
    const current = rows[0] ? Number(rows[0].updated_ms) : 0;
    if (clientUpdatedAt < current) {
      return res.json({ ok: true, updatedAt: Math.round(current), ignored: true, reason: 'remote-newer' });
    }
    await db`INSERT INTO impacto_app_state (state_key, payload, updated_at)
      VALUES ('main', ${JSON.stringify(data)}::jsonb, to_timestamp(${clientUpdatedAt}/1000.0))
      ON CONFLICT (state_key) DO UPDATE SET payload=EXCLUDED.payload, updated_at=EXCLUDED.updated_at`;
    res.json({ ok: true, updatedAt: clientUpdatedAt });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Erro ao salvar no banco Neon.' });
  }
});

app.use(express.static(path.join(__dirname)));
app.use((req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Impacto Pro V51 rodando na porta ${PORT}`));
