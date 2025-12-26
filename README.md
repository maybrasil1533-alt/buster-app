# BUSTER - Análise de Desempenho

Sistema web para gerenciamento de serviços operacionais BUSTER.

## Funcionalidades

- ✅ Autenticação com usuário e senha
- ✅ Importação de planilhas Excel (.xlsx, .xls)
- ✅ Dashboard com métricas em tempo real
- ✅ Blocos de equipes expansíveis
- ✅ Gerenciamento de status de serviços
- ✅ Comentários e transferência de serviços
- ✅ Exportação de relatórios em Excel
- ✅ Sincronização automática de dados

## Credenciais Padrão

- **Usuário:** BUSTER
- **Senha:** 1234

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build de Produção

```bash
npm run build
```

## Deploy no Netlify

1. Faça o build: `npm run build`
2. Faça upload da pasta `dist` no Netlify
3. Configure as variáveis de ambiente se necessário

## Integração com Supabase

Para conectar ao Supabase:

1. Crie um projeto no Supabase
2. Crie as tabelas necessárias
3. Atualize o arquivo de configuração com as credenciais
4. Modifique os componentes para usar a API do Supabase

## Desenvolvido por

Jean Viana
