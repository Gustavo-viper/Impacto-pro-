Impacto Pro Orçamentos V57

Novo fluxo de cadastro do cliente antes do orçamento:
1. Ao clicar em + Novo orçamento, o sistema primeiro abre a tela para gerar o link do cliente.
2. O link é criado com um token independente e não cria nenhum orçamento.
3. O cliente preenche os dados no link público.
4. O administrador verifica a resposta antes de criar o orçamento.
5. Após a conferência, o formulário do orçamento é aberto com os dados pré-preenchidos e continua totalmente editável.
6. Somente após salvar o orçamento a resposta do cliente é marcada como importada.

O usuário também pode optar por criar o orçamento manualmente.

A API pública /cliente/:token continua funcionando no server.js.
