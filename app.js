const DBKEY="forge_final_v1";
const seed={settings:{company:"Impacto Pro",logo:"",phone:"",address:""},products:[],rentals:[],quotes:[],users:[{user:"admin",pass:"1234",role:"CEO"}]};
let db=load(); let page="dashboard"; let editingQuote=null;
function load(){try{return {...seed,...JSON.parse(localStorage.getItem(DBKEY)||"{}")}}catch{return structuredClone(seed)}}
function save(){localStorage.setItem(DBKEY,JSON.stringify(db)); render()}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const money=v=>Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function toast(msg){let t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2500)}
function login(){let u=$("#loginUser").value,p=$("#loginPass").value;let ok=db.users.some(x=>x.user===u&&x.pass===p);if(!ok)return toast("Usuário ou senha inválidos.");sessionStorage.setItem("forge_auth","1");$("#login").classList.add("hidden");$("#app").classList.remove("hidden");render()}
function logout(){sessionStorage.removeItem("forge_auth");location.reload()}
$("#loginBtn").onclick=login; $("#logout").onclick=logout;
$$("nav button").forEach(b=>b.onclick=()=>{page=b.dataset.page;$$("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()});
window.addEventListener("online",()=>updateNet());window.addEventListener("offline",()=>updateNet());
function updateNet(){let on=navigator.onLine;$("#netText").textContent=on?"Online":"Offline";$("#syncText").textContent=on?"Online":"Offline";$("#netDot").style.background=on?"#2bd28a":"#ffb000";$("#syncDot").style.background=on?"#2bd28a":"#ffb000"}
function render(){updateNet();let titles={dashboard:["Dashboard","Visão geral do sistema"],quotes:["Orçamentos","Criação e histórico de propostas"],stock:["Controle de Estoque","Materiais e equipamentos"],rentals:["Equipamentos Alugados","Controle de locações e devoluções"],history:["Histórico","Movimentações e orçamentos"],settings:["Configurações","Dados da empresa e acesso"]};$("#pageTitle").textContent=titles[page][0];$("#pageSub").textContent=titles[page][1];$$(".page").forEach(x=>x.classList.add("hidden"));$("#"+page).classList.remove("hidden");({dashboard:dashboard,quotes:quotes,stock:stock,rentals:rentals,history:history,settings:settings}[page])()}
function dashboard(){$("#dashboard").innerHTML=`<div class="cards">
<div class="card"><b>${db.products.length}</b><small>Itens cadastrados</small></div>
<div class="card"><b>${db.products.reduce((s,x)=>s+Number(x.qty||0),0)}</b><small>Unidades em estoque</small></div>
<div class="card"><b>${db.rentals.filter(x=>x.status==="Alugado").length}</b><small>Equipamentos alugados</small></div>
<div class="card"><b>${db.quotes.length}</b><small>Orçamentos</small></div></div>
<div class="grid2"><div class="panel"><div class="section-head"><h3>Locações atuais</h3><button class="ghost" onclick="page='rentals';render()">Ver tudo</button></div>${db.rentals.filter(x=>x.status==="Alugado").slice(0,5).map(r=>`<p><b>${esc(r.product)}</b> — ${esc(r.client)} <span class="badge">Alugado</span></p>`).join("")||'<div class="empty">Nenhum equipamento alugado.</div>'}</div>
<div class="panel"><div class="section-head"><h3>Últimos orçamentos</h3><button class="ghost" onclick="page='quotes';render()">Ver tudo</button></div>${db.quotes.slice(0,5).map(q=>`<p><b>${esc(q.client)}</b> — ${money(q.total)} <span class="muted">${esc(q.number)}</span></p>`).join("")||'<div class="empty">Nenhum orçamento.</div>'}</div></div>`}
function stock(){let rows=db.products.map(p=>`<tr><td><b>${esc(p.name)}</b><div class="muted">${esc(p.category||"")}</div></td><td>${p.qty}</td><td>${money(p.value)}</td><td>${p.qty<=Number(p.min||0)?'<span class="badge red">Baixo</span>':'<span class="badge green">Normal</span>'}</td><td><button class="ghost" onclick="editProduct(${p.id})">Editar</button> <button class="danger" onclick="delProduct(${p.id})">Excluir</button></td></tr>`).join("");$("#stock").innerHTML=`<div class="section-head"><div><h3>Materiais e equipamentos</h3><p class="muted">Preços padrão podem ser alterados no cadastro. No orçamento, o preço pode ser diferente sem alterar o cadastro.</p></div><button class="primary" onclick="productModal()">+ Novo item</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th>Qtd.</th><th>Valor padrão</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty">Nenhum item cadastrado.</td></tr>'}</tbody></table></div>`}
function productModal(id=null){let p=db.products.find(x=>x.id===id)||{name:"",category:"",qty:0,value:0,min:0,serial:"",notes:""};modal(`<div class="modal-head"><h3>${id?"Editar item":"Novo item"}</h3><button class="close" onclick="closeModal()">×</button></div><div class="form-grid">
<div class="field"><label>Nome</label><input id="pname" value="${esc(p.name)}"></div><div class="field"><label>Categoria</label><input id="pcat" value="${esc(p.category)}"></div>
<div class="field"><label>Quantidade</label><input id="pqty" type="number" value="${p.qty}"></div><div class="field"><label>Valor padrão</label><input id="pvalue" type="number" step=".01" value="${p.value}"></div>
<div class="field"><label>Estoque mínimo</label><input id="pmin" type="number" value="${p.min}"></div><div class="field"><label>Nº de série / patrimônio</label><input id="pserial" value="${esc(p.serial)}"></div>
<div class="field full"><label>Observações</label><textarea id="pnotes">${esc(p.notes)}</textarea></div></div><br><button class="primary" onclick="saveProduct(${id||0})">Salvar</button>`)}
function saveProduct(id){let p={id:id||Date.now(),name:$("#pname").value.trim(),category:$("#pcat").value.trim(),qty:Number($("#pqty").value||0),value:Number($("#pvalue").value||0),min:Number($("#pmin").value||0),serial:$("#pserial").value.trim(),notes:$("#pnotes").value.trim()};if(!p.name)return toast("Informe o nome.");if(id)db.products=db.products.map(x=>x.id===id?p:x);else db.products.push(p);closeModal();save();toast("Item salvo.")}
function editProduct(id){productModal(id)}function delProduct(id){if(confirm("Excluir este item?")){db.products=db.products.filter(x=>x.id!==id);save()}}
function rentals(){let rows=db.rentals.map(r=>`<tr><td><b>${esc(r.product)}</b></td><td>${esc(r.client)}</td><td>${r.start}</td><td>${r.end||"-"}</td><td>${money(r.total)}</td><td>${r.status==="Alugado"?'<span class="badge">Alugado</span>':'<span class="badge green">Devolvido</span>'}</td><td>${r.status==="Alugado"?`<button class="primary" onclick="returnRental(${r.id})">Devolver</button>`:""}</td></tr>`).join("");$("#rentals").innerHTML=`<div class="section-head"><div><h3>Equipamentos alugados</h3><p class="muted">A locação retira uma unidade do estoque e a devolução repõe.</p></div><button class="primary" onclick="rentalModal()">+ Nova locação</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Equipamento</th><th>Cliente</th><th>Saída</th><th>Devolução</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="7" class="empty">Nenhuma locação.</td></tr>'}</tbody></table></div>`}
function rentalModal(){let opts=db.products.filter(p=>p.qty>0).map(p=>`<option value="${p.id}">${esc(p.name)} — ${p.qty} disponível</option>`).join("");if(!opts)return toast("Cadastre um item com estoque disponível.");modal(`<div class="modal-head"><h3>Nova locação</h3><button class="close" onclick="closeModal()">×</button></div><div class="form-grid">
<div class="field full"><label>Equipamento</label><select id="rprod">${opts}</select></div><div class="field"><label>Cliente</label><input id="rclient"></div><div class="field"><label>Quantidade de dias</label><input id="rdays" type="number" min="1" value="1"></div><div class="field"><label>Valor da diária</label><input id="rdaily" type="number" step=".01" value="0"></div><div class="field"><label>Data de devolução prevista</label><input id="rend" type="date"></div></div><br><button class="primary" onclick="saveRental()">Registrar locação</button>`);$("#rprod").onchange=()=>{$("#rdaily").value=db.products.find(p=>p.id==$("#rprod").value)?.value||0};$("#rprod").dispatchEvent(new Event("change"))}
function saveRental(){let p=db.products.find(x=>x.id==$("#rprod").value),days=Number($("#rdays").value||1),daily=Number($("#rdaily").value||0),client=$("#rclient").value.trim();if(!client)return toast("Informe o cliente.");if(!p||p.qty<1)return toast("Equipamento indisponível.");p.qty--;db.rentals.unshift({id:Date.now(),productId:p.id,product:p.name,client,start:new Date().toLocaleDateString("pt-BR"),end:$("#rend").value,total:days*daily,status:"Alugado",days,daily});closeModal();save();toast("Locação registrada.")}
function returnRental(id){let r=db.rentals.find(x=>x.id===id);if(!r)return;r.status="Devolvido";r.returned=new Date().toLocaleDateString("pt-BR");let p=db.products.find(x=>x.id===r.productId);if(p)p.qty++;save();toast("Devolução registrada.")}
function quotes(){let rows=db.quotes.map(q=>`<tr><td>${esc(q.number)}</td><td><b>${esc(q.client)}</b></td><td>${q.date}</td><td>${money(q.total)}</td><td><button class="ghost" onclick="printQuote(${q.id})">PDF / Imprimir</button></td></tr>`).join("");$("#quotes").innerHTML=`<div class="section-head"><div><h3>Orçamentos</h3><p class="muted">Selecione exatamente o que entra no orçamento e edite os valores sem alterar o cadastro.</p></div><button class="primary" onclick="quoteModal()">+ Novo orçamento</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Nº</th><th>Cliente</th><th>Data</th><th>Total</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty">Nenhum orçamento.</td></tr>'}</tbody></table></div>`}
function quoteModal(){let opts=db.products.map(p=>`<div class="quote-line"><input type="checkbox" data-q="${p.id}"><span>${esc(p.name)}</span><input type="number" class="qqty" data-id="${p.id}" min="1" value="1"><input type="number" class="qval" data-id="${p.id}" step=".01" value="${p.value}"><button class="close" onclick="this.closest('.quote-line').remove()">×</button></div>`).join("");if(!opts)return toast("Cadastre itens no estoque primeiro.");modal(`<div class="modal-head"><h3>Novo orçamento</h3><button class="close" onclick="closeModal()">×</button></div><div class="form-grid"><div class="field full"><label>Cliente</label><input id="qclient" placeholder="Nome do cliente"></div></div><hr style="border-color:#17324b"><p class="muted">Marque os itens que entram no orçamento. O valor abaixo é editável apenas neste orçamento.</p><div id="qitems">${opts}</div><div class="quote-total"><span>Valor final</span><input id="qtotal" type="number" step=".01" value="0"></div><div class="field"><label>Observações</label><textarea id="qnotes"></textarea></div><br><button class="primary" onclick="saveQuote()">Salvar orçamento</button>`);$$(".qval,.qqty,#qitems input[type=checkbox]").forEach(x=>x.addEventListener("input",calcQuote));calcQuote()}
function calcQuote(){let total=0;$$("#qitems .quote-line").forEach(line=>{let cb=line.querySelector("[data-q]");if(cb.checked){let qty=Number(line.querySelector(".qqty").value||0),val=Number(line.querySelector(".qval").value||0);total+=qty*val}});$("#qtotal").value=total.toFixed(2)}
function saveQuote(){let client=$("#qclient").value.trim()||"Cliente não informado",items=[];$$("#qitems .quote-line").forEach(line=>{let cb=line.querySelector("[data-q]");if(cb.checked){items.push({productId:Number(cb.dataset.q),name:line.children[1].textContent,qty:Number(line.querySelector(".qqty").value),value:Number(line.querySelector(".qval").value)})}});if(!items.length)return toast("Selecione pelo menos um item.");let q={id:Date.now(),number:"ORC-"+String(db.quotes.length+1).padStart(5,"0"),client,date:new Date().toLocaleDateString("pt-BR"),items,total:Number($("#qtotal").value||0),notes:$("#qnotes").value};db.quotes.unshift(q);closeModal();save();toast("Orçamento salvo.");printQuote(q.id)}
function printQuote(id){let q=db.quotes.find(x=>x.id===id);if(!q)return;let w=window.open("","_blank");w.document.write(`<html><head><title>${q.number}</title><style>body{font-family:Arial;margin:40px;color:#111}h1{color:#087ff0}table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #ddd;text-align:left}.total{text-align:right;font-size:20px;font-weight:bold;margin-top:20px}@media print{button{display:none}}</style></head><body><h1>${esc(db.settings.company||"Forge Studios")}</h1><h2>ORÇAMENTO ${q.number}</h2><p><b>Cliente:</b> ${esc(q.client)}<br><b>Data:</b> ${q.date}</p><table><tr><th>Item</th><th>Qtd.</th><th>Valor</th><th>Total</th></tr>${q.items.map(i=>`<tr><td>${esc(i.name)}</td><td>${i.qty}</td><td>${money(i.value)}</td><td>${money(i.qty*i.value)}</td></tr>`).join("")}</table><div class="total">TOTAL: ${money(q.total)}</div><p>${esc(q.notes||"")}</p><button onclick="print()">Imprimir / Salvar PDF</button></body></html>`);w.document.close();setTimeout(()=>w.print(),300)}
function history(){$("#history").innerHTML=`<div class="grid2"><div class="panel"><h3>Últimos orçamentos</h3>${db.quotes.slice(0,10).map(q=>`<p>${esc(q.number)} • ${esc(q.client)} • <b>${money(q.total)}</b></p>`).join("")||'<div class="empty">Sem registros.</div>'}</div><div class="panel"><h3>Locações</h3>${db.rentals.slice(0,10).map(r=>`<p>${esc(r.product)} • ${esc(r.client)} • <span class="badge">${r.status}</span></p>`).join("")||'<div class="empty">Sem registros.</div>'}</div></div>`}
function settings(){$("#settings").innerHTML=`<div class="panel"><h3>Empresa</h3><div class="form-grid"><div class="field"><label>Nome da empresa</label><input id="scompany" value="${esc(db.settings.company)}"></div><div class="field"><label>Telefone</label><input id="sphone" value="${esc(db.settings.phone)}"></div><div class="field full"><label>Endereço</label><input id="saddress" value="${esc(db.settings.address)}"></div></div><br><button class="primary" onclick="saveSettings()">Salvar</button></div><div class="panel" style="margin-top:15px"><h3>Modo de dados</h3><p class="muted">Esta versão salva os dados no dispositivo e funciona offline. A sincronização online multi-dispositivo deve ser ligada a um backend/banco remoto na próxima etapa.</p><button class="ghost" onclick="exportData()">Exportar backup JSON</button> <button class="ghost" onclick="importData()">Importar backup</button></div>`}
function saveSettings(){db.settings.company=$("#scompany").value;db.settings.phone=$("#sphone").value;db.settings.address=$("#saddress").value;save();toast("Configurações salvas.")}
function exportData(){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:"application/json"}));a.download="forge-backup.json";a.click()}
function importData(){let i=document.createElement("input");i.type="file";i.accept=".json";i.onchange=()=>{let r=new FileReader();r.onload=()=>{try{db=JSON.parse(r.result);save();toast("Backup importado.")}catch{toast("Backup inválido.")}};r.readAsText(i.files[0])};i.click()}
function modal(html){let d=document.createElement("div");d.id="modal";d.className="modal";d.innerHTML=`<div class="modal-box">${html}</div>`;document.body.appendChild(d)}
function closeModal(){document.getElementById("modal")?.remove()}
if(sessionStorage.getItem("forge_auth")==="1"){ $("#login").classList.add("hidden");$("#app").classList.remove("hidden") } else {$("#loginUser").value="admin";$("#loginPass").value="1234"}
render();

if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js").catch(()=>{});}


function gerarPDFImpactoPro(orcamento){
    const itens = orcamento.itens || orcamento.items || [];
    const linhas = itens.map(item => `
        <tr>
            <td>${escapeHTML(item.nome || item.name)}</td>
            <td>${item.quantidade || item.qty || 1}</td>
            <td>${formatarMoeda(item.valor ?? item.value ?? 0)}</td>
            <td>${formatarMoeda((item.quantidade || item.qty || 1) * (item.valor ?? item.value ?? 0))}</td>
        </tr>`).join("");

    const janela = window.open("", "_blank", "width=900,height=1000");
    janela.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Impacto Pro - Orçamento ${escapeHTML(orcamento.numero || "")}</title>
<style>
@page{size:A4;margin:15mm}*{box-sizing:border-box}
body{margin:0;font-family:Arial,Helvetica,sans-serif;color:#111;position:relative;min-height:267mm}
.watermark{position:fixed;top:50%;left:50%;width:430px;transform:translate(-50%,-50%);opacity:.055;z-index:-1;pointer-events:none}
.header{display:flex;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:2px solid #111}
.logo{width:230px;height:auto}.info{text-align:right;font-size:12px;line-height:1.6}
.title{margin-top:30px;text-align:center}.title h1{margin:0;font-size:25px}.title p{margin-top:7px;color:#666}
.client{margin-top:25px;padding:15px;border:1px solid #ddd;border-radius:8px}
table{width:100%;margin-top:25px;border-collapse:collapse}th{background:#111;color:#fff;padding:10px;text-align:left}
td{padding:10px;border-bottom:1px solid #ddd}.total{margin-top:25px;margin-left:auto;width:280px}
.total-row{display:flex;justify-content:space-between;padding:6px 0}
.total-final{border-top:2px solid #111;margin-top:7px;padding-top:10px;font-size:21px;font-weight:bold}
.observacoes{margin-top:35px}.footer{position:fixed;bottom:0;left:0;right:0;border-top:1px solid #ddd;padding-top:8px;text-align:center;font-size:10px;color:#777}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.no-print{display:none}}
</style></head><body>
<img class="watermark" src="assets/impacto-pro-logo.jpeg" alt="">
<div class="header"><img class="logo" src="assets/impacto-pro-logo.jpeg" alt="Impacto Pro">
<div class="info"><strong>ORÇAMENTO Nº ${escapeHTML(orcamento.numero || "")}</strong><br>Data: ${escapeHTML(orcamento.data || "")}</div></div>
<div class="title"><h1>ORÇAMENTO</h1><p>Impacto Pro Orçamentos</p></div>
<div class="client"><strong>CLIENTE</strong><br><br>${escapeHTML(orcamento.cliente || "Cliente não informado")}</div>
<table><thead><tr><th>Item</th><th>Quantidade</th><th>Valor unitário</th><th>Total</th></tr></thead><tbody>${linhas}</tbody></table>
<div class="total">
<div class="total-row"><span>Subtotal</span><strong>${formatarMoeda(orcamento.subtotal || orcamento.total || 0)}</strong></div>
<div class="total-row"><span>Desconto</span><strong>${formatarMoeda(orcamento.desconto || 0)}</strong></div>
<div class="total-row total-final"><span>TOTAL</span><strong>${formatarMoeda(orcamento.total || 0)}</strong></div></div>
<div class="observacoes"><h3>Observações</h3><p>${escapeHTML(orcamento.observacoes || orcamento.notes || "")}</p></div>
<div class="footer">Impacto Pro Orçamentos</div>
</body></html>`);
    janela.document.close();
    setTimeout(()=>{janela.focus();janela.print()},500);
}
function formatarMoeda(valor){
    return Number(valor||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}
function escapeHTML(valor){
    return String(valor??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
