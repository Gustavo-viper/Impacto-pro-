# Impacto Pro Orçamentos — V8

Sistema web/PWA para gestão de orçamentos, estoque, opcionais e equipamentos alugados.

## Alterações desta versão
- Removida a área de cadastro de clientes.
- O cliente/contratante é informado diretamente ao criar o orçamento.
- PDF com cabeçalho profissional contendo: evento, data, horário, cerimonialista, local e cidade.
- PDF com logo e marca d'água do Impacto Pro.
- Indicador automático de Online/Offline usando o estado real da conexão do navegador.
- Dados salvos localmente para funcionamento sem internet.
- Barra lateral profissional com menus em coluna, um abaixo do outro.
- Ícone PWA em PNG 192x192 e 512x512 para instalação no Android/Windows/macOS compatíveis com PWA.
- Service Worker atualizado para V8 para evitar cache da versão antiga.

## Login de demonstração
Usuário: `admin`
Senha: `1234`

## Publicação no Render
Publique estes arquivos como site estático. Após um novo deploy, abra o endereço em aba anônima ou limpe os dados/cache do site para garantir que o Service Worker V8 seja instalado.
