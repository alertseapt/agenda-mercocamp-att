# 🚀 API CRUD Mercocamp v3.2.0

API RESTful completa para sistema de agendamento Mercocamp, desenvolvida em Node.js com Express, MySQL e processamento de XML de NF-e.

## 📋 Características

- ✅ **CRUD completo** para agendamentos e produtos
- ✅ **Processamento XML NF-e** com conversão para JSON
- ✅ **Múltiplos bancos de dados** (dbrecebimento, bdusuarios, dbmercocamp)
- ✅ **Gerenciamento de usuários** completo
- ✅ **Operações dinâmicas** em tabelas do dbmercocamp
- ✅ **Validações robustas** com sanitização de dados
- ✅ **Histórico de alterações** automático (campo HIST)
- ✅ **Middlewares de segurança** (Helmet, CORS, Rate Limiting)
- ✅ **Logs detalhados** com Winston
- ✅ **Alta performance** com pool de conexões MySQL
- ✅ **Deploy automatizado** no Railway
- ✅ **Documentação completa** integrada

## 🗄️ Estrutura dos Bancos de Dados

### Configuração dos Bancos
- **Host**: mercocamp.ip.odhserver.com
- **Porta**: 33101
- **Engine**: MySQL
- **Charset**: utf8mb4

### Bancos Configurados

#### 1. dbrecebimento (Banco Principal)
- **Database**: dbrecebimento
- **Propósito**: Recebimentos e agendamentos
- **Tabelas**: agendamento, produtos

#### 2. dbusuarios (Banco de Usuários)
- **Database**: dbusuarios
- **Propósito**: Gerenciamento de usuários do sistema
- **Tabelas**: usuarios

#### 3. dbmercocamp (Banco Geral)
- **Database**: dbmercocamp
- **Propósito**: Dados gerais do sistema Mercocamp
- **Tabelas**: Dinâmicas (clientes, fornecedores, produtos, etc.)

### Tabelas

#### 1. agendamento
| Campo | Tipo | Descrição |
|-------|------|-----------|
| ID | varchar(50) | Chave primária - Identificador único |
| NUM | tinyint | Número sequencial (0-255) |
| CHNFE | int | Chave NFe (44 dígitos) |
| CLI | int | Código do cliente |
| VOL | int | Volume/quantidade |
| DATA | date | Data do agendamento (YYYY-MM-DD) |
| STATUS | varchar(20) | Status (ATIVO, INATIVO, CONCLUIDO, PENDENTE, CANCELADO) |
| HIST | json | Histórico de alterações em JSON |

#### 2. produtos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| cod_int | varchar(50) | Chave primária - Código interno |
| cnpj_int | varchar(14) | CNPJ interno (14 dígitos) |
| cod_forn | varchar(50) | Código do fornecedor |
| cnpj_forn | varchar(14) | CNPJ do fornecedor (14 dígitos) |

### Tabelas do Banco dbusuarios

#### 1. usuarios
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | Chave primária auto increment |
| nome | varchar(100) | Nome completo do usuário |
| email | varchar(100) | Email único |
| senha | varchar(255) | Senha criptografada |
| tipo | varchar(50) | Tipo de usuário (admin, usuario, gerente) |
| status | varchar(20) | Status (ativo, inativo, bloqueado) |
| data_criacao | datetime | Data de criação |
| data_atualizacao | datetime | Data da última atualização |

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 16+
- MySQL 5.7+
- npm ou yarn

### Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/alertseapt/agenda-mercocamp-att.git
cd agenda-mercocamp-att

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp env.production .env

# 4. Crie pasta de logs
mkdir logs

# 5. Inicie o servidor
npm start
```

### Variáveis de Ambiente

```bash
# Banco de Dados
DB_HOST=mercocamp.ip.odhserver.com
DB_PORT=33101
DB_USER=projetos
DB_PASSWORD=masterkey
DB_NAME=dbrecebimento

# Aplicação
NODE_ENV=production
PORT=3000
API_RATE_LIMIT=100
LOG_LEVEL=info

# Segurança
JWT_SECRET=MercoCamp2024SecretKeyForJWTTokensVerySecureAndLong
```

## 🚂 Deploy no Railway

### Deploy Automático

1. **Conecte ao Railway**:
   - Acesse [railway.app](https://railway.app)
   - Conecte seu repositório GitHub
   - Deploy automático será configurado

2. **Configure as variáveis** no painel Railway

3. **Acesse sua aplicação**:
   - URL: `https://seu-app.railway.app`
   - Health: `https://seu-app.railway.app/health`
   - Docs: `https://seu-app.railway.app/`

### Deploy Manual via CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login e deploy
railway login
railway link
railway up
```

## 📡 Endpoints da API

### Base URL
```
https://seu-app.railway.app
```

### Endpoints de Sistema

#### Health Check
```
GET /health
```
**Resposta**:
```json
{
  "success": true,
  "message": "API está funcionando",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "3.1.0"
}
```

#### Documentação
```
GET /
```
Lista todos os endpoints disponíveis.

#### Debug (Desenvolvimento)
```
GET /debug
```
Informações técnicas do sistema.

### Endpoints de Agendamento

#### Listar Agendamentos
```
GET /table/agendamento
```
**Query Parameters**:
- `limit` - Número máximo de registros (default: 100)
- `offset` - Paginação (default: 0)
- `status` - Filtrar por status
- `data_inicio` - Data inicial (YYYY-MM-DD)
- `data_fim` - Data final (YYYY-MM-DD)
- `cli` - Código do cliente

**Exemplo**:
```bash
GET /table/agendamento?status=ATIVO&limit=50&offset=0
```

#### Buscar Agendamento por ID
```
GET /table/agendamento/{ID}
```

#### Criar Agendamento
```
POST /table/agendamento
```
**Body**:
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

#### Atualizar Agendamento
```
PUT /table/agendamento/{ID}
```
**Body**:
```json
{
  "STATUS": "CONCLUIDO",
  "user_id": "admin"
}
```

#### Deletar Agendamento
```
DELETE /table/agendamento/{ID}
```

#### Endpoints Extras
- `GET /table/agendamento/stats` - Estatísticas
- `GET /table/agendamento/chnfe/{CHNFE}` - Buscar por CHNFE
- `GET /table/agendamento/cliente/{CLI}` - Buscar por cliente
- `GET /table/agendamento/structure` - Estrutura da tabela

### Endpoints de Produtos

#### Listar Produtos
```
GET /table/produtos
```
**Query Parameters**:
- `limit` - Número máximo de registros
- `offset` - Paginação
- `cnpj_int` - CNPJ interno
- `cnpj_forn` - CNPJ fornecedor
- `cod_forn` - Código fornecedor

#### Buscar Produto por Código
```
GET /table/produtos/{cod_int}
```

#### Criar Produto
```
POST /table/produtos
```
**Body**:
```json
{
  "cod_int": "PROD001",
  "cnpj_int": "12345678000195",
  "cod_forn": "FORN001",
  "cnpj_forn": "98765432000111"
}
```

#### Atualizar Produto
```
PUT /table/produtos/{cod_int}
```

#### Deletar Produto
```
DELETE /table/produtos/{cod_int}
```

#### Endpoints Extras
- `GET /table/produtos/stats` - Estatísticas
- `GET /table/produtos/cnpj-interno/{cnpj_int}` - Buscar por CNPJ interno
- `GET /table/produtos/cnpj-fornecedor/{cnpj_forn}` - Buscar por CNPJ fornecedor
- `GET /table/produtos/codigo-fornecedor/{cod_forn}` - Buscar por código fornecedor
- `GET /table/produtos/search?q=termo` - Pesquisar produtos
- `GET /table/produtos/structure` - Estrutura da tabela

## 📄 Endpoints XML NF-e

### Conversão XML para JSON

#### Converter XML para JSON
```
POST /parse/xml-to-json
```
**Descrição**: Converte XML de NF-e para JSON, adicionando campos personalizados.

**Body**:
```json
{
  "xml": "<nfeProc>...</nfeProc>"
}
```

**Resposta**:
```json
{
  "success": true,
  "message": "XML convertido com sucesso",
  "data": {
    "nfeProc": {
      "NFe": {
        "infNFe": {
          "det": [
            {
              "prod": {
                "cProd": "PROD001",
                "icProd": "",
                "ixProd": "",
                "xProd": "PRODUTO TESTE 1",
                "NCM": "12345678",
                "CFOP": "5102",
                "uCom": "UN",
                "qCom": "10.0000",
                "vUnCom": "50.0000",
                "vProd": "500.00"
              }
            }
          ]
        }
      }
    }
  },
  "meta": {
    "totalProdutos": 2,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Extrair Informações Específicas
```
POST /parse/extract-info
```
**Descrição**: Extrai informações básicas da NF-e e lista de produtos simplificada.

**Resposta**:
```json
{
  "success": true,
  "message": "Informações extraídas com sucesso",
  "data": {
    "nfe": {
      "chave": "35240114200166000196550010000000011081234567",
      "numero": "1",
      "serie": "1",
      "dataEmissao": "2024-01-15T10:30:00-03:00",
      "cnpjEmitente": "14200166000196",
      "nomeEmitente": "EMPRESA TESTE LTDA",
      "valorTotal": "1000.00"
    },
    "produtos": [
      {
        "cProd": "PROD001",
        "icProd": "",
        "ixProd": "",
        "xProd": "PRODUTO TESTE 1",
        "NCM": "12345678",
        "CFOP": "5102",
        "uCom": "UN",
        "qCom": "10.0000",
        "vUnCom": "50.0000",
        "vProd": "500.00",
        "EAN": "7891234567890",
        "orig": "0"
      }
    ]
  }
}
```

#### Validar NF-e
```
POST /parse/validate-nfe
```
**Descrição**: Valida se o XML é uma NF-e válida.

**Resposta**:
```json
{
  "success": true,
  "message": "XML de NF-e válido",
  "data": {
    "valido": true,
    "chave": "35240114200166000196550010000000011081234567",
    "numero": "1",
    "emitente": "EMPRESA TESTE LTDA",
    "totalProdutos": 2
  }
}
```

### Campos Personalizados XML

#### Campos Adicionados Automaticamente
| Campo | Tipo | Descrição | Valor Padrão |
|-------|------|-----------|--------------|
| `icProd` | string | Código interno do produto | `""` (vazio) |
| `ixProd` | string | Descrição interna do produto | `""` (vazio) |

#### Campos Originais Mantidos
| Campo | Descrição |
|-------|-----------|
| `cProd` | Código do produto do fornecedor |
| `xProd` | Descrição do produto |
| `NCM` | Código NCM |
| `CFOP` | Código CFOP |
| `uCom` | Unidade comercial |
| `qCom` | Quantidade comercial |
| `vUnCom` | Valor unitário comercial |
| `vProd` | Valor total do produto |
| `cEAN` | Código EAN |
| `orig` | Origem do produto |

### Formatos de NF-e Suportados

1. **NF-e completa com protocolo**:
   ```xml
   <nfeProc>
     <NFe>
       <infNFe>...</infNFe>
     </NFe>
   </nfeProc>
   ```

2. **NF-e sem protocolo**:
   ```xml
   <NFe>
     <infNFe>...</infNFe>
   </NFe>
   ```

3. **Apenas estrutura interna**:
   ```xml
   <infNFe>...</infNFe>
   ```

## 👥 Endpoints de Usuários (dbusuarios)

### 🔐 Autenticação de Usuários

#### Login de Usuário
```
POST /usuarios/login
```
**Body**:
```json
{
  "usuario": "admin",
  "senha": "123456"
}
```
**Resposta de Sucesso**:
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "usuario": "admin",
    "senha": "123456",
    "nivel_acesso": 1,
    "cnpj": {
      "numero": "12345678000199",
      "razao_social": "EMPRESA TESTE LTDA"
    }
  }
}
```
**Resposta de Erro**:
```json
{
  "success": false,
  "message": "Usuário ou senha incorretos"
}
```

### Gerenciamento de Usuários

#### Listar Usuários
```
GET /usuarios
```
**Resposta**:
```json
{
  "success": true,
  "message": "Usuários listados com sucesso",
  "data": [
    {
      "usuario": "admin",
      "senha": "123456",
      "nivel_acesso": 1,
      "cnpj": "{\"numero\":\"12345678000199\"}"
    }
  ],
  "count": 1
}
```

#### Buscar Usuário por ID
```
GET /usuarios/{id}
```

#### Criar Usuário
```
POST /usuarios
```
**Body**:
```json
{
  "nome": "Maria Santos",
  "email": "maria@empresa.com",
  "senha": "senha123",
  "tipo": "usuario",
  "status": "ativo"
}
```

#### Atualizar Usuário
```
PUT /usuarios/{id}
```
**Body**:
```json
{
  "nome": "Maria Santos Silva",
  "email": "maria.silva@empresa.com",
  "tipo": "admin"
}
```

#### Deletar Usuário
```
DELETE /usuarios/{id}
```

#### Buscar por Tipo
```
GET /usuarios/tipo/{tipo}
```
**Tipos**: admin, usuario, gerente, etc.

#### Buscar por Status
```
GET /usuarios/status/{status}
```
**Status**: ativo, inativo, bloqueado

### Estrutura da Tabela Usuários
| Campo | Tipo | Descrição |
|-------|------|-----------|
| usuario | varchar(50) | Nome de usuário para login |
| senha | varchar(50) | Senha do usuário |
| nivel_acesso | tinyint | Nível de acesso (1=admin, 2=usuario, etc.) |
| cnpj | json | Dados do CNPJ em formato JSON |

## 🏢 Endpoints Mercocamp (dbmercocamp)

### Gerenciamento de Tabelas

#### Listar Tabelas
```
GET /mercocamp/tabelas
```
**Resposta**:
```json
{
  "success": true,
  "message": "Tabelas listadas com sucesso",
  "data": [
    { "Tables_in_dbmercocamp": "clientes" },
    { "Tables_in_dbmercocamp": "fornecedores" },
    { "Tables_in_dbmercocamp": "produtos" }
  ],
  "count": 3
}
```

#### Listar Dados de uma Tabela
```
GET /mercocamp/tabela/{nome}
```
**Query Parameters**:
- `limit` - Número máximo de registros (default: 100)
- `offset` - Paginação (default: 0)

**Exemplo**:
```bash
GET /mercocamp/tabela/clientes?limit=50&offset=0
```

#### Buscar Registro por ID
```
GET /mercocamp/tabela/{nome}/{id}
```

#### Buscar por CNPJ/CPF
```
GET /mercocamp/tabela/{nome}/cnpj/{cnpj_cpf}
```
**Exemplo**: `GET /mercocamp/tabela/wcl/cnpj/12345678000195`

#### Buscar por CNPJ/CPF na tabela `wcl`
```
GET /mercocamp/clientes/cnpj?cnpj={cnpj_cpf}
```
**Exemplo**:
- `/mercocamp/clientes/cnpj?cnpj=12.345.678/0001-95`
- `/mercocamp/clientes/cnpj?cnpj=12345678000195`

#### Inserir Dados
```
POST /mercocamp/tabela/{nome}
```
**Body**:
```json
{
  "nome": "Cliente Teste",
  "email": "cliente@teste.com",
  "telefone": "11999999999"
}
```

#### Atualizar Dados
```
PUT /mercocamp/tabela/{nome}/{id}
```
**Body**:
```json
{
  "nome": "Cliente Teste Atualizado",
  "email": "cliente.atualizado@teste.com"
}
```

#### Deletar Registro
```
DELETE /mercocamp/tabela/{nome}/{id}
```

#### Executar Query Personalizada
```
GET /mercocamp/query?sql=SELECT * FROM clientes WHERE status = 'ativo'
```
**Limitação**: Apenas queries SELECT são permitidas

#### Estrutura de uma Tabela
```
GET /mercocamp/tabela/{nome}/estrutura
```

#### Contar Registros
```
GET /mercocamp/tabela/{nome}/contar
```

## 🏢 Endpoints de Validação

### Validar CNPJ e Associação com Usuário
```
POST /validar/cnpj
```
**Descrição**: Valida um CNPJ em duas bases de dados e verifica a associação com um usuário:
1.  Verifica se o CNPJ existe como cliente na tabela `wcl`.
2.  Verifica se o CNPJ está associado ao `usuario` informado na tabela `usuarios`.

**Corpo da Requisição (JSON)**:
```json
{
  "cnpj": "12345678000195",
  "usuario": "nome_de_usuario"
}
```

**Resposta de Sucesso**:
```json
{
  "success": true,
  "message": "Validação de CNPJ e usuário concluída.",
  "data": {
    "cnpj_consultado": "12345678000195",
    "usuario_consultado": "nome_de_usuario",
    "cliente_encontrado": true,
    "usuario_encontrado": true,
    "cnpj_associado_ao_usuario": true,
    "dados_cliente": [ { ...dados da tabela wcl... } ],
    "dados_usuario": { ...dados da tabela usuarios... }
  }
}
```

## 🗄️ Endpoints de Banco de Dados

### Gerenciamento de Conexões

#### Testar Todas as Conexões
```
GET /database/test-all
```
**Resposta**:
```json
{
  "success": true,
  "message": "Todas as conexões OK",
        "data": {
        "dbrecebimento": true,
        "dbusuarios": true,
        "dbmercocamp": true
      },
  "summary": {
    "total": 3,
    "connected": 3,
    "failed": 0
  }
}
```

#### Testar Conexão Específica
```
GET /database/test/{banco}
```
**Bancos válidos**: dbrecebimento, dbusuarios, dbmercocamp

#### Informações dos Bancos
```
GET /database/info
```
**Resposta**:
```json
{
  "success": true,
  "message": "Informações dos bancos de dados",
  "data": [
    {
      "nome": "dbrecebimento",
      "descricao": "Banco principal para recebimentos",
      "connected": true,
      "status": "online"
    },
    {
      "nome": "dbusuarios",
      "descricao": "Banco para gerenciamento de usuários",
      "connected": true,
      "status": "online"
    },
    {
      "nome": "dbmercocamp",
      "descricao": "Banco geral do sistema Mercocamp",
      "connected": true,
      "status": "online"
    }
  ],
  "summary": {
    "total": 3,
    "online": 3,
    "offline": 0
  }
}
```

#### Executar Query em Banco Específico
```
GET /database/query/{banco}?sql=SELECT * FROM tabela LIMIT 10
```
**Limitação**: Apenas queries SELECT são permitidas

#### Listar Tabelas de um Banco
```
GET /database/tabelas/{banco}
```

#### Estrutura de uma Tabela
```
GET /database/estrutura/{banco}/{tabela}
```

## 🔧 Validações e Regras

### Validações de Agendamento
- **ID**: Máximo 50 caracteres, alfanumérico + _ e -
- **NUM**: Número inteiro de 0 a 255
- **CHNFE**: Exatamente 44 dígitos numéricos
- **CLI**: Número inteiro positivo
- **VOL**: Número inteiro positivo
- **DATA**: Formato YYYY-MM-DD, data válida
- **STATUS**: ATIVO, INATIVO, CONCLUIDO, PENDENTE, CANCELADO
- **HIST**: JSON válido com estrutura específica

### Validações de Produtos
- **cod_int**: Máximo 50 caracteres, alfanumérico + _ e -, único
- **cnpj_int**: 14 dígitos, CNPJ válido
- **cod_forn**: Máximo 50 caracteres, alfanumérico + _ e -
- **cnpj_forn**: 14 dígitos, CNPJ válido

### Validações de XML NF-e
- **Formato XML**: Válido e bem formado
- **Estrutura NF-e**: Elementos obrigatórios presentes
- **Produtos**: Máximo 60 caracteres para `cProd`
- **Chave de acesso**: 44 dígitos válidos
- **CNPJ**: Validação completa com algoritmo

### Limpeza Automática
- **CNPJs**: Pontos, barras e hífens removidos automaticamente
- **Strings**: Espaços extras removidos
- **Caracteres**: Sanitização contra injeção

## 🛡️ Segurança

### Middlewares de Segurança
- **Rate Limiting**: 100 requests por IP a cada 15 minutos
- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurável por ambiente
- **Sanitização**: Dados limpos antes da inserção
- **Prepared Statements**: Proteção contra SQL Injection

### Logs e Monitoramento
- **Winston**: Logs estruturados
- **Níveis**: info, warn, error
- **Arquivos**: error.log, combined.log
- **Console**: Logs em tempo real

## 🚨 Códigos de Status HTTP

| Status | Descrição |
|--------|-----------|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 400 | Dados inválidos ou campos obrigatórios faltando |
| 404 | Recurso não encontrado |
| 429 | Rate limit excedido |
| 500 | Erro interno do servidor |

### Exemplos de Erro

#### 400 - Bad Request
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    "CHNFE deve conter exatamente 44 dígitos",
    "DATA deve estar no formato YYYY-MM-DD"
  ]
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "message": "Agendamento não encontrado"
}
```

#### 429 - Rate Limit
```json
{
  "success": false,
  "message": "Muitas requisições. Tente novamente em 15 minutos."
}
```

## 📋 Exemplos Práticos

### Cenário 1: Criar Agendamento Completo

```bash
# 1. Criar agendamento
curl -X POST https://seu-app.railway.app/table/agendamento \
  -H "Content-Type: application/json" \
  -d '{
    "ID": "AGE20240115001",
    "NUM": 1,
    "CHNFE": 35240114200166000196550010000000011081234567,
    "CLI": 12345,
    "VOL": 50,
    "DATA": "2024-01-20",
    "STATUS": "ATIVO",
    "user_id": "operador01"
  }'

# 2. Verificar criação
curl https://seu-app.railway.app/table/agendamento/AGE20240115001

# 3. Atualizar status
curl -X PUT https://seu-app.railway.app/table/agendamento/AGE20240115001 \
  -H "Content-Type: application/json" \
  -d '{
    "STATUS": "CONCLUIDO",
    "user_id": "supervisor"
  }'
```

### Cenário 2: Processar XML NF-e

```bash
# 1. Converter XML para JSON
curl -X POST https://seu-app.railway.app/parse/xml-to-json \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<?xml version=\"1.0\"?><nfeProc>...</nfeProc>"
  }'

# 2. Extrair apenas informações básicas
curl -X POST https://seu-app.railway.app/parse/extract-info \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<?xml version=\"1.0\"?><nfeProc>...</nfeProc>"
  }'

# 3. Validar NF-e
curl -X POST https://seu-app.railway.app/parse/validate-nfe \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<?xml version=\"1.0\"?><nfeProc>...</nfeProc>"
  }'
```

### Cenário 3: Testar Login de Usuário

```bash
# 1. Criar usuário de teste
node scripts/criar-usuario-teste.js criar

# 2. Testar login com usuário válido
curl -X POST http://localhost:3001/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "senha": "123456"
  }'

# 3. Testar login com usuário inválido
curl -X POST http://localhost:3001/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "usuario_inexistente",
    "senha": "senha_errada"
  }'
```

### Cenário 4: Gerenciar Produtos

```bash
# 1. Listar produtos de um fornecedor
curl "https://seu-app.railway.app/table/produtos/cnpj-fornecedor/12345678000195"

# 2. Criar novo produto
curl -X POST https://seu-app.railway.app/table/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "cod_int": "NOTEBOOK001",
    "cnpj_int": "98765432000111",
    "cod_forn": "NB2024001",
    "cnpj_forn": "12345678000195"
  }'

# 3. Pesquisar produtos
curl "https://seu-app.railway.app/table/produtos/search?q=NOTEBOOK"
```

## 🔄 Integração com Frontend

### Exemplo JavaScript - Login de Usuário

```javascript
// Função para fazer login
async function fazerLogin(usuario, senha) {
  try {
    const response = await fetch('/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: usuario,
        senha: senha
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('Login realizado com sucesso:', data.data);
      
      // Salvar dados do usuário no localStorage
      localStorage.setItem('userData', JSON.stringify(data.data));
      
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
      
      return data.data;
    } else {
      console.error('Erro no login:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Erro de conexão:', error);
    return null;
  }
}

// Exemplo de uso
fazerLogin('admin', '123456');
```

### Exemplo JavaScript - Processar NF-e

```javascript
// 1. Converter XML de NF-e
const xmlContent = `<?xml version="1.0"?>
<nfeProc>
  <!-- Seu XML de NF-e aqui -->
</nfeProc>`;

const response = await fetch('/parse/xml-to-json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ xml: xmlContent })
});

const result = await response.json();

if (result.success) {
  // 2. Processar produtos com icProd e ixProd em branco
  const produtos = result.data.nfeProc.NFe.infNFe.det;
  
  produtos.forEach(produto => {
    console.log(`Fornecedor: ${produto.prod.cProd}`);
    console.log(`Interno: ${produto.prod.icProd}`);     // Vazio para preenchimento
    console.log(`Descrição: ${produto.prod.ixProd}`);   // Vazio para preenchimento
  });
  
  // 3. Salvar produtos processados
  for (const produto of produtos) {
    await fetch('/table/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cod_int: produto.prod.icProd || produto.prod.cProd,
        cnpj_int: '12345678000195',
        cod_forn: produto.prod.cProd,
        cnpj_forn: '98765432000111'
      })
    });
  }
}
```

## 📚 Documentação

### Arquivos de Documentação
- `README.md` - Documentação principal da API
- `docs/LOGIN_API.md` - Documentação completa da API de Login
- `docs/ESTRUTURA_BANCOS_DADOS.md` - Estrutura detalhada dos bancos de dados
- `docs/RESUMO_ESTRUTURA_BANCOS.md` - Resumo da estrutura dos bancos
- `docs/IMPLEMENTACAO_LOGIN.md` - Resumo da implementação da API de Login

## 🛠️ Estrutura do Projeto

```
agenda-mercocamp-backend/
├── config/
│   └── database.js              # Configuração do banco
├── controllers/
│   ├── agendamentoController.js # Controlador agendamentos
│   ├── produtoController.js     # Controlador produtos
│   └── xmlController.js         # Controlador XML NF-e
├── middlewares/
│   └── validation.js            # Middlewares de validação
├── models/
│   ├── agendamento.js           # Modelo agendamento
│   └── produto.js               # Modelo produto
├── routes/
│   ├── agendamento.js           # Rotas agendamento
│   ├── produto.js               # Rotas produto
│   ├── usuarios.js              # Rotas usuários e login
│   ├── mercocamp.js             # Rotas dbmercocamp
│   ├── database.js              # Rotas database
│   └── xml.js                   # Rotas XML
├── scripts/
│   ├── criar-usuario-teste.js   # Script para criar usuários de teste
│   ├── verificar-estrutura-bancos.js # Script para verificar estrutura
│   └── obter-dados-reais.js     # Script para obter dados reais
├── utils/
│   └── validators.js            # Utilitários de validação
├── logs/                        # Logs da aplicação
├── .gitignore                   # Arquivos ignorados pelo git
├── package.json                 # Dependências e scripts
├── server.js                    # Servidor principal
├── railway.json                 # Configuração Railway
├── Procfile                     # Processo Railway
├── env.production               # Variáveis de ambiente
├── docs/                        # Documentação (ignorada pelo git)
│   ├── LOGIN_API.md            # Documentação da API de Login
│   ├── ESTRUTURA_BANCOS_DADOS.md # Estrutura dos bancos
│   ├── RESUMO_ESTRUTURA_BANCOS.md # Resumo da estrutura
│   └── IMPLEMENTACAO_LOGIN.md  # Resumo da implementação
└── README.md                    # Esta documentação
```

## 🔍 Troubleshooting

### Problemas Comuns

#### Erro 500 - "Incorrect arguments to mysqld_stmt_execute"
**Solução**: Verificar se limit/offset são números inteiros.

#### Erro 400 - "CHNFE deve conter exatamente 44 dígitos"
**Solução**: Verificar se a chave NFe está completa.

#### Erro 400 - "DATA deve estar no formato YYYY-MM-DD"  
**Solução**: Usar formato correto com zeros à esquerda.

#### Erro 400 - "CNPJ inválido"
**Solução**: Verificar se o CNPJ tem 14 dígitos e é válido.

#### Erro 429 - Rate limit excedido
**Solução**: Aguardar 15 minutos ou implementar retry.

#### Erro 404 - Recurso não encontrado
**Solução**: Verificar se o ID/código existe na base.

### Dicas de Performance

- Use paginação para grandes consultas (limit/offset)
- Aplique filtros específicos para reduzir resultados
- Use cache local quando apropriado
- Monitore rate limits
- Valide dados no frontend antes de enviar

### Logs e Debug

```bash
# Ver logs em tempo real
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log

# Health check
curl https://seu-app.railway.app/health

# Debug (desenvolvimento)
curl https://seu-app.railway.app/debug
```

## 📊 Monitoramento

### Métricas Disponíveis

- **Health Check**: `/health`
- **Estatísticas Agendamento**: `/table/agendamento/stats`
- **Estatísticas Produtos**: `/table/produtos/stats`
- **Debug Info**: `/debug` (desenvolvimento)

### Logs Estruturados

- **Nível INFO**: Operações normais
- **Nível WARN**: Situações de atenção
- **Nível ERROR**: Erros críticos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

- **Repositório**: https://github.com/alertseapt/agenda-mercocamp-att
- **Health Check**: `GET /health`
- **Documentação**: `GET /`
- **Logs**: Disponíveis no painel Railway

---

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Versão:** 3.1.0  
**Data:** Janeiro 2024  
**Projeto:** Mercocamp - Sistema de Agendamento  
**Desenvolvido por:** Equipe Mercocamp 