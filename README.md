# Impacto Pro Orçamentos — V41

- Botão **Enviar PDF** do preview agora compartilha o arquivo diretamente pelo Web Share API no iPhone/iPad quando suportado.
- O PDF é preparado antes do clique, preservando a ativação do usuário exigida pelo Safari/iOS.
- Em navegadores sem compartilhamento de arquivos, o PDF é baixado e o WhatsApp é aberto com a mensagem pronta para anexar o arquivo.
- Versão de build: 41.0.

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


## V27 — Correção definitiva do cabeçalho e WhatsApp
- O cabeçalho do PDF não usa mais o JPEG antigo com fundo preto.
- A pré-visualização usa a PNG transparente.
- O PDF nativo usa uma imagem branca limpa no cabeçalho, visualmente sem tarja preta.
- O botão Enviar PDF abre o WhatsApp imediatamente no computador para evitar bloqueio de pop-up e baixa o PDF para anexar.
- No celular, tenta o compartilhamento nativo do arquivo.
- O botão Enviar PDF da pré-visualização chama a mesma rotina.


## V28 — Opcionais automáticos, offline no PC e lembretes
- Todo equipamento cadastrado no Estoque aparece automaticamente na aba Opcionais.
- O valor do opcional pode ser configurado separadamente do valor do Estoque.
- O app usa Service Worker e cache local para continuar funcionando offline no PC após o primeiro carregamento online.
- Nova aba Lembretes com título, mensagem, intervalo em minutos/horas/dias, ativação/pausa e próxima execução.
- Notificações do navegador podem ser ativadas pelo botão da aba Lembretes.
- Os lembretes locais funcionam mesmo sem internet enquanto o aplicativo estiver aberto. Para notificações garantidas com o aplicativo completamente fechado seria necessário um serviço de push/servidor.


## V29
Correção da aba Opcionais para sincronizar todos os itens do Estoque e correção da rota Lembretes. Cache atualizado.


## V30 — correção efetiva
- Corrigido o roteador real do aplicativo para reconhecer a tela Lembretes.
- Implementada a tela Lembretes completa.
- Todo produto do Estoque é sincronizado como opcional automaticamente.
- A sincronização acontece na entrada do aplicativo, ao salvar o Estoque e ao abrir Opcionais.
- Cache do Service Worker atualizado para V30.


## V37 — offline no Windows/macOS e atualização automática
- Service Worker com cache offline do aplicativo e dos arquivos principais.
- Estratégia network-first para index.html, app.js e style.css quando houver internet, com fallback para o cache quando estiver offline.
- Cache antigo do Impacto Pro é removido automaticamente na ativação de uma nova versão.
- Verificação de versão em `version.json` a cada 60 segundos.
- Aviso flutuante aparece quando uma nova versão está disponível e oferece o botão `RECARREGAR`.
- O Service Worker é atualizado com `updateViaCache: none` e verificação periódica.
- Para usar offline no PC: abra o endereço publicado uma vez com internet e instale o PWA pelo Chrome/Edge. Depois ele continua disponível sem internet.


## V39 — Setores fixos no estoque
- Setores do estoque já vêm cadastrados no sistema.
- Ao cadastrar/editar equipamento, basta selecionar o setor em uma lista.
- Setor selecionado é usado automaticamente nos orçamentos e PDFs.
- Equipamentos com categorias antigas não padronizadas são migrados para "Outros".


## V43 — Responsividade para tablets
- Layout adaptado para iPad e tablets Android em orientação retrato e paisagem.
- Navegação reorganizada para telas intermediárias, sem sidebar fixa ocupando a tela.
- Áreas de tabelas com rolagem horizontal por toque quando necessário.
- Botões e controles com alvos de toque maiores.
- Suporte a safe-area do iOS/iPadOS.
- Manifesto PWA com orientação `any` para permitir retrato e paisagem.
- Metatags específicas para instalação como app no iPad/iPhone.
- Versão atualizada para 43.0.


## V45 — Agenda e validade dos orçamentos
- Agenda mensal com quantidade de orçamentos por dia, usando automaticamente a data de emissão.
- Cada orçamento recebe validade automática de 15 dias após a emissão.
- Exibição da data de vencimento na lista de orçamentos e na agenda.
- Alerta 2 dias antes do vencimento, com aviso flutuante e Notification API quando a permissão estiver concedida.
- Novo status de orçamento: Recusado, com opção de reabrir.
- Aceito, recusado e em aberto ficam separados e não alteram o valor do orçamento.
