const KEY='forge_gestao_v1';
let db=JSON.parse(localStorage.getItem(KEY)||'{"products":[],"rentals":[],"quotes":[]}');
let currentQuote=[];

function persist(){localStorage.setItem(KEY,JSON.stringify(db)); refresh();}
function login(){
 const u=document.getElementById('user').value,p=document.getElementById('pass').value;
 if(u==='admin'&&p==='1234'){document.getElementById('login').classList.add('hidden');document.getElementById('app').classList.remove('hidden');refresh();}
 else alert('Usuário ou senha inválidos.');
}
function show(id){document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));document.getElementById(id).classList.remove('hidden');refresh();}
function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function addProduct(){
 const name=prompt('Nome do item/equipamento:'); if(!name)return;
 const value=Number(prompt('Valor padrão:','0')||0), qty=Number(prompt('Quantidade:','1')||1);
 db.products.push({id:Date.now(),name,value,qty});persist();
}
function addRental(){
 const available=db.products.filter(p=>p.qty>0);
 if(!available.length){alert('Cadastre um item com estoque antes de criar uma locação.');return}
 const p=available[0],client=prompt('Cliente:'); if(!client)return;
 const days=Number(prompt('Quantidade de dias:','1')||1);
 db.rentals.push({id:Date.now(),productId:p.id,product:p.name,client,days,total:p.value*days,status:'Alugado'});
 p.qty=Math.max(0,p.qty-1);persist();
}
function newQuote(){
 currentQuote=db.products.map(p=>({id:p.id,name:p.name,selected:false,qty:1,value:p.value}));
 renderQuote();
 show('orcamentos');
}
function renderQuote(){
 const box=document.getElementById('quoteItems'); if(!box)return;
 box.innerHTML=currentQuote.map((x,i)=>`<div class="quote-row">
 <label><input type="checkbox" ${x.selected?'checked':''} onchange="currentQuote[${i}].selected=this.checked"> ${x.name}</label>
 <input type="number" min="1" value="${x.qty}" onchange="currentQuote[${i}].qty=Number(this.value);calcQuote()">
 <input type="number" step="0.01" value="${x.value}" onchange="currentQuote[${i}].value=Number(this.value);calcQuote()">
 </div>`).join('') || '<p class="meta">Cadastre itens no estoque para montar um orçamento.</p>';
 calcQuote();
}
function calcQuote(){
 const total=currentQuote.filter(x=>x.selected).reduce((s,x)=>s+x.qty*x.value,0);
 document.getElementById('quoteTotal').value=total.toFixed(2);
}
function saveQuote(){
 const client=document.getElementById('quoteClient').value||'Cliente não informado';
 const items=currentQuote.filter(x=>x.selected).map(x=>({...x}));
 const total=Number(document.getElementById('quoteTotal').value||0);
 if(!items.length){alert('Selecione pelo menos um item.');return}
 db.quotes.unshift({id:Date.now(),client,items,total,date:new Date().toLocaleString('pt-BR')});persist();alert('Orçamento salvo.');
}
function generatePDF(){
 window.print();
}
function refresh(){
 document.getElementById('countProducts').textContent=db.products.length;
 document.getElementById('countRentals').textContent=db.rentals.filter(x=>x.status==='Alugado').length;
 document.getElementById('countQuotes').textContent=db.quotes.length;
 document.getElementById('products').innerHTML=db.products.map(p=>`<div class="item"><div><b>${p.name}</b><div class="meta">Estoque: ${p.qty} • Valor: ${money(p.value)}</div></div><button onclick="removeProduct(${p.id})">Excluir</button></div>`).join('')||'<p class="meta">Nenhum item cadastrado.</p>';
 document.getElementById('rentals').innerHTML=db.rentals.map(r=>`<div class="item"><div><b>${r.product}</b><div class="meta">Cliente: ${r.client} • ${r.days} dia(s) • ${money(r.total)}</div></div><button onclick="returnRental(${r.id})">${r.status==='Alugado'?'Registrar devolução':'Devolvido'}</button></div>`).join('')||'<p class="meta">Nenhum equipamento alugado.</p>';
 document.getElementById('quotes').innerHTML=db.quotes.map(q=>`<div class="item"><div><b>Orçamento — ${q.client}</b><div class="meta">${q.date} • ${money(q.total)}</div></div></div>`).join('');
 if(currentQuote.length)renderQuote();
}
function removeProduct(id){if(confirm('Excluir este item?')){db.products=db.products.filter(p=>p.id!==id);persist();}}
function returnRental(id){
 const r=db.rentals.find(x=>x.id===id);if(!r)return;
 if(r.status==='Alugado'){r.status='Devolvido';const p=db.products.find(x=>x.id===r.productId);if(p)p.qty++;}
 persist();
}
window.addEventListener('online',()=>{document.getElementById('connection').textContent='Online';document.getElementById('dot').style.background='#25d366'});
window.addEventListener('offline',()=>{document.getElementById('connection').textContent='Offline';document.getElementById('dot').style.background='#ffb000'});
refresh();
