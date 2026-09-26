# Impacto Pro Orçamentos — V55

Correção do módulo de Contratos.

## Correção principal
- Corrigida a função `groupItemsForContract`, que estava ausente e causava o erro `Can't find variable: groupItemsForContract` ao abrir Contratos após aceitar um orçamento.
- Agrupamento dos itens do orçamento por setor para preencher os serviços do contrato.
- Mantido o contrato oficial de 5 páginas.
- Mantida edição manual dos campos do contrato.
- Mantida assinatura e visualização/impressão.
- Service Worker atualizado para 55.0 e remove caches antigos.

## Importante
Depois de publicar a V55, atualize/recarregue o aplicativo para que o Service Worker V55 seja instalado.

V56: link público para dados do cliente, formulário online e importação automática para orçamento.


## V59
- Preenchimento automático de tipo, data e hora do evento recebido pelo link do cliente.
- Contrato original preservado como fundo, texto e cores; campos do contrato editáveis manualmente.


## V60 — Correção visual do contrato
- Campos sobrepostos agora usam fundo opaco na mesma tonalidade do documento original, evitando texto duplicado por transparência.
- Campos da área azul da página 1 preservam o fundo azul-claro original.
- Data do evento, data final, datas de pagamento e data do documento foram reforçadas para edição manual em formato DD/MM/AAAA no celular.
- Contrato permanece com as 5 páginas originais como fundo.


## V61 — módulo de Contratos removido
- Removida a opção Contratos do menu lateral.
- Removida a ação Contrato dos orçamentos aceitos.
- Removidas as telas, editor, visualizador e assinatura de contratos do JavaScript.
- Removidos os arquivos do contrato oficial dos assets.
- O restante do sistema de Orçamentos, Estoque, Agenda, Opcionais, Equipamentos alugados, Checklist, Financeiro, Lembretes, Histórico e Configurações permanece.


## V62 — acesso protegido ao Financeiro
- O menu Financeiro agora exige código OTP de 6 dígitos enviado por SMS.
- Código válido por 5 minutos e limitado a 5 tentativas.
- Solicitação de novo código limitada a 1 por minuto por IP e 5 por hora por IP.
- O código é armazenado no Neon somente como hash.
- Envio de SMS usa Twilio via variáveis de ambiente no servidor; nenhuma credencial fica no código.
- A autorização da sessão expira após 15 minutos.

### Variáveis obrigatórias no Render
`FINANCE_SMS_TO`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` e `TWILIO_FROM_NUMBER`.

> O número de destino fica apenas no servidor. O aplicativo exibe somente os últimos 4 dígitos.
