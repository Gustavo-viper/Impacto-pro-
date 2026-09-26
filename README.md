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
