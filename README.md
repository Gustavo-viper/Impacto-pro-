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
