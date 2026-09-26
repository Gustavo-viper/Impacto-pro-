-- Impacto Pro Orçamentos - Neon PostgreSQL
-- Execute este arquivo no SQL Editor do projeto Neon "Impacto".

CREATE TABLE IF NOT EXISTS impacto_app_state (
  state_key TEXT PRIMARY KEY,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_impacto_app_state_updated_at
  ON impacto_app_state (updated_at);

-- Reserva uma linha central para o estado atual do aplicativo.
INSERT INTO impacto_app_state (state_key, payload)
VALUES ('main', '{}'::jsonb)
ON CONFLICT (state_key) DO NOTHING;
