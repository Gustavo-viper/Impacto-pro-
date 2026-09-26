# Impacto Pro Orçamentos — V51

## Banco central Neon
Esta versão está preparada para usar o projeto **Impacto** da Neon como banco central PostgreSQL.

### 1. Criar as tabelas
No Neon Console, abra o projeto **Impacto**, entre no SQL Editor e execute:

`database/neon_schema.sql`

### 2. Conectar no Render
Configure no serviço do Impacto Pro:

- `DATABASE_URL` = connection string do botão **Connect** do projeto Neon.
- `IMPACTO_SYNC_TOKEN` = opcional; se usado, coloque a mesma chave no campo de sincronização do aplicativo.
- `PORT` = o Render fornece automaticamente; não é necessário preencher.

Start Command:

`npm start`

Build Command:

`npm install`

### 3. Como funciona
O navegador continua mantendo uma cópia local para o modo offline. Quando existe internet, o aplicativo usa `/api` para buscar/salvar a cópia central no Neon. Assim Windows, Mac, Android e iPad podem trabalhar sobre o mesmo estado central.

A conexão com o Neon acontece no servidor: **a senha/connection string do banco não é colocada no JavaScript do navegador**.

### 4. Importante
A versão V51 entrega a integração técnica pronta, mas a `DATABASE_URL` precisa ser configurada no ambiente do servidor com a connection string real mostrada pelo Neon. Não coloque a senha do banco no código ou no GitHub.

### V51 - sincronização aprimorada
- Pull do Neon antes de persistir alterações locais na entrada.
- Push com tratamento de conflito quando o estado remoto for mais recente.
- Verificação automática do estado remoto a cada 30 segundos enquanto o app estiver aberto.
- Service Worker/cache atualizado para V51.
- DATABASE_URL continua somente no servidor.


## V54
- Contrato oficial de 5 páginas integrado a partir do PDF enviado pelo usuário.
- Campos XXXXXX editáveis dentro do app e pré-preenchidos com dados do orçamento quando disponíveis.
- Discriminação de setores manual e forma de pagamento editável.
- Setor do estoque em barra `<select>` para Android/iPad.
- Campos de data/hora do orçamento e demais telas com entrada manual compatível com Android.
- Opção de instrução para adicionar à Tela de Início em iPhone/iPad.
