# Impacto Pro Orçamentos — V19

- PDF com formatação de documento A4.
- Títulos 16 pt e texto 12 pt.
- Correção de acentuação portuguesa no PDF (WinAnsi).
- Valores de orçamento e opcionais continuam separados.
- A imagem enviada pelo usuário é usada como marca d’água em página inteira, com transparência.
- Marca d’água aparece em todas as páginas do PDF e também no modo de impressão.
- Service Worker atualizado para V19.


## V20 — Atualização automática
O app instalado verifica novas versões no servidor, atualiza o Service Worker e mostra a mensagem de atualização. O usuário não precisa baixar/reinstalar o app a cada alteração.


## V21
- Equipamentos alugados: locado para + condição de retorno.
- Estoque agrupado por setor/categoria.
- Orçamento agrupado por setor, refletido também no PDF.
- Botão Enviar PDF no preview com chamada robusta para compartilhamento.


## V22
- Marca d'água agora ocupa 100% da folha A4 na visualização e impressão.
- Atualização automática usa versão persistente do aplicativo para mostrar a notificação após uma nova versão ser instalada.


## V23 — Opcionais com valores e setores
- Equipamentos agrupados por setor, com o setor aparecendo uma única vez no orçamento/PDF.
- Cada opcional mostra quantidade, nome e valor unitário.
- Configuração para mostrar ou ocultar o total dos opcionais no PDF.
- Quando ativado, o PDF mostra o valor unitário de cada opcional e o total dos opcionais separadamente.
- O total dos opcionais nunca é somado ao valor total principal.
- Configuração global disponível na aba Configurações e ajuste individual dentro de cada orçamento.


## V24 — Logo do cabeçalho do PDF
A logo do cabeçalho do PDF usa a versão transparente, eliminando a tarja preta. A marca d'água A4 de página inteira permanece independente.


## V25 — Orçamento por setores e opcionais separados
- Equipamentos aparecem uma única vez sob cada setor.
- O valor total do orçamento principal aparece depois de todos os setores.
- Opcionais aparecem depois do valor total principal.
- Cada opcional mostra seu valor unitário.
- O total dos opcionais só aparece quando a opção estiver marcada.
- O total dos opcionais nunca é somado ao valor total principal.
- O campo de estoque usa o termo Setor.


## V26 — PDF e WhatsApp
- Logo do cabeçalho do PDF usa PNG transparente, sem tarja preta.
- A versão nativa do PDF também recebe a logo sobre fundo branco, sem tarja.
- O botão "Enviar PDF" em computadores baixa o PDF e abre o WhatsApp Web com uma mensagem pronta para compartilhar; basta anexar o PDF na conversa.
- Em celulares/tablets compatíveis, o compartilhamento nativo pode enviar o arquivo PDF diretamente.
