# 💰 Sistema de Controle de Gastos Residenciais

Este projeto é uma solução **Full Stack** completa desenvolvida para o gerenciamento de finanças pessoais, permitindo o controle de pessoas, categorias e transações financeiras.

## 🛠️ Tecnologias Utilizadas

### Back-end
- **Framework**: .NET 8 Web API.
- **ORM**: Entity Framework Core com suporte a **Auto-Migrations**.
- **Banco de Dados**: PostgreSQL.
- **Segurança**: Middleware de autenticação via **API Key** (`X-Api-Key`).

### Front-end
- **Framework**: React com **TypeScript** (TSX).
- **Estilização**: CSS Modules / Styled Components.

---

## ⚙️ Regras de Negócio Implementadas

O sistema atende integralmente aos requisitos:

* **Cadastro de Pessoas**: CRUD completo (criação, edição, deleção e listagem) com identificadores únicos (Guid) gerados automaticamente.
* **Integridade de Dados**: Implementação de **Cascade Delete** (ao excluir uma pessoa, todas as suas transações vinculadas são removidas automaticamente).
* **Validação de Menores de Idade**: Para usuários menores de 18 anos, o sistema restringe o cadastro apenas para **Despesas**, bloqueando "Receitas".
* **Consistência de Categorias**: O sistema valida a finalidade da categoria (Receita/Despesa/Ambas). Transações de "Receita" não permitem o uso de categorias configuradas apenas como "Despesa" (e vice-versa).
* **Consulta de Totais**: Listagem detalhada por pessoa e categoria, exibindo receitas, despesas e saldo líquido, além do cálculo do total geral de todos os registros.

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- .NET 8 SDK instalado.
- Node.js e npm instalados.
- PostgreSQL instalado e rodando localmente.

### 2. Configuração do Banco de Dados
O projeto utiliza **Auto-Migrations**. O banco e as tabelas são criados automaticamente na primeira execução da API.
Acesse o arquivo `ControleGastosAPI/appsettings.json` e configure a sua senha local:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=ControleGastosDB;Username=postgres;Password=SUA_SENHA_AQUI"
}
