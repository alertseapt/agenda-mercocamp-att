# API CRUD Mercocamp v3.1.0

API RESTful para sistema de agendamento Mercocamp, desenvolvida em Node.js com Express e MySQL.

## 📋 Características

- ✅ **CRUD completo** para agendamentos e produtos
- 🔒 **Validações robustas** com sanitização de dados
- 📊 **Histórico de alterações** automático (campo HIST)
- 🛡️ **Middlewares de segurança** (Helmet, CORS, Rate Limiting)
- 📝 **Logs detalhados** com Winston
- 🚀 **Alta performance** com pool de conexões MySQL
- 🔧 **Configuração flexível** via variáveis de ambiente

## 🗄️ Banco de Dados

### Tabelas

#### 1. agendamento
- **ID**: varchar(50) - Chave primária
- **NUM**: tinyint - Número sequencial
- **CHNFE**: int - Chave NFe (44 dígitos)
- **CLI**: int - Código cliente
- **VOL**: int - Volume
- **DATA**: date - Data agendamento
- **STATUS**: varchar(20) - Status do agendamento
- **HIST**: json - Histórico de alterações

#### 2. produtos
- **cod_int**: varchar(50) - Código interno (chave primária)
- **cnpj_int**: varchar(14) - CNPJ interno
- **cod_forn**: varchar(50) - Código fornecedor
- **cnpj_forn**: varchar(14) - CNPJ fornecedor

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+ 
- MySQL 5.7+
- npm ou yarn

### 📦 Instalação Local

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd agenda-mercocamp-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**
```bash
# Copie as configurações
cp env.production .env

# Ou configure manualmente no arquivo .env
```

4. **Crie a pasta de logs**
```bash
mkdir logs
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 🚂 Deploy no Railway

Para deploy automático na Railway:

1. **Conecte ao Railway**
   - Acesse [railway.app](https://railway.app)
   - Conecte seu repositório GitHub
   - Deploy automático será configurado

2. **Configure as variáveis de ambiente**
   - No painel Railway, adicione as variáveis do arquivo `env.production`
   - Especialmente: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `NODE_ENV=production`

3. **Deploy automático**
   - Railway detectará o projeto Node.js automaticamente
   - Health check configurado em `/health`
   - Auto-restart em falhas

📋 **Guia completo**: Ver `RAILWAY.md` para instruções detalhadas.

## 📖 Endpoints da API

### Base URL
```
http://localhost:3000
```

### Agendamento

#### GET /table/agendamento
Lista todos os agendamentos com filtros opcionais.

**Query Parameters:**
- `limit` - Número máximo de registros (default: 100)
- `offset` - Paginação (default: 0)
- `status` - Filtrar por status (ATIVO, INATIVO, CONCLUIDO, etc.)
- `data_inicio` - Data início (YYYY-MM-DD)
- `data_fim` - Data fim (YYYY-MM-DD)
- `cli` - Código do cliente

**Exemplo:**
```bash
GET /table/agendamento?status=ATIVO&limit=50&offset=0
```

#### GET /table/agendamento/:id
Busca agendamento específico por ID.

#### POST /table/agendamento
Cria novo agendamento.

**Body (JSON):**
```json
{
  "ID": "AGE001",
  "NUM": 1,
  "CHNFE": 12345678901234567890123456789012345678901234,
  "CLI": 1001,
  "VOL": 5,
  "DATA": "2024-01-15",
  "STATUS": "ATIVO",
  "user_id": "admin"
}
```

#### PUT /table/agendamento/:id
Atualiza agendamento existente.

**Body (JSON):**
```json
{
  "STATUS": "CONCLUIDO",
  "user_id": "admin"
}
```

#### DELETE /table/agendamento/:id
Remove agendamento.

### Produtos

#### GET /table/produtos
Lista todos os produtos com filtros opcionais.

**Query Parameters:**
- `limit` - Número máximo de registros
- `offset` - Paginação
- `cnpj_int` - CNPJ interno
- `cnpj_forn` - CNPJ fornecedor
- `cod_forn` - Código fornecedor

#### GET /table/produtos/:cod_int
Busca produto por código interno.

#### POST /table/produtos
Cria novo produto.

**Body (JSON):**
```json
{
  "cod_int": "PROD001",
  "cnpj_int": "12345678000195",
  "cod_forn": "FORN001",
  "cnpj_forn": "98765432000111"
}
```

#### PUT /table/produtos/:cod_int
Atualiza produto existente.

#### DELETE /table/produtos/:cod_int
Remove produto.

### Endpoints Extras

#### GET /health
Verifica saúde da API.

#### GET /debug
Informações de debug (apenas em desenvolvimento).

#### GET /table/agendamento/stats
Estatísticas de agendamentos.

#### GET /table/produtos/stats
Estatísticas de produtos.

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `DB_HOST` | Host do banco MySQL | mercocamp.ip.odhserver.com |
| `DB_PORT` | Porta do banco MySQL | 33101 |
| `DB_USER` | Usuário do banco | - |
| `DB_PASSWORD` | Senha do banco | - |
| `DB_NAME` | Nome do banco | dbrecebimento |
| `PORT` | Porta da aplicação | 3000 |
| `NODE_ENV` | Ambiente (development/production) | development |
| `API_RATE_LIMIT` | Limite de requests por IP | 100 |
| `LOG_LEVEL` | Nível de log | info |

### Estrutura de Pastas

```
agenda-mercocamp-backend/
├── config/
│   └── database.js          # Configuração do banco
├── controllers/
│   ├── agendamentoController.js
│   └── produtoController.js
├── middlewares/
│   └── validation.js        # Validações
├── models/
│   ├── agendamento.js
│   └── produto.js
├── routes/
│   ├── agendamento.js
│   └── produto.js
├── utils/
│   └── validators.js        # Utilitários de validação
├── logs/                    # Logs da aplicação
├── package.json
├── server.js               # Servidor principal
└── README.md
```

## 🛡️ Segurança

- **Rate Limiting**: 100 requests por IP a cada 15 minutos
- **Helmet**: Headers de segurança
- **CORS**: Configurável por ambiente
- **Sanitização**: Dados limpos antes de inserção
- **Prepared Statements**: Proteção contra SQL Injection
- **Validações**: Dados validados em múltiplas camadas

## 📊 Monitoramento

### Logs
- **error.log**: Apenas erros
- **combined.log**: Todos os logs
- **Console**: Logs em tempo real

### Health Check
```bash
GET /health
```

### Debug (Desenvolvimento)
```bash
GET /debug
```

## 🔍 Validações

### Agendamento
- **ID**: Máximo 50 caracteres, alfanumérico
- **CHNFE**: Exatamente 44 dígitos
- **DATA**: Formato YYYY-MM-DD
- **STATUS**: ATIVO, INATIVO, CONCLUIDO, PENDENTE, CANCELADO
- **HIST**: JSON válido com estrutura específica

### Produtos
- **cod_int**: Máximo 50 caracteres, alfanumérico
- **cnpj_int/cnpj_forn**: 14 dígitos válidos (algoritmo CNPJ)

## 📋 Exemplos de Uso

### Criar Agendamento
```bash
curl -X POST http://localhost:3000/table/agendamento \
  -H "Content-Type: application/json" \
  -d '{
    "ID": "AGE001",
    "NUM": 1,
    "CHNFE": 12345678901234567890123456789012345678901234,
    "CLI": 1001,
    "VOL": 5,
    "DATA": "2024-01-15",
    "STATUS": "ATIVO",
    "user_id": "admin"
  }'
```

### Listar Agendamentos Ativos
```bash
curl "http://localhost:3000/table/agendamento?status=ATIVO&limit=10"
```

### Criar Produto
```bash
curl -X POST http://localhost:3000/table/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "cod_int": "PROD001",
    "cnpj_int": "12345678000195",
    "cod_forn": "FORN001",
    "cnpj_forn": "98765432000111"
  }'
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

---

**Versão:** 3.1.0  
**Data:** 2025-01-15  
**Projeto:** Mercocamp - Sistema de Agendamento 