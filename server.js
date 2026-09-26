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
  await db`INSERT INTO impacto_app_state (state_key, payload) VALUES ('main', '{}'::jsonb) ON CONFLICT (state_key) DO NOTHING`;  await db`CREATE TABLE IF NOT EXISTS client_form_submissions (id BIGSERIAL PRIMARY KEY, token TEXT NOT NULL, name TEXT NOT NULL, cpf_cnpj TEXT, rg TEXT, phone TEXT, email TEXT, address TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), imported_at TIMESTAMPTZ)`;
  await db`CREATE INDEX IF NOT EXISTS idx_client_form_submissions_token ON client_form_submissions(token)`;
  await db`CREATE INDEX IF NOT EXISTS idx_client_form_submissions_imported ON client_form_submissions(imported_at)`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS event_type TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS event_date DATE`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS event_time TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS event_location TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS couple_names TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS debutante_name TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS graduate_name TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS company_name TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS company_cnpj TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS corporate_contact TEXT`;
  await db`ALTER TABLE client_form_submissions ADD COLUMN IF NOT EXISTS corporate_role TEXT`;
}


app.get('/api/health', async (req, res) => {
  try {
    await ensureSchema();
    res.json({ ok: true, database: 'neon', version: '58.0' });
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


app.get('/cliente/:token',(req,res)=>{
 const token=String(req.params.token||'').trim();
 if(!token||token.length>200||!/^[a-zA-Z0-9._:-]+$/.test(token))return res.status(400).send('Link inválido.');
 const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#07111b"><title>Dados do cliente — Impacto Pro</title><style>body{margin:0;background:#07111b;color:#eef6ff;font-family:Arial,sans-serif;padding:18px}main{max-width:760px;margin:auto;background:#0c1a28;border:1px solid #21415a;border-radius:20px;padding:24px;box-shadow:0 20px 60px #0008}h1{margin:0 0 8px;font-size:28px}h2{font-size:18px;margin:24px 0 10px;color:#8edcff}.intro{color:#a8bacb;line-height:1.5}.section{border:1px solid #21415a;border-radius:14px;padding:14px;margin-top:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:620px){.grid{grid-template-columns:1fr}}label{display:block;font-weight:700;margin:10px 0 6px}input,textarea,select{width:100%;box-sizing:border-box;padding:13px;border-radius:10px;border:1px solid #36536b;background:#091521;color:#fff;font-size:16px}select{appearance:auto}button{margin-top:18px;width:100%;padding:15px;border:0;border-radius:12px;background:linear-gradient(90deg,#11bce8,#5d62ff);color:#fff;font-weight:800;font-size:16px}.muted{color:#a8bacb}.hidden{display:none!important}.hint{font-size:13px;color:#8fa8ba;margin-top:6px}.ok{padding:14px;border-radius:10px;background:#103a2c;color:#a9f2d0;margin-top:16px}</style></head><body><main><h1>Impacto Pro</h1><p class="intro">Preencha seus dados para o orçamento. As informações serão enviadas para conferência e somente depois poderão ser incorporadas ao orçamento.</p><form id="f">
<div class="section"><h2>👤 Dados do cliente</h2><div class="grid"><div><label>Nome *</label><input name="name" required autocomplete="name"></div><div><label>CPF/CNPJ</label><input name="cpfCnpj" autocomplete="off"></div><div><label>RG</label><input name="rg" autocomplete="off"></div><div><label>Telefone / WhatsApp</label><input name="phone" inputmode="tel" autocomplete="tel"></div><div><label>E-mail</label><input name="email" type="email" autocomplete="email"></div><div><label>Endereço</label><input name="address" autocomplete="street-address"></div></div></div>
<div class="section"><h2>📅 Dados do evento</h2><div class="grid"><div><label>Tipo de evento *</label><select name="eventType" id="eventType" required><option value="">Selecione...</option><option value="casamento">Casamento</option><option value="15_anos">15 anos</option><option value="formatura">Formatura</option><option value="corporativo">Corporativo</option><option value="outro">Outro</option></select></div><div><label>Local do evento</label><input name="eventLocation"></div><div><label>Data do evento</label><input name="eventDate" type="date"></div><div><label>Horário de início</label><input name="eventTime" type="time"></div></div><div id="specific" class="section hidden"></div></div>
<button type="submit">Enviar meus dados</button></form><div id="m"></div><script>
const f=document.getElementById('f'),m=document.getElementById('m'),type=document.getElementById('eventType'),specific=document.getElementById('specific');
function renderSpecific(){const v=type.value;if(!v){specific.classList.add('hidden');specific.innerHTML='';return;}specific.classList.remove('hidden');if(v==='casamento')specific.innerHTML='<h2>💍 Dados do casamento</h2><label>Nome dos noivos *</label><input name="coupleNames" required placeholder="Ex.: João Silva e Maria Souza"><div class="hint">Informe o nome completo dos noivos.</div>';else if(v==='15_anos')specific.innerHTML='<h2>🎂 Dados da debutante</h2><label>Nome da debutante *</label><input name="debutanteName" required placeholder="Nome completo da debutante">';else if(v==='formatura')specific.innerHTML='<h2>🎓 Dados da formatura</h2><label>Nome do formando(a) *</label><input name="graduateName" required placeholder="Nome completo do formando(a)">';else if(v==='corporativo')specific.innerHTML='<h2>🏢 Dados corporativos</h2><div class="grid"><div><label>Empresa / Instituição *</label><input name="companyName" required placeholder="Nome da empresa"></div><div><label>CNPJ</label><input name="companyCnpj" placeholder="00.000.000/0000-00"></div><div><label>Responsável pelo evento *</label><input name="corporateContact" required placeholder="Nome do responsável"></div><div><label>Cargo / Departamento</label><input name="corporateRole" placeholder="Ex.: Marketing / Eventos"></div></div><div class="hint">Esses dados deixam a identificação do evento corporativo mais completa e profissional.</div>';else specific.innerHTML='<h2>📌 Dados do evento</h2><label>Nome / identificação do evento</label><input name="otherEventName" placeholder="Nome do evento">';}
type.addEventListener('change',renderSpecific);renderSpecific();
f.addEventListener('submit',async e=>{e.preventDefault();if(!type.value){alert('Selecione o tipo de evento.');return;}const b=Object.fromEntries(new FormData(f).entries());m.innerHTML='<p class="muted">Enviando...</p>';try{const r=await fetch(location.pathname,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Erro');f.remove();m.innerHTML='<div class="ok"><b>Dados enviados com sucesso.</b><br>O responsável pelo orçamento irá conferir as informações antes de utilizá-las.</div>'}catch(err){m.textContent='Não foi possível enviar agora. Tente novamente.'}})</script></main></body></html>`;
 res.type('html').send(html);
});
app.post('/cliente/:token',async(req,res)=>{
 const token=String(req.params.token||'').trim(),b=req.body||{};
 if(!token||!String(b.name||'').trim())return res.status(400).json({ok:false,error:'Nome é obrigatório.'});
 if(!String(b.eventType||'').trim())return res.status(400).json({ok:false,error:'Tipo de evento é obrigatório.'});
 try{const db=getSql();const rows=await db`INSERT INTO client_form_submissions(token,name,cpf_cnpj,rg,phone,email,address,event_type,event_date,event_time,event_location,couple_names,debutante_name,graduate_name,company_name,company_cnpj,corporate_contact,corporate_role) VALUES(${token},${String(b.name).trim()},${String(b.cpfCnpj||'').trim()},${String(b.rg||'').trim()},${String(b.phone||'').trim()},${String(b.email||'').trim()},${String(b.address||'').trim()},${String(b.eventType||'').trim()},${String(b.eventDate||'')||null},${String(b.eventTime||'').trim()},${String(b.eventLocation||'').trim()},${String(b.coupleNames||'').trim()},${String(b.debutanteName||'').trim()},${String(b.graduateName||'').trim()},${String(b.companyName||'').trim()},${String(b.companyCnpj||'').trim()},${String(b.corporateContact||'').trim()},${String(b.corporateRole||'').trim()}) RETURNING id,created_at`;res.json({ok:true,id:String(rows[0].id),createdAt:rows[0].created_at})}catch(e){console.error(e);res.status(500).json({ok:false,error:'Não foi possível salvar os dados.'})}});
app.get('/api/client-responses',async(req,res)=>{if(!authorized(req))return res.status(401).json({ok:false,error:'Não autorizado'});try{const db=getSql();const rows=await db`SELECT id,token,name,cpf_cnpj AS "cpfCnpj",rg,phone,email,address,event_type AS "eventType",event_date AS "eventDate",event_time AS "eventTime",event_location AS "eventLocation",couple_names AS "coupleNames",debutante_name AS "debutanteName",graduate_name AS "graduateName",company_name AS "companyName",company_cnpj AS "companyCnpj",corporate_contact AS "corporateContact",corporate_role AS "corporateRole",created_at AS "createdAt" FROM client_form_submissions WHERE imported_at IS NULL ORDER BY created_at ASC LIMIT 100`;res.json({ok:true,responses:rows})}catch(e){console.error(e);res.status(500).json({ok:false,error:'Erro ao consultar respostas'})}});
app.post('/api/client-responses/:id/mark',async(req,res)=>{if(!authorized(req))return res.status(401).json({ok:false,error:'Não autorizado'});try{const db=getSql();await db`UPDATE client_form_submissions SET imported_at=NOW() WHERE id=${Number(req.params.id)}`;res.json({ok:true})}catch(e){console.error(e);res.status(500).json({ok:false,error:'Erro ao marcar resposta'})}});

app.use(express.static(path.join(__dirname)));
app.use((req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Impacto Pro V58 rodando na porta ${PORT}`));
