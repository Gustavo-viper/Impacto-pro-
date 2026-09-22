# Forge Studios — Protótipo de Gestão

Protótipo funcional de um aplicativo de gestão com:
- Orçamentos
- Estoque
- Equipamentos alugados
- Geração por impressão/PDF
- Login de administrador
- Funcionamento offline via localStorage

## Testar
Abra `index.html` no navegador.

Login do protótipo:
- usuário: `admin`
- senha: `1234`

## Online + Offline
Esta versão já armazena os dados localmente e continua funcionando sem internet.
A parte de sincronização online ainda é uma etapa posterior: ela deverá usar uma API/banco remoto para sincronizar os dados quando houver conexão.

## Próxima etapa recomendada
Transformar este protótipo em aplicativo instalável para Android, Windows e macOS usando uma camada multiplataforma e adicionar:
- banco SQLite local;
- autenticação real;
- sincronização online;
- permissões CEO/Programador;
- PDF nativo;
- backup e restauração;
- atualização do estoque ao usar itens em orçamentos;
- controle completo de locações.
