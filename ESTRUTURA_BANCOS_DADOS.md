# DOCUMENTAÇÃO ATUALIZADA DOS BANCOS DE DADOS
# ====================================================================
# ESTRUTURA DAS TABELAS E EXEMPLOS DE REQUISIÇÕES COM DADOS REAIS
# ====================================================================

Data da atualização: 09/07/2025, 10:37:20
Servidor: mercocamp.ip.odhserver.com:33101
Usuário: projetos

## 📊 RESUMO GERAL DOS BANCOS

| Banco | Tabelas | Total de Registros | Status |
|-------|---------|-------------------|--------|
| **dbrecebimento** | 2 | 0 | ✅ Conectado |
| **dbusuarios** | 1 | 0 | ✅ Conectado |
| **dbmercocamp** | 10 | 60682852 | ✅ Conectado |

**Total:** 3 bancos, 13 tabelas

## 📊 BANCO: DBRECEBIMENTO
Status: ✅ Conectado

**Total de tabelas:** 2

### 📋 TABELA: agendamento
**Campos:** 8
**Total de registros:** 0
**Tem dados:** ❌ Não

#### Estrutura da Tabela:
```
ID                   int                  NOT NULL   
NUM                  tinyint              NOT NULL   
CHNFE                int                  NOT NULL   
CLI                  int                  NOT NULL   
VOL                  int                  NOT NULL   
DATA                 date                 NOT NULL   
STATUS               varchar(20)          NOT NULL   DEFAULT SOLICITADO
HIST                 json                 NOT NULL   
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `agendamento`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbrecebimento?sql=SELECT COUNT(*) as total FROM `agendamento`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `agendamento` LIMIT 10
```

#### Exemplo de Resposta (Tabela vazia):
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbrecebimento",
  "data": [],
  "count": 0
}
```

#### Observação:
Esta tabela não possui dados no momento.

---

### 📋 TABELA: produtos
**Campos:** 4
**Total de registros:** 0
**Tem dados:** ❌ Não

#### Estrutura da Tabela:
```
cod_int              varchar(50)          NOT NULL   DEFAULT 
cnpj_int             varchar(14)          NOT NULL   DEFAULT 
cod_forn             varchar(50)          NOT NULL   DEFAULT 
cnpj_forn            varchar(14)          NOT NULL   DEFAULT 
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `produtos`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbrecebimento?sql=SELECT COUNT(*) as total FROM `produtos`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbrecebimento?sql=SELECT * FROM `produtos` LIMIT 10
```

#### Exemplo de Resposta (Tabela vazia):
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbrecebimento",
  "data": [],
  "count": 0
}
```

#### Observação:
Esta tabela não possui dados no momento.

---

## 📊 BANCO: DBUSUARIOS
Status: ✅ Conectado

**Total de tabelas:** 1

### 📋 TABELA: usuarios
**Campos:** 4
**Total de registros:** 0
**Tem dados:** ❌ Não

#### Estrutura da Tabela:
```
usuario              varchar(50)          NULL       
senha                varchar(50)          NULL       
nivel_acesso         tinyint              NULL       
cnpj                 json                 NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbusuarios?sql=SELECT * FROM `usuarios`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbusuarios?sql=SELECT COUNT(*) as total FROM `usuarios`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbusuarios?sql=SELECT * FROM `usuarios` LIMIT 10
```

#### Exemplo de Resposta (Tabela vazia):
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbusuarios",
  "data": [],
  "count": 0
}
```

#### Observação:
Esta tabela não possui dados no momento.

---

## 📊 BANCO: DBMERCOCAMP
Status: ✅ Conectado

**Total de tabelas:** 10

### 📋 TABELA: wbx
**Campos:** 18
**Total de registros:** 810724
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
dt_mov               date                 NULL       
dt_mov_real          datetime             NULL       
no_seq               varchar(20)          NOT NULL   
tipo                 varchar(50)          NULL       
dev                  varchar(10)          NULL       
nome_cliente         varchar(100)         NULL       
no_cli               varchar(100)         NULL       
no_nf_cli            varchar(20)          NULL       
sr                   varchar(10)          NULL       
dt_emi               date                 NULL       
no_ped_cli           varchar(50)          NULL       
no_dp                varchar(50)          NOT NULL   
qt_skus              float                NULL       
qt_merc              float                NULL       
vl_cus_entr          decimal(20,6)        NULL       
vl_cus_sai           decimal(20,6)        NULL       
vl_nf_sai            decimal(20,6)        NULL       
obs                  text                 NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wbx`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wbx`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wbx` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "dt_mov": null,
    "dt_mov_real": null,
    "no_seq": "",
    "tipo": null,
    "dev": null,
    "nome_cliente": null,
    "no_cli": null,
    "no_nf_cli": null,
    "sr": null,
    "dt_emi": null,
    "no_ped_cli": null,
    "no_dp": "",
    "qt_skus": 25040,
    "qt_merc": 3190056,
    "vl_cus_entr": "9024195.220000",
    "vl_cus_sai": "12189147.880000",
    "vl_nf_sai": "24333048.680000",
    "obs": null
  },
  {
    "dt_mov": "2022-10-31T03:00:00.000Z",
    "dt_mov_real": "2022-10-31T12:55:00.000Z",
    "no_seq": "1.064.562",
    "tipo": "Entrada",
    "dev": null,
    "nome_cliente": "Kubbo Comercial Eireli (RMA)",
    "no_cli": "131",
    "no_nf_cli": "139.984",
    "sr": "MC",
    "dt_emi": "2020-12-29T03:00:00.000Z",
    "no_ped_cli": "23389397000231",
    "no_dp": "1.052.296",
    "qt_skus": 1,
    "qt_merc": 1,
    "vl_cus_entr": "139.900000",
    "vl_cus_sai": null,
    "vl_nf_sai": null,
    "obs": null
  },
  {
    "dt_mov": "2023-10-17T03:00:00.000Z",
    "dt_mov_real": "2023-10-17T13:38:00.000Z",
    "no_seq": "1.109.360",
    "tipo": "Entrada",
    "dev": null,
    "nome_cliente": "Kubbo Comercial Eireli (RMA)",
    "no_cli": "131",
    "no_nf_cli": "200.963",
    "sr": "MC",
    "dt_emi": "2021-01-20T03:00:00.000Z",
    "no_ped_cli": "23389397000312",
    "no_dp": "1.096.759",
    "qt_skus": 1,
    "qt_merc": 1,
    "vl_cus_entr": "79.900000",
    "vl_cus_sai": null,
    "vl_nf_sai": null,
    "obs": null
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "dt_mov": null,
    "dt_mov_real": null,
    "no_seq": "",
    "tipo": null,
    "dev": null,
    "nome_cliente": null,
    "no_cli": null,
    "no_nf_cli": null,
    "sr": null,
    "dt_emi": null,
    "no_ped_cli": null,
    "no_dp": "",
    "qt_skus": 25040,
    "qt_merc": 3190056,
    "vl_cus_entr": "9024195.220000",
    "vl_cus_sai": "12189147.880000",
    "vl_nf_sai": "24333048.680000",
    "obs": null
  },
  {
    "dt_mov": "2022-10-31T03:00:00.000Z",
    "dt_mov_real": "2022-10-31T12:55:00.000Z",
    "no_seq": "1.064.562",
    "tipo": "Entrada",
    "dev": null,
    "nome_cliente": "Kubbo Comercial Eireli (RMA)",
    "no_cli": "131",
    "no_nf_cli": "139.984",
    "sr": "MC",
    "dt_emi": "2020-12-29T03:00:00.000Z",
    "no_ped_cli": "23389397000231",
    "no_dp": "1.052.296",
    "qt_skus": 1,
    "qt_merc": 1,
    "vl_cus_entr": "139.900000",
    "vl_cus_sai": null,
    "vl_nf_sai": null,
    "obs": null
  },
  {
    "dt_mov": "2023-10-17T03:00:00.000Z",
    "dt_mov_real": "2023-10-17T13:38:00.000Z",
    "no_seq": "1.109.360",
    "tipo": "Entrada",
    "dev": null,
    "nome_cliente": "Kubbo Comercial Eireli (RMA)",
    "no_cli": "131",
    "no_nf_cli": "200.963",
    "sr": "MC",
    "dt_emi": "2021-01-20T03:00:00.000Z",
    "no_ped_cli": "23389397000312",
    "no_dp": "1.096.759",
    "qt_skus": 1,
    "qt_merc": 1,
    "vl_cus_entr": "79.900000",
    "vl_cus_sai": null,
    "vl_nf_sai": null,
    "obs": null
  }
]
```

---

### 📋 TABELA: wcl
**Campos:** 20
**Total de registros:** 594
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
nome_cliente         varchar(255)         NULL       
nome_reduzido        varchar(150)         NULL       
no_seq               varchar(10)          NOT NULL   
cnpj_cpf             varchar(20)          NULL       
situacao             varchar(20)          NULL       
tipo                 varchar(30)          NULL       
tipo_retorno         varchar(30)          NULL       
rs                   varchar(50)          NULL       
rsi                  varchar(50)          NULL       
rf                   varchar(50)          NULL       
rn                   varchar(50)          NULL       
rs_d1                varchar(50)          NULL       
fq                   varchar(50)          NULL       
nao_vu               varchar(50)          NULL       
gu                   varchar(50)          NULL       
fp                   varchar(50)          NULL       
fi                   varchar(50)          NULL       
dd_venc              varchar(50)          NULL       
dd_per               varchar(50)          NULL       
sp                   varchar(50)          NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wcl`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wcl`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wcl` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "nome_cliente": "Metaltex",
    "nome_reduzido": "Metaltex",
    "no_seq": "1",
    "cnpj_cpf": "60.864.428/0008-80",
    "situacao": "Inativo",
    "tipo": "Externo",
    "tipo_retorno": "Nenhum",
    "rs": "",
    "rsi": "",
    "rf": "",
    "rn": "X",
    "rs_d1": "",
    "fq": "X",
    "nao_vu": "",
    "gu": "X",
    "fp": "X",
    "fi": "X",
    "dd_venc": "15",
    "dd_per": "0",
    "sp": ""
  },
  {
    "nome_cliente": "GTA Distribuidora",
    "nome_reduzido": "GTA Distribuidora",
    "no_seq": "100",
    "cnpj_cpf": "20.584.305/0001-03",
    "situacao": "Inativo",
    "tipo": "Estabelecido",
    "tipo_retorno": "Nenhum",
    "rs": "",
    "rsi": "",
    "rf": "",
    "rn": "X",
    "rs_d1": "",
    "fq": "",
    "nao_vu": "",
    "gu": "X",
    "fp": "X",
    "fi": "X",
    "dd_venc": "999",
    "dd_per": "15",
    "sp": ""
  },
  {
    "nome_cliente": "Polar Componentes e Sistemas Off-Shore",
    "nome_reduzido": "Polar Componentes e Sistemas Off-Shore",
    "no_seq": "101",
    "cnpj_cpf": "39.222.187/0002-94",
    "situacao": "Ativo",
    "tipo": "Estabelecido",
    "tipo_retorno": "Nenhum",
    "rs": "",
    "rsi": "",
    "rf": "",
    "rn": "X",
    "rs_d1": "",
    "fq": "",
    "nao_vu": "",
    "gu": "X",
    "fp": "X",
    "fi": "X",
    "dd_venc": "999",
    "dd_per": "999",
    "sp": ""
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "nome_cliente": "Metaltex",
    "nome_reduzido": "Metaltex",
    "no_seq": "1",
    "cnpj_cpf": "60.864.428/0008-80",
    "situacao": "Inativo",
    "tipo": "Externo",
    "tipo_retorno": "Nenhum",
    "rs": "",
    "rsi": "",
    "rf": "",
    "rn": "X",
    "rs_d1": "",
    "fq": "X",
    "nao_vu": "",
    "gu": "X",
    "fp": "X",
    "fi": "X",
    "dd_venc": "15",
    "dd_per": "0",
    "sp": ""
  },
  {
    "nome_cliente": "GTA Distribuidora",
    "nome_reduzido": "GTA Distribuidora",
    "no_seq": "100",
    "cnpj_cpf": "20.584.305/0001-03",
    "situacao": "Inativo",
    "tipo": "Estabelecido",
    "tipo_retorno": "Nenhum",
    "rs": "",
    "rsi": "",
    "rf": "",
    "rn": "X",
    "rs_d1": "",
    "fq": "",
    "nao_vu": "",
    "gu": "X",
    "fp": "X",
    "fi": "X",
    "dd_venc": "999",
    "dd_per": "15",
    "sp": ""
  },
  {
    "nome_cliente": "Polar Componentes e Sistemas Off-Shore",
    "nome_reduzido": "Polar Componentes e Sistemas Off-Shore",
    "no_seq": "101",
    "cnpj_cpf": "39.222.187/0002-94",
    "situacao": "Ativo",
    "tipo": "Estabelecido",
    "tipo_retorno": "Nenhum",
    "rs": "",
    "rsi": "",
    "rf": "",
    "rn": "X",
    "rs_d1": "",
    "fq": "",
    "nao_vu": "",
    "gu": "X",
    "fp": "X",
    "fi": "X",
    "dd_venc": "999",
    "dd_per": "999",
    "sp": ""
  }
]
```

---

### 📋 TABELA: wdq
**Campos:** 17
**Total de registros:** 227515
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
dt_mov               date                 NULL       
no_seq               varchar(20)          NULL       
situacao             varchar(50)          NULL       
sit_fase             varchar(50)          NULL       
m                    varchar(5)           NULL       
no_nf_cli            varchar(20)          NULL       
sr                   varchar(10)          NULL       
dt_nf                date                 NULL       
no_ped_cli           varchar(50)          NULL       
nf_retorno           varchar(50)          NULL       
tipo_retorno         varchar(50)          NULL       
nome_cliente         varchar(100)         NULL       
no_seq_2             varchar(20)          NULL       
no_dp                varchar(20)          NOT NULL   
rep                  varchar(10)          NULL       
observacao_resumida  text                 NULL       
vl_nf                decimal(15,2)        NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wdq`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wdq`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wdq` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "dt_mov": "2025-03-27T03:00:00.000Z",
    "no_seq": "3.256.693",
    "situacao": "Fechado",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "no_nf_cli": "1.593",
    "sr": "1",
    "dt_nf": "2022-10-04T03:00:00.000Z",
    "no_ped_cli": "SDIA023-10240",
    "nf_retorno": null,
    "tipo_retorno": "Simbólico",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_seq_2": "262",
    "no_dp": "3.213.888",
    "rep": null,
    "observacao_resumida": "MERCOCAMP-SDIA023-10240",
    "vl_nf": null
  },
  {
    "dt_mov": "2025-03-27T03:00:00.000Z",
    "no_seq": "3.256.769",
    "situacao": "Fechado",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "no_nf_cli": "1.594",
    "sr": "1",
    "dt_nf": "2022-10-04T03:00:00.000Z",
    "no_ped_cli": "10241",
    "nf_retorno": null,
    "tipo_retorno": "Simbólico",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_seq_2": "262",
    "no_dp": "3.214.005",
    "rep": null,
    "observacao_resumida": "MERCOCAMP - 10241",
    "vl_nf": null
  },
  {
    "dt_mov": "2025-03-27T03:00:00.000Z",
    "no_seq": "3.256.777",
    "situacao": "Fechado",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "no_nf_cli": "1.595",
    "sr": "1",
    "dt_nf": "2022-10-04T03:00:00.000Z",
    "no_ped_cli": "10242",
    "nf_retorno": null,
    "tipo_retorno": "Simbólico",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_seq_2": "262",
    "no_dp": "3.214.010",
    "rep": null,
    "observacao_resumida": "MERCOCAMP - 10242",
    "vl_nf": null
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "dt_mov": "2025-03-27T03:00:00.000Z",
    "no_seq": "3.256.693",
    "situacao": "Fechado",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "no_nf_cli": "1.593",
    "sr": "1",
    "dt_nf": "2022-10-04T03:00:00.000Z",
    "no_ped_cli": "SDIA023-10240",
    "nf_retorno": null,
    "tipo_retorno": "Simbólico",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_seq_2": "262",
    "no_dp": "3.213.888",
    "rep": null,
    "observacao_resumida": "MERCOCAMP-SDIA023-10240",
    "vl_nf": null
  },
  {
    "dt_mov": "2025-03-27T03:00:00.000Z",
    "no_seq": "3.256.769",
    "situacao": "Fechado",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "no_nf_cli": "1.594",
    "sr": "1",
    "dt_nf": "2022-10-04T03:00:00.000Z",
    "no_ped_cli": "10241",
    "nf_retorno": null,
    "tipo_retorno": "Simbólico",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_seq_2": "262",
    "no_dp": "3.214.005",
    "rep": null,
    "observacao_resumida": "MERCOCAMP - 10241",
    "vl_nf": null
  },
  {
    "dt_mov": "2025-03-27T03:00:00.000Z",
    "no_seq": "3.256.777",
    "situacao": "Fechado",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "no_nf_cli": "1.595",
    "sr": "1",
    "dt_nf": "2022-10-04T03:00:00.000Z",
    "no_ped_cli": "10242",
    "nf_retorno": null,
    "tipo_retorno": "Simbólico",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_seq_2": "262",
    "no_dp": "3.214.010",
    "rep": null,
    "observacao_resumida": "MERCOCAMP - 10242",
    "vl_nf": null
  }
]
```

---

### 📋 TABELA: wf1
**Campos:** 5
**Total de registros:** 0
**Tem dados:** ❌ Não

#### Estrutura da Tabela:
```
id                   varchar(10)          NULL       
dt_mov               date                 NULL       
qt_servico           decimal(20,2)        NULL       
vl_tarifa            decimal(20,2)        NULL       
vl_servico           decimal(20,2)        NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wf1`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wf1`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wf1` LIMIT 10
```

#### Exemplo de Resposta (Tabela vazia):
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [],
  "count": 0
}
```

#### Observação:
Esta tabela não possui dados no momento.

---

### 📋 TABELA: wgu
**Campos:** 28
**Total de registros:** 1321574
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
no_dp                varchar(20)          NOT NULL   
estab                varchar(10)          NULL       
cliente              varchar(100)         NULL       
obs_resumida         varchar(255)         NULL       
no_ped_cli           varchar(50)          NULL       
sku                  varchar(50)          NULL       
qt_tot               float                NULL       
f                    varchar(5)           NULL       
dt_incl_sla          datetime             NULL       
prior                varchar(50)          NULL       
n                    varchar(5)           NULL       
dt_reserva           datetime             NULL       
pct_rom              decimal(6,2)         NULL       
no_nf                varchar(30)          NULL       
sit_fase             varchar(30)          NULL       
m                    varchar(5)           NULL       
b                    varchar(5)           NULL       
c                    varchar(5)           NULL       
pct_sep              decimal(6,2)         NULL       
pct_cko              decimal(6,2)         NULL       
pct_vol              decimal(6,2)         NULL       
a                    varchar(5)           NULL       
dt_conf_sep          datetime             NULL       
dt_conf_nf           datetime             NULL       
transportadora       varchar(100)         NULL       
destinatario         varchar(100)         NULL       
doca                 varchar(20)          NULL       
vols                 float                NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wgu`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wgu`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wgu` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "no_dp": "2.056.655",
    "estab": "ML",
    "cliente": "P.A.S. ImportaÃ§Ã£o e ExportaÃ§Ã£o Ltda.- EPP",
    "obs_resumida": "Ped.: N.F. 5409 - 1",
    "no_ped_cli": "N.F. 5409 - 1",
    "sku": "1",
    "qt_tot": 1,
    "f": null,
    "dt_incl_sla": "2022-01-01T04:06:00.000Z",
    "prior": null,
    "n": null,
    "dt_reserva": "2022-01-01T04:09:00.000Z",
    "pct_rom": "100.00",
    "no_nf": "5.409",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "b": null,
    "c": null,
    "pct_sep": null,
    "pct_cko": "100.00",
    "pct_vol": "100.00",
    "a": "X",
    "dt_conf_sep": "2022-01-03T17:05:00.000Z",
    "dt_conf_nf": null,
    "transportadora": "CARGO BR",
    "destinatario": null,
    "doca": null,
    "vols": 1
  },
  {
    "no_dp": "2.056.656",
    "estab": "ML",
    "cliente": "Kubbo Comercial Eireli",
    "obs_resumida": "Ped.: 109719890601",
    "no_ped_cli": "109719890601",
    "sku": "1",
    "qt_tot": 1,
    "f": null,
    "dt_incl_sla": "2022-01-01T04:17:00.000Z",
    "prior": null,
    "n": null,
    "dt_reserva": "2022-01-01T04:14:00.000Z",
    "pct_rom": "100.00",
    "no_nf": "369.825",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "b": null,
    "c": null,
    "pct_sep": null,
    "pct_cko": "100.00",
    "pct_vol": "100.00",
    "a": "X",
    "dt_conf_sep": "2022-01-03T00:52:00.000Z",
    "dt_conf_nf": null,
    "transportadora": "Direct Express Logistica Integrada S/A",
    "destinatario": null,
    "doca": null,
    "vols": 1
  },
  {
    "no_dp": "2.056.657",
    "estab": "ML",
    "cliente": "Kubbo Comercial Eireli",
    "obs_resumida": "Ped.: 291612014601",
    "no_ped_cli": "291612014601",
    "sku": "1",
    "qt_tot": 1,
    "f": null,
    "dt_incl_sla": "2022-01-01T04:15:00.000Z",
    "prior": null,
    "n": null,
    "dt_reserva": "2022-01-01T04:14:00.000Z",
    "pct_rom": "100.00",
    "no_nf": "369.789",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "b": null,
    "c": null,
    "pct_sep": null,
    "pct_cko": "100.00",
    "pct_vol": "100.00",
    "a": "X",
    "dt_conf_sep": "2022-01-03T20:10:00.000Z",
    "dt_conf_nf": null,
    "transportadora": "Direct Express Logistica Integrada S/A",
    "destinatario": null,
    "doca": null,
    "vols": 1
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "no_dp": "2.056.655",
    "estab": "ML",
    "cliente": "P.A.S. ImportaÃ§Ã£o e ExportaÃ§Ã£o Ltda.- EPP",
    "obs_resumida": "Ped.: N.F. 5409 - 1",
    "no_ped_cli": "N.F. 5409 - 1",
    "sku": "1",
    "qt_tot": 1,
    "f": null,
    "dt_incl_sla": "2022-01-01T04:06:00.000Z",
    "prior": null,
    "n": null,
    "dt_reserva": "2022-01-01T04:09:00.000Z",
    "pct_rom": "100.00",
    "no_nf": "5.409",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "b": null,
    "c": null,
    "pct_sep": null,
    "pct_cko": "100.00",
    "pct_vol": "100.00",
    "a": "X",
    "dt_conf_sep": "2022-01-03T17:05:00.000Z",
    "dt_conf_nf": null,
    "transportadora": "CARGO BR",
    "destinatario": null,
    "doca": null,
    "vols": 1
  },
  {
    "no_dp": "2.056.656",
    "estab": "ML",
    "cliente": "Kubbo Comercial Eireli",
    "obs_resumida": "Ped.: 109719890601",
    "no_ped_cli": "109719890601",
    "sku": "1",
    "qt_tot": 1,
    "f": null,
    "dt_incl_sla": "2022-01-01T04:17:00.000Z",
    "prior": null,
    "n": null,
    "dt_reserva": "2022-01-01T04:14:00.000Z",
    "pct_rom": "100.00",
    "no_nf": "369.825",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "b": null,
    "c": null,
    "pct_sep": null,
    "pct_cko": "100.00",
    "pct_vol": "100.00",
    "a": "X",
    "dt_conf_sep": "2022-01-03T00:52:00.000Z",
    "dt_conf_nf": null,
    "transportadora": "Direct Express Logistica Integrada S/A",
    "destinatario": null,
    "doca": null,
    "vols": 1
  },
  {
    "no_dp": "2.056.657",
    "estab": "ML",
    "cliente": "Kubbo Comercial Eireli",
    "obs_resumida": "Ped.: 291612014601",
    "no_ped_cli": "291612014601",
    "sku": "1",
    "qt_tot": 1,
    "f": null,
    "dt_incl_sla": "2022-01-01T04:15:00.000Z",
    "prior": null,
    "n": null,
    "dt_reserva": "2022-01-01T04:14:00.000Z",
    "pct_rom": "100.00",
    "no_nf": "369.789",
    "sit_fase": "Emb. Conf.",
    "m": null,
    "b": null,
    "c": null,
    "pct_sep": null,
    "pct_cko": "100.00",
    "pct_vol": "100.00",
    "a": "X",
    "dt_conf_sep": "2022-01-03T20:10:00.000Z",
    "dt_conf_nf": null,
    "transportadora": "Direct Express Logistica Integrada S/A",
    "destinatario": null,
    "doca": null,
    "vols": 1
  }
]
```

---

### 📋 TABELA: whp
**Campos:** 21
**Total de registros:** 48437
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
dt_mov               date                 NULL       
no_palete            varchar(20)          NULL       
no_seq               varchar(20)          NOT NULL   
v                    varchar(5)           NULL       
f                    varchar(5)           NULL       
s                    varchar(5)           NULL       
tipo_recipiente      varchar(50)          NULL       
endereco             varchar(50)          NULL       
cod_area             varchar(50)          NULL       
nome_cliente         varchar(100)         NULL       
peso_kg              decimal(10,2)        NULL       
vl_mercs             decimal(10,2)        NULL       
vol_m3               decimal(10,3)        NULL       
qt_em_rec            int                  NULL       
qt_real              int                  NULL       
qt_falta             int                  NULL       
qt_contabil          int                  NULL       
qt_sobra             int                  NULL       
qt_bloq              int                  NULL       
qt_em_exp            int                  NULL       
qt_disp              int                  NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `whp`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `whp`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `whp` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_palete": "715.388",
    "no_seq": "1.000.614",
    "v": null,
    "f": null,
    "s": null,
    "tipo_recipiente": null,
    "endereco": "A.A.A.032.2.0",
    "cod_area": "PULMÃO",
    "nome_cliente": "Creative Copias LTDA",
    "peso_kg": "0.00",
    "vl_mercs": "0.00",
    "vol_m3": "0.000",
    "qt_em_rec": 0,
    "qt_real": 66,
    "qt_falta": 0,
    "qt_contabil": 66,
    "qt_sobra": 0,
    "qt_bloq": 0,
    "qt_em_exp": 0,
    "qt_disp": 66
  },
  {
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_palete": "715.402",
    "no_seq": "1.000.628",
    "v": null,
    "f": null,
    "s": null,
    "tipo_recipiente": null,
    "endereco": "A.A.A.031.4.0",
    "cod_area": "PULMÃO",
    "nome_cliente": "Creative Copias LTDA",
    "peso_kg": "0.00",
    "vl_mercs": "0.00",
    "vol_m3": "0.000",
    "qt_em_rec": 0,
    "qt_real": 66,
    "qt_falta": 0,
    "qt_contabil": 66,
    "qt_sobra": 0,
    "qt_bloq": 0,
    "qt_em_exp": 0,
    "qt_disp": 66
  },
  {
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_palete": "715.411",
    "no_seq": "1.000.637",
    "v": null,
    "f": null,
    "s": null,
    "tipo_recipiente": null,
    "endereco": "D.O.C.001.0.0",
    "cod_area": "PULMÃO",
    "nome_cliente": "Kubbo Comercial Eireli",
    "peso_kg": "0.00",
    "vl_mercs": "0.00",
    "vol_m3": "0.000",
    "qt_em_rec": 0,
    "qt_real": 5,
    "qt_falta": 0,
    "qt_contabil": 5,
    "qt_sobra": 0,
    "qt_bloq": 0,
    "qt_em_exp": 0,
    "qt_disp": 5
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_palete": "715.388",
    "no_seq": "1.000.614",
    "v": null,
    "f": null,
    "s": null,
    "tipo_recipiente": null,
    "endereco": "A.A.A.032.2.0",
    "cod_area": "PULMÃO",
    "nome_cliente": "Creative Copias LTDA",
    "peso_kg": "0.00",
    "vl_mercs": "0.00",
    "vol_m3": "0.000",
    "qt_em_rec": 0,
    "qt_real": 66,
    "qt_falta": 0,
    "qt_contabil": 66,
    "qt_sobra": 0,
    "qt_bloq": 0,
    "qt_em_exp": 0,
    "qt_disp": 66
  },
  {
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_palete": "715.402",
    "no_seq": "1.000.628",
    "v": null,
    "f": null,
    "s": null,
    "tipo_recipiente": null,
    "endereco": "A.A.A.031.4.0",
    "cod_area": "PULMÃO",
    "nome_cliente": "Creative Copias LTDA",
    "peso_kg": "0.00",
    "vl_mercs": "0.00",
    "vol_m3": "0.000",
    "qt_em_rec": 0,
    "qt_real": 66,
    "qt_falta": 0,
    "qt_contabil": 66,
    "qt_sobra": 0,
    "qt_bloq": 0,
    "qt_em_exp": 0,
    "qt_disp": 66
  },
  {
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_palete": "715.411",
    "no_seq": "1.000.637",
    "v": null,
    "f": null,
    "s": null,
    "tipo_recipiente": null,
    "endereco": "D.O.C.001.0.0",
    "cod_area": "PULMÃO",
    "nome_cliente": "Kubbo Comercial Eireli",
    "peso_kg": "0.00",
    "vl_mercs": "0.00",
    "vol_m3": "0.000",
    "qt_em_rec": 0,
    "qt_real": 5,
    "qt_falta": 0,
    "qt_contabil": 5,
    "qt_sobra": 0,
    "qt_bloq": 0,
    "qt_em_exp": 0,
    "qt_disp": 5
  }
]
```

---

### 📋 TABELA: wjs
**Campos:** 23
**Total de registros:** 82483
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
dt_incl              datetime             NULL       
dt_mov               date                 NULL       
no_dp                varchar(50)          NOT NULL   
obs                  varchar(250)         NULL       
d                    varchar(20)          NULL       
sit_dp               varchar(50)          NULL       
cliente              varchar(150)         NULL       
no_cli               varchar(10)          NULL       
no_nf                varchar(20)          NULL       
skus                 int                  NULL       
qt_item              float                NULL       
qt_pend              float                NULL       
qt_paletiz           float                NULL       
qt_plz_ok            float                NULL       
pct_plz_ok           decimal(20,3)        NULL       
qt_avaria            int                  NULL       
pct_avaria           decimal(20,3)        NULL       
qt_falta             float                NULL       
pct_falta            decimal(20,3)        NULL       
pct_af               decimal(20,3)        NULL       
ps_bru_kg            decimal(20,3)        NULL       
vol_m3               decimal(20,3)        NULL       
vl_total             decimal(20,2)        NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wjs`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wjs`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wjs` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "dt_incl": "2022-01-03T11:42:30.000Z",
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_dp": "2.057.792",
    "obs": null,
    "d": null,
    "sit_dp": "Fechado",
    "cliente": "Pescador de Ofertas",
    "no_cli": "98",
    "no_nf": "366.363",
    "skus": 2,
    "qt_item": 500,
    "qt_pend": null,
    "qt_paletiz": 500,
    "qt_plz_ok": 500,
    "pct_plz_ok": "100.000",
    "qt_avaria": null,
    "pct_avaria": null,
    "qt_falta": null,
    "pct_falta": null,
    "pct_af": null,
    "ps_bru_kg": null,
    "vol_m3": null,
    "vl_total": "201000.00"
  },
  {
    "dt_incl": "2022-01-03T11:45:41.000Z",
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_dp": "2.057.864",
    "obs": null,
    "d": null,
    "sit_dp": "Fechado",
    "cliente": "Kubbo Comercial Eireli",
    "no_cli": "126",
    "no_nf": "1",
    "skus": 1,
    "qt_item": 150,
    "qt_pend": null,
    "qt_paletiz": 150,
    "qt_plz_ok": 150,
    "pct_plz_ok": "100.000",
    "qt_avaria": null,
    "pct_avaria": null,
    "qt_falta": null,
    "pct_falta": null,
    "pct_af": null,
    "ps_bru_kg": null,
    "vol_m3": null,
    "vl_total": "150.00"
  },
  {
    "dt_incl": "2022-01-03T12:00:35.000Z",
    "dt_mov": "2022-01-04T03:00:00.000Z",
    "no_dp": "2.057.932",
    "obs": null,
    "d": null,
    "sit_dp": "Fechado",
    "cliente": "Kubbo Comercial Eireli",
    "no_cli": "126",
    "no_nf": "243.899",
    "skus": 1,
    "qt_item": 816,
    "qt_pend": null,
    "qt_paletiz": 816,
    "qt_plz_ok": 816,
    "pct_plz_ok": "100.000",
    "qt_avaria": null,
    "pct_avaria": null,
    "qt_falta": null,
    "pct_falta": null,
    "pct_af": null,
    "ps_bru_kg": null,
    "vol_m3": null,
    "vl_total": "62832.00"
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "dt_incl": "2022-01-03T11:42:30.000Z",
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_dp": "2.057.792",
    "obs": null,
    "d": null,
    "sit_dp": "Fechado",
    "cliente": "Pescador de Ofertas",
    "no_cli": "98",
    "no_nf": "366.363",
    "skus": 2,
    "qt_item": 500,
    "qt_pend": null,
    "qt_paletiz": 500,
    "qt_plz_ok": 500,
    "pct_plz_ok": "100.000",
    "qt_avaria": null,
    "pct_avaria": null,
    "qt_falta": null,
    "pct_falta": null,
    "pct_af": null,
    "ps_bru_kg": null,
    "vol_m3": null,
    "vl_total": "201000.00"
  },
  {
    "dt_incl": "2022-01-03T11:45:41.000Z",
    "dt_mov": "2022-01-03T03:00:00.000Z",
    "no_dp": "2.057.864",
    "obs": null,
    "d": null,
    "sit_dp": "Fechado",
    "cliente": "Kubbo Comercial Eireli",
    "no_cli": "126",
    "no_nf": "1",
    "skus": 1,
    "qt_item": 150,
    "qt_pend": null,
    "qt_paletiz": 150,
    "qt_plz_ok": 150,
    "pct_plz_ok": "100.000",
    "qt_avaria": null,
    "pct_avaria": null,
    "qt_falta": null,
    "pct_falta": null,
    "pct_af": null,
    "ps_bru_kg": null,
    "vol_m3": null,
    "vl_total": "150.00"
  },
  {
    "dt_incl": "2022-01-03T12:00:35.000Z",
    "dt_mov": "2022-01-04T03:00:00.000Z",
    "no_dp": "2.057.932",
    "obs": null,
    "d": null,
    "sit_dp": "Fechado",
    "cliente": "Kubbo Comercial Eireli",
    "no_cli": "126",
    "no_nf": "243.899",
    "skus": 1,
    "qt_item": 816,
    "qt_pend": null,
    "qt_paletiz": 816,
    "qt_plz_ok": 816,
    "pct_plz_ok": "100.000",
    "qt_avaria": null,
    "pct_avaria": null,
    "qt_falta": null,
    "pct_falta": null,
    "pct_af": null,
    "ps_bru_kg": null,
    "vol_m3": null,
    "vl_total": "62832.00"
  }
]
```

---

### 📋 TABELA: wkl
**Campos:** 15
**Total de registros:** 44385753
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
cod_merc             varchar(20)          NULL       
nome_mercadoria      varchar(150)         NULL       
nome_emb             varchar(100)         NULL       
nome_cliente         varchar(150)         NULL       
num_dp               varchar(20)          NULL       
obs_resumida         varchar(150)         NULL       
num_nf               varchar(50)          NULL       
serie_cko            varchar(50)          NULL       
dt_mov               date                 NULL       
dt_checkout          datetime             NULL       
dt_emissao_nf        date                 NULL       
usuario_cko          varchar(30)          NULL       
qt_checkout          int                  NULL       
peso_kg              decimal(10,2)        NULL       
qt_beeps             int                  NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wkl`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wkl`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wkl` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "cod_merc": "000003",
    "nome_mercadoria": "MACA PERUANA 1000MG 100 TABS",
    "nome_emb": ".",
    "nome_cliente": "Hazak Com° Atacadista de Produtos Alimenticios Geral Ltda. Epp",
    "num_dp": "5.028.302",
    "obs_resumida": "Ped.: 71957-V-1758852183",
    "num_nf": "68.602",
    "serie_cko": null,
    "dt_mov": "2024-03-26T03:00:00.000Z",
    "dt_checkout": "2024-03-26T13:06:27.000Z",
    "dt_emissao_nf": null,
    "usuario_cko": "MARIANA",
    "qt_checkout": 1,
    "peso_kg": null,
    "qt_beeps": 1
  },
  {
    "cod_merc": "000027",
    "nome_mercadoria": "Liquidificador Multijarras Hamilton Beach 220v",
    "nome_emb": ".",
    "nome_cliente": "Kubbo Comercial Eireli",
    "num_dp": "5.029.431",
    "obs_resumida": "Ped.: 43230748941",
    "num_nf": "69.019",
    "serie_cko": null,
    "dt_mov": "2024-03-26T03:00:00.000Z",
    "dt_checkout": "2024-03-26T13:36:37.000Z",
    "dt_emissao_nf": "2024-03-26T03:00:00.000Z",
    "usuario_cko": "ARIANDINE",
    "qt_checkout": 1,
    "peso_kg": null,
    "qt_beeps": 1
  },
  {
    "cod_merc": "000027",
    "nome_mercadoria": "Liquidificador Multijarras Hamilton Beach 220v",
    "nome_emb": ".",
    "nome_cliente": "Kubbo Comercial Eireli",
    "num_dp": "5.031.512",
    "obs_resumida": "Ped.: 43233946257",
    "num_nf": "69.207",
    "serie_cko": null,
    "dt_mov": "2024-03-27T03:00:00.000Z",
    "dt_checkout": "2024-03-27T14:38:07.000Z",
    "dt_emissao_nf": "2024-03-26T03:00:00.000Z",
    "usuario_cko": "TATIANE",
    "qt_checkout": 1,
    "peso_kg": null,
    "qt_beeps": 1
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "cod_merc": "000003",
    "nome_mercadoria": "MACA PERUANA 1000MG 100 TABS",
    "nome_emb": ".",
    "nome_cliente": "Hazak Com° Atacadista de Produtos Alimenticios Geral Ltda. Epp",
    "num_dp": "5.028.302",
    "obs_resumida": "Ped.: 71957-V-1758852183",
    "num_nf": "68.602",
    "serie_cko": null,
    "dt_mov": "2024-03-26T03:00:00.000Z",
    "dt_checkout": "2024-03-26T13:06:27.000Z",
    "dt_emissao_nf": null,
    "usuario_cko": "MARIANA",
    "qt_checkout": 1,
    "peso_kg": null,
    "qt_beeps": 1
  },
  {
    "cod_merc": "000027",
    "nome_mercadoria": "Liquidificador Multijarras Hamilton Beach 220v",
    "nome_emb": ".",
    "nome_cliente": "Kubbo Comercial Eireli",
    "num_dp": "5.029.431",
    "obs_resumida": "Ped.: 43230748941",
    "num_nf": "69.019",
    "serie_cko": null,
    "dt_mov": "2024-03-26T03:00:00.000Z",
    "dt_checkout": "2024-03-26T13:36:37.000Z",
    "dt_emissao_nf": "2024-03-26T03:00:00.000Z",
    "usuario_cko": "ARIANDINE",
    "qt_checkout": 1,
    "peso_kg": null,
    "qt_beeps": 1
  },
  {
    "cod_merc": "000027",
    "nome_mercadoria": "Liquidificador Multijarras Hamilton Beach 220v",
    "nome_emb": ".",
    "nome_cliente": "Kubbo Comercial Eireli",
    "num_dp": "5.031.512",
    "obs_resumida": "Ped.: 43233946257",
    "num_nf": "69.207",
    "serie_cko": null,
    "dt_mov": "2024-03-27T03:00:00.000Z",
    "dt_checkout": "2024-03-27T14:38:07.000Z",
    "dt_emissao_nf": "2024-03-26T03:00:00.000Z",
    "usuario_cko": "TATIANE",
    "qt_checkout": 1,
    "peso_kg": null,
    "qt_beeps": 1
  }
]
```

---

### 📋 TABELA: wkx
**Campos:** 17
**Total de registros:** 13796561
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
dt_checkout          datetime             NULL       
dp                   varchar(50)          NULL       
vol                  float                NULL       
qt_vol               float                NULL       
obs_resumida         varchar(150)         NULL       
no_cli               varchar(10)          NULL       
nome_cliente         varchar(150)         NULL       
no_nf                varchar(20)          NULL       
dt_mov               date                 NULL       
emi_nf               date                 NULL       
usuario              varchar(30)          NULL       
no_doc_emb           varchar(20)          NULL       
referencia           varchar(150)         NULL       
cnpj_transp          varchar(20)          NULL       
r_social_transp      varchar(200)         NULL       
peso                 decimal(10,2)        NULL       
volume               decimal(10,2)        NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wkx`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wkx`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wkx` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "dt_checkout": "2025-01-07T15:13:26.000Z",
    "dp": "5.697.812",
    "vol": 1,
    "qt_vol": null,
    "obs_resumida": "N.F.: 1470",
    "no_cli": "263",
    "nome_cliente": "Ptls Serv. de Tecnol. e Assess. Tecnica Ltda",
    "no_nf": "1.47",
    "dt_mov": "2025-01-08T03:00:00.000Z",
    "emi_nf": "2025-01-03T03:00:00.000Z",
    "usuario": "PATRICIA",
    "no_doc_emb": "269.0",
    "referencia": "IBL 08/01/2025",
    "cnpj_transp": "05.144.279/0001-09",
    "r_social_transp": "IBL INTERMODAL BRASIL LOGISTICA",
    "peso": null,
    "volume": null
  },
  {
    "dt_checkout": "2025-01-08T13:55:54.000Z",
    "dp": "5.700.842",
    "vol": 1,
    "qt_vol": null,
    "obs_resumida": "N.F.: 1924",
    "no_cli": "262",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_nf": "1.924",
    "dt_mov": "2025-01-09T03:00:00.000Z",
    "emi_nf": "2025-01-07T03:00:00.000Z",
    "usuario": "PATRICIA",
    "no_doc_emb": "270.0",
    "referencia": "IBL 08/01/2025",
    "cnpj_transp": "05.144.279/0001-09",
    "r_social_transp": "IBL INTERMODAL BRASIL LOGISTICA",
    "peso": null,
    "volume": null
  },
  {
    "dt_checkout": "2025-01-08T13:55:56.000Z",
    "dp": "5.700.842",
    "vol": 2,
    "qt_vol": null,
    "obs_resumida": "N.F.: 1924",
    "no_cli": "262",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_nf": "1.924",
    "dt_mov": "2025-01-09T03:00:00.000Z",
    "emi_nf": "2025-01-07T03:00:00.000Z",
    "usuario": "PATRICIA",
    "no_doc_emb": "270.0",
    "referencia": "IBL 08/01/2025",
    "cnpj_transp": "05.144.279/0001-09",
    "r_social_transp": "IBL INTERMODAL BRASIL LOGISTICA",
    "peso": null,
    "volume": null
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "dt_checkout": "2025-01-07T15:13:26.000Z",
    "dp": "5.697.812",
    "vol": 1,
    "qt_vol": null,
    "obs_resumida": "N.F.: 1470",
    "no_cli": "263",
    "nome_cliente": "Ptls Serv. de Tecnol. e Assess. Tecnica Ltda",
    "no_nf": "1.47",
    "dt_mov": "2025-01-08T03:00:00.000Z",
    "emi_nf": "2025-01-03T03:00:00.000Z",
    "usuario": "PATRICIA",
    "no_doc_emb": "269.0",
    "referencia": "IBL 08/01/2025",
    "cnpj_transp": "05.144.279/0001-09",
    "r_social_transp": "IBL INTERMODAL BRASIL LOGISTICA",
    "peso": null,
    "volume": null
  },
  {
    "dt_checkout": "2025-01-08T13:55:54.000Z",
    "dp": "5.700.842",
    "vol": 1,
    "qt_vol": null,
    "obs_resumida": "N.F.: 1924",
    "no_cli": "262",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_nf": "1.924",
    "dt_mov": "2025-01-09T03:00:00.000Z",
    "emi_nf": "2025-01-07T03:00:00.000Z",
    "usuario": "PATRICIA",
    "no_doc_emb": "270.0",
    "referencia": "IBL 08/01/2025",
    "cnpj_transp": "05.144.279/0001-09",
    "r_social_transp": "IBL INTERMODAL BRASIL LOGISTICA",
    "peso": null,
    "volume": null
  },
  {
    "dt_checkout": "2025-01-08T13:55:56.000Z",
    "dp": "5.700.842",
    "vol": 2,
    "qt_vol": null,
    "obs_resumida": "N.F.: 1924",
    "no_cli": "262",
    "nome_cliente": "Promonlogicalis Tecnologia e Particip Ltda",
    "no_nf": "1.924",
    "dt_mov": "2025-01-09T03:00:00.000Z",
    "emi_nf": "2025-01-07T03:00:00.000Z",
    "usuario": "PATRICIA",
    "no_doc_emb": "270.0",
    "referencia": "IBL 08/01/2025",
    "cnpj_transp": "05.144.279/0001-09",
    "r_social_transp": "IBL INTERMODAL BRASIL LOGISTICA",
    "peso": null,
    "volume": null
  }
]
```

---

### 📋 TABELA: wua
**Campos:** 21
**Total de registros:** 9211
**Tem dados:** ✅ Sim

#### Estrutura da Tabela:
```
id                   varchar(10)          NULL       
endereco             varchar(20)          NULL       
cod_area             varchar(20)          NULL       
palete               varchar(20)          NULL       
dt_mov               date                 NULL       
nf                   varchar(20)          NULL       
dp                   varchar(20)          NULL       
cod_merc             varchar(20)          NULL       
mercadoria           varchar(500)         NULL       
emb                  varchar(10)          NULL       
lote                 varchar(20)          NULL       
dt_fabri             date                 NULL       
dt_venc              date                 NULL       
serie                varchar(20)          NULL       
vl_unit              decimal(20,2)        NULL       
qt_em_recebimento    float                NULL       
qt_real              float                NULL       
qt_falta             float                NULL       
qt_bloqueada         float                NULL       
qt_em_expedicao      float                NULL       
qt_disponivel        float                NULL       
```

#### Requisições Disponíveis:

**1. Listar todos os registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wua`
```

**2. Contar total de registros:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT COUNT(*) as total FROM `wua`
```

**3. Limitar resultados:**
```http
GET /api/database/query/dbmercocamp?sql=SELECT * FROM `wua` LIMIT 10
```

#### Exemplo de Resposta com Dados Reais:
```json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "dbmercocamp",
  "data": [
  {
    "id": "545",
    "endereco": "V.N.A.001.0.0",
    "cod_area": null,
    "palete": "7501",
    "dt_mov": null,
    "nf": "35677",
    "dp": "6.512.645",
    "cod_merc": "32551",
    "mercadoria": "SL CREME PENTEAR CONDICIONADOR KIDS MARACUJA CACHI",
    "emb": ".",
    "lote": null,
    "dt_fabri": null,
    "dt_venc": null,
    "serie": null,
    "vl_unit": "9.33",
    "qt_em_recebimento": 0,
    "qt_real": 24,
    "qt_falta": 0,
    "qt_bloqueada": 0,
    "qt_em_expedicao": 24,
    "qt_disponivel": 0
  },
  {
    "id": "545",
    "endereco": "V.N.A.001.0.0",
    "cod_area": null,
    "palete": "10331",
    "dt_mov": null,
    "nf": "36129",
    "dp": "6.530.698",
    "cod_merc": "32551",
    "mercadoria": "SL CREME PENTEAR CONDICIONADOR KIDS MARACUJA CACHI",
    "emb": ".",
    "lote": null,
    "dt_fabri": null,
    "dt_venc": null,
    "serie": null,
    "vl_unit": "6.91",
    "qt_em_recebimento": 0,
    "qt_real": 570,
    "qt_falta": 0,
    "qt_bloqueada": 0,
    "qt_em_expedicao": 570,
    "qt_disponivel": 0
  },
  {
    "id": "545",
    "endereco": "V.N.A.002.1.0",
    "cod_area": "PICKING",
    "palete": "3258",
    "dt_mov": null,
    "nf": "11",
    "dp": "6.491.337",
    "cod_merc": "32547",
    "mercadoria": "#TODECACHO GELATINA CONDICIONADOR SUPER VOLUME 1KG",
    "emb": ".",
    "lote": null,
    "dt_fabri": null,
    "dt_venc": null,
    "serie": null,
    "vl_unit": "6.34",
    "qt_em_recebimento": 0,
    "qt_real": 34,
    "qt_falta": 0,
    "qt_bloqueada": 0,
    "qt_em_expedicao": 34,
    "qt_disponivel": 0
  }
],
  "count": 3
}
```

#### Dados Reais da Tabela:
```json
[
  {
    "id": "545",
    "endereco": "V.N.A.001.0.0",
    "cod_area": null,
    "palete": "7501",
    "dt_mov": null,
    "nf": "35677",
    "dp": "6.512.645",
    "cod_merc": "32551",
    "mercadoria": "SL CREME PENTEAR CONDICIONADOR KIDS MARACUJA CACHI",
    "emb": ".",
    "lote": null,
    "dt_fabri": null,
    "dt_venc": null,
    "serie": null,
    "vl_unit": "9.33",
    "qt_em_recebimento": 0,
    "qt_real": 24,
    "qt_falta": 0,
    "qt_bloqueada": 0,
    "qt_em_expedicao": 24,
    "qt_disponivel": 0
  },
  {
    "id": "545",
    "endereco": "V.N.A.001.0.0",
    "cod_area": null,
    "palete": "10331",
    "dt_mov": null,
    "nf": "36129",
    "dp": "6.530.698",
    "cod_merc": "32551",
    "mercadoria": "SL CREME PENTEAR CONDICIONADOR KIDS MARACUJA CACHI",
    "emb": ".",
    "lote": null,
    "dt_fabri": null,
    "dt_venc": null,
    "serie": null,
    "vl_unit": "6.91",
    "qt_em_recebimento": 0,
    "qt_real": 570,
    "qt_falta": 0,
    "qt_bloqueada": 0,
    "qt_em_expedicao": 570,
    "qt_disponivel": 0
  },
  {
    "id": "545",
    "endereco": "V.N.A.002.1.0",
    "cod_area": "PICKING",
    "palete": "3258",
    "dt_mov": null,
    "nf": "11",
    "dp": "6.491.337",
    "cod_merc": "32547",
    "mercadoria": "#TODECACHO GELATINA CONDICIONADOR SUPER VOLUME 1KG",
    "emb": ".",
    "lote": null,
    "dt_fabri": null,
    "dt_venc": null,
    "serie": null,
    "vl_unit": "6.34",
    "qt_em_recebimento": 0,
    "qt_real": 34,
    "qt_falta": 0,
    "qt_bloqueada": 0,
    "qt_em_expedicao": 34,
    "qt_disponivel": 0
  }
]
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

## 📊 ESTATÍSTICAS DETALHADAS

### DBRECEBIMENTO
- **Tabelas:** 2
- **Tabelas com dados:** 0
- **Total de registros:** 0
- **Campos totais:** 12

  - **agendamento:** 0 registros, 8 campos
  - **produtos:** 0 registros, 4 campos

### DBUSUARIOS
- **Tabelas:** 1
- **Tabelas com dados:** 0
- **Total de registros:** 0
- **Campos totais:** 4

  - **usuarios:** 0 registros, 4 campos

### DBMERCOCAMP
- **Tabelas:** 10
- **Tabelas com dados:** 9
- **Total de registros:** 60682852
- **Campos totais:** 185

  - **wbx:** 810724 registros, 18 campos
  - **wcl:** 594 registros, 20 campos
  - **wdq:** 227515 registros, 17 campos
  - **wf1:** 0 registros, 5 campos
  - **wgu:** 1321574 registros, 28 campos
  - **whp:** 48437 registros, 21 campos
  - **wjs:** 82483 registros, 23 campos
  - **wkl:** 44385753 registros, 15 campos
  - **wkx:** 13796561 registros, 17 campos
  - **wua:** 9211 registros, 21 campos

## 📝 OBSERVAÇÕES IMPORTANTES

1. **Segurança:** Apenas queries SELECT são permitidas via API
2. **Limite:** Recomenda-se usar LIMIT nas consultas para evitar sobrecarga
3. **Performance:** Use índices apropriados para consultas frequentes
4. **Backup:** Sempre faça backup antes de alterações estruturais
5. **Monitoramento:** Monitore o uso das APIs para otimização
6. **Dados:** Algumas tabelas podem estar vazias ou com poucos dados

## 🔧 CONFIGURAÇÃO

- **Host:** mercocamp.ip.odhserver.com
- **Porta:** 33101
- **Usuário:** projetos
- **Bancos:** dbrecebimento, dbusuarios, dbmercocamp

