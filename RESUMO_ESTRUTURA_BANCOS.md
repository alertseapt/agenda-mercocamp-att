# RESUMO DA ESTRUTURA DOS BANCOS DE DADOS
# ====================================================================
# DOCUMENTAÇÃO COMPLETA DAS TABELAS E REQUISIÇÕES
# ====================================================================

**Data da atualização:** 09/07/2025, 10:37:20  
**Servidor:** mercocamp.ip.odhserver.com:33101  
**Usuário:** projetos  

## 📊 RESUMO GERAL DOS BANCOS

| Banco | Status | Tabelas | Total de Registros | Descrição |
|-------|--------|---------|-------------------|-----------|
| **dbrecebimento** | ✅ Conectado | 2 | 0 | Banco principal para recebimentos |
| **dbusuarios** | ✅ Conectado | 1 | 0 | Banco para gerenciamento de usuários |
| **dbmercocamp** | ✅ Conectado | 10 | 60.682.852 | Banco geral do sistema Mercocamp |

**Total:** 3 bancos conectados com 13 tabelas e 60.682.852 registros

---

## 🗄️ BANCO: DBRECEBIMENTO

### Tabelas Disponíveis:

#### 1. 📋 TABELA: `agendamento`
**Campos:** 8

| Campo | Tipo | Null | Default |
|-------|------|------|---------|
| ID | int | NOT NULL | - |
| NUM | tinyint | NOT NULL | - |
| CHNFE | int | NOT NULL | - |
| CLI | int | NOT NULL | - |
| VOL | int | NOT NULL | - |
| DATA | date | NOT NULL | - |
| STATUS | varchar(20) | NOT NULL | SOLICITADO |
| HIST | json | NOT NULL | - |

**Requisições:**
```http
# Listar todos os agendamentos
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `agendamento`

# Contar total de agendamentos
GET /api/database/query/dbrecebimento?sql=SELECT COUNT(*) as total FROM `agendamento`

# Buscar agendamento por ID
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `agendamento` WHERE ID = 1

# Agendamentos por status
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `agendamento` WHERE STATUS = 'SOLICITADO'
```

#### 2. 📋 TABELA: `produtos`
**Campos:** 4

| Campo | Tipo | Null | Default |
|-------|------|------|---------|
| cod_int | varchar(50) | NOT NULL | '' |
| cnpj_int | varchar(14) | NOT NULL | '' |
| cod_forn | varchar(50) | NOT NULL | '' |
| cnpj_forn | varchar(14) | NOT NULL | '' |

**Requisições:**
```http
# Listar todos os produtos
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `produtos`

# Contar total de produtos
GET /api/database/query/dbrecebimento?sql=SELECT COUNT(*) as total FROM `produtos`

# Buscar produto por código interno
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `produtos` WHERE cod_int = 'CODIGO123'
```

---

## 👥 BANCO: DBUSUARIOS

### Tabelas Disponíveis:

#### 1. 📋 TABELA: `usuarios`
**Campos:** 4

| Campo | Tipo | Null | Default |
|-------|------|------|---------|
| usuario | varchar(50) | NULL | - |
| senha | varchar(50) | NULL | - |
| nivel_acesso | tinyint | NULL | - |
| cnpj | json | NULL | - |

**Requisições:**
```http
# Listar todos os usuários
GET /api/database/query/dbusuarios?sql=SELECT * FROM `usuarios`

# Contar total de usuários
GET /api/database/query/dbusuarios?sql=SELECT COUNT(*) as total FROM `usuarios`

# Buscar usuário específico
GET /api/database/query/dbusuarios?sql=SELECT * FROM `usuarios` WHERE usuario = 'admin'

# Usuários por nível de acesso
GET /api/database/query/dbusuarios?sql=SELECT * FROM `usuarios` WHERE nivel_acesso = 1
```

---

## 🏢 BANCO: DBMERCOCAMP

### Tabelas Disponíveis:

#### 1. 📋 TABELA: `wbx` (Movimentações)
**Campos:** 18

| Campo | Tipo | Null | Default |
|-------|------|------|---------|
| dt_mov | date | NULL | - |
| dt_mov_real | datetime | NULL | - |
| no_seq | varchar(20) | NOT NULL | - |
| tipo | varchar(50) | NULL | - |
| dev | varchar(10) | NULL | - |
| nome_cliente | varchar(100) | NULL | - |
| no_cli | varchar(100) | NULL | - |
| no_nf_cli | varchar(20) | NULL | - |
| sr | varchar(10) | NULL | - |
| dt_emi | date | NULL | - |
| no_ped_cli | varchar(50) | NULL | - |
| no_dp | varchar(50) | NOT NULL | - |
| qt_skus | float | NULL | - |
| qt_merc | float | NULL | - |
| vl_cus_entr | decimal(20,6) | NULL | - |
| vl_cus_sai | decimal(20,6) | NULL | - |
| vl_nf_sai | decimal(20,6) | NULL | - |
| obs | text | NULL | - |

**Requisições:**
```http
# Listar todas as movimentações
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wbx`

# Movimentações por tipo
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wbx` WHERE tipo = 'Entrada'

# Movimentações por data
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wbx` WHERE dt_mov >= '2023-01-01'

# Total de movimentações
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wbx`
```

#### 2. 📋 TABELA: `wcl` (Clientes)
**Campos:** 20

| Campo | Tipo | Null | Default |
|-------|------|------|---------|
| nome_cliente | varchar(255) | NULL | - |
| nome_reduzido | varchar(150) | NULL | - |
| no_seq | varchar(10) | NOT NULL | - |
| cnpj_cpf | varchar(20) | NULL | - |
| situacao | varchar(20) | NULL | - |
| tipo | varchar(30) | NULL | - |
| tipo_retorno | varchar(30) | NULL | - |
| rs | varchar(50) | NULL | - |
| rsi | varchar(50) | NULL | - |
| rf | varchar(50) | NULL | - |
| rn | varchar(50) | NULL | - |
| rs_d1 | varchar(50) | NULL | - |
| fq | varchar(50) | NULL | - |
| nao_vu | varchar(50) | NULL | - |
| gu | varchar(50) | NULL | - |
| fp | varchar(50) | NULL | - |
| fi | varchar(50) | NULL | - |
| dd_venc | varchar(50) | NULL | - |
| dd_per | varchar(50) | NULL | - |
| sp | varchar(50) | NULL | - |

**Requisições:**
```http
# Listar todos os clientes
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wcl`

# Buscar cliente por nome
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wcl` WHERE nome_cliente LIKE '%Kubbo%'

# Clientes ativos
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wcl` WHERE situacao = 'ATIVO'

# Total de clientes
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wcl`
```

#### 3. 📋 TABELA: `wdq` (Dados de Qualidade)
**Campos:** 15

**Requisições:**
```http
# Listar dados de qualidade
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wdq`

# Total de registros
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wdq`
```

#### 4. 📋 TABELA: `wf1` (Faturamento 1)
**Campos:** 25

**Requisições:**
```http
# Listar faturamento
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wf1`

# Faturamento por período
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wf1` WHERE dt_emi >= '2023-01-01'
```

#### 5. 📋 TABELA: `wgu` (Gestão de Usuários)
**Campos:** 12

**Requisições:**
```http
# Listar gestão de usuários
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wgu`

# Usuários ativos
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wgu` WHERE status = 'ATIVO'
```

#### 6. 📋 TABELA: `whp` (Histórico de Preços)
**Campos:** 8

**Requisições:**
```http
# Listar histórico de preços
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `whp`

# Preços por produto
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `whp` WHERE cod_produto = '123'
```

#### 7. 📋 TABELA: `wjs` (JSON Storage)
**Campos:** 3

**Requisições:**
```http
# Listar dados JSON
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wjs`
```

#### 8. 📋 TABELA: `wkl` (Logs)
**Campos:** 6

**Requisições:**
```http
# Listar logs
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wkl`

# Logs por data
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wkl` WHERE dt_log >= '2023-01-01'
```

#### 9. 📋 TABELA: `wkx` (Dados Extras)
**Campos:** 10

**Requisições:**
```http
# Listar dados extras
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wkx`
```

#### 10. 📋 TABELA: `wua` (Usuários Avançados)
**Campos:** 15

**Requisições:**
```http
# Listar usuários avançados
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wua`

# Usuários por perfil
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wua` WHERE perfil = 'ADMIN'
```

---

## 🌐 ROTAS DISPONÍVEIS

### Teste de Conexões
```http
GET /api/database/test-all
```

### Informações dos Bancos
```http
GET /api/database/info
```

### Teste de Banco Específico
```http
GET /api/database/test/dbrecebimento
GET /api/database/test/dbusuarios
GET /api/database/test/dbmercocamp
```

### Listar Tabelas de um Banco
```http
GET /api/database/tabelas/dbrecebimento
GET /api/database/tabelas/dbusuarios
GET /api/database/tabelas/dbmercocamp
```

### Estrutura de uma Tabela
```http
GET /api/database/estrutura/dbrecebimento/agendamento
GET /api/database/estrutura/dbusuarios/usuarios
GET /api/database/estrutura/dbmercocamp/wbx
```

### Executar Query Personalizada
```http
GET /api/database/query/dbrecebimento?sql=SELECT * FROM agendamento WHERE STATUS = 'SOLICITADO'
GET /api/database/query/dbusuarios?sql=SELECT * FROM usuarios WHERE nivel_acesso = 1
GET /api/database/query/dbmercocamp?sql=SELECT * FROM wbx WHERE tipo = 'Entrada' LIMIT 10
```

---

## 📝 EXEMPLOS DE RESPOSTAS

### Resposta de Sucesso
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbrecebimento",
  "data": [
    {
      "ID": 1,
      "NUM": 1,
      "CHNFE": 123456,
      "CLI": 100,
      "VOL": 1,
      "DATA": "2023-12-01",
      "STATUS": "SOLICITADO",
      "HIST": "{\"action\": \"created\"}"
    }
  ],
  "count": 1
}
```

### Resposta de Erro
```json
{
  "success": false,
  "message": "Erro ao executar query",
  "database": "dbrecebimento",
  "error": "Table 'tabela_inexistente' doesn't exist"
}
```

---

## 📊 ESTATÍSTICAS DOS BANCOS

| Banco | Tabelas | Campos Totais | Total de Registros | Principais Funcionalidades |
|-------|---------|---------------|-------------------|---------------------------|
| **dbrecebimento** | 2 | 12 | 0 | Agendamentos e Produtos |
| **dbusuarios** | 1 | 4 | 0 | Gestão de Usuários |
| **dbmercocamp** | 10 | 185 | 60.682.852 | Sistema Geral Mercocamp |

**Total:** 13 tabelas com 201 campos e 60.682.852 registros

---

## 🔧 CONFIGURAÇÃO

- **Host:** mercocamp.ip.odhserver.com
- **Porta:** 33101
- **Usuário:** projetos
- **Bancos:** dbrecebimento, dbusuarios, dbmercocamp

---

## 📝 OBSERVAÇÕES IMPORTANTES

1. **Segurança:** Apenas queries SELECT são permitidas via API
2. **Limite:** Recomenda-se usar LIMIT nas consultas para evitar sobrecarga
3. **Performance:** Use índices apropriados para consultas frequentes
4. **Backup:** Sempre faça backup antes de alterações estruturais
5. **Monitoramento:** Monitore o uso das APIs para otimização

---

## 📊 DADOS REAIS DAS TABELAS

### Bancos com Dados:
- **dbmercocamp:** 9 de 10 tabelas com dados (60.682.852 registros totais)

### Principais Tabelas com Dados:
- **wkl (Logs):** 44.385.753 registros
- **wkx (Dados Extras):** 13.796.561 registros  
- **wgu (Gestão de Usuários):** 1.321.574 registros
- **wbx (Movimentações):** 810.724 registros
- **wdq (Dados de Qualidade):** 227.515 registros
- **wjs (JSON Storage):** 82.483 registros
- **whp (Histórico de Preços):** 48.437 registros
- **wua (Usuários Avançados):** 9.211 registros
- **wcl (Clientes):** 594 registros

### Bancos sem Dados:
- **dbrecebimento:** 0 registros (tabelas vazias)
- **dbusuarios:** 0 registros (tabelas vazias)

## 📄 DOCUMENTAÇÃO COMPLETA

Para a documentação completa com todos os detalhes das tabelas, exemplos de dados reais e estruturas completas, consulte o arquivo: **ESTRUTURA_BANCOS_DADOS.md** 