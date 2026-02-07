# 💰 Sistema de Controle de Gastos Full Stack

Este projeto é uma aplicação completa para gerenciamento de finanças pessoais, permitindo o controle de pessoas, categorias e transações financeiras. Desenvolvido como parte de um desafio técnico para a Maxiprod.

## 🚀 Diferenciais do Projeto
- **Auto-Migration**: O banco de dados PostgreSQL é criado e estruturado automaticamente na primeira execução da API.
- **Segurança**: Proteção de endpoints via **API Key** personalizada.
- **Integridade de Dados**: Implementação de Cascade Delete (exclusão de pessoa remove automaticamente suas transações).
- **Regras de Negócio**: Validação de idade para receitas e consistência entre tipos de transação e categorias.

---

## 🛠️ Tecnologias Utilizadas

### Back-end
- **Framework**: .NET 8 Web API
- **ORM**: Entity Framework Core
- **Banco de Dados**: PostgreSQL
- **Documentação**: Swagger / OpenAPI

### Front-end
- **Framework**: React.js
- **Estilização**: CSS Modules / Styled Components

---

## ⚙️ Configuração Inicial

### 1. Pré-requisitos
- .NET 8 SDK instalado.
- Node.js e npm instalados.
- PostgreSQL instalado e rodando.

### 2. Configuração do Banco de Dados
Acesse o arquivo `ControleGastosAPI/appsettings.json` e configure a sua senha local do PostgreSQL:
```json
"DefaultConnection": "Host=localhost;Port=5432;Database=ControleGastosDB;Username=postgres;Password=SUA_SENHA_AQUI"