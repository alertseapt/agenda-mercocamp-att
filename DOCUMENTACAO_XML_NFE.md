# 📄 Documentação XML NF-e - API Mercocamp

## 🎯 Visão Geral

Esta documentação descreve os endpoints específicos para processar XML de **Nota Fiscal Eletrônica (NF-e)** na API Mercocamp.

### 🔗 Base URL
```
https://seu-app.railway.app/parse
```

### 📋 Características Principais

- ✅ **Conversão XML para JSON** com campos personalizados
- ✅ **Adição automática** de `icProd` e `ixProd` em branco
- ✅ **Validação completa** de estrutura NF-e
- ✅ **Extração de informações** específicas
- ✅ **Suporte a múltiplos formatos** de NF-e
- ✅ **Logs detalhados** para debug

---

## 📡 Endpoints Disponíveis

### 1. **Converter XML para JSON**
```
POST /parse/xml-to-json
```

**Descrição**: Converte XML de NF-e para JSON, adicionando campos personalizados.

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "xml": "<nfeProc>...</nfeProc>"
}
```

**Resposta de Sucesso**:
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

---

### 2. **Extrair Informações Específicas**
```
POST /parse/extract-info
```

**Descrição**: Extrai informações básicas da NF-e e lista de produtos simplificada.

**Body**:
```json
{
  "xml": "<nfeProc>...</nfeProc>"
}
```

**Resposta de Sucesso**:
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
      },
      {
        "cProd": "PROD002",
        "icProd": "",
        "ixProd": "",
        "xProd": "PRODUTO TESTE 2",
        "NCM": "87654321",
        "CFOP": "5102",
        "uCom": "UN",
        "qCom": "5.0000",
        "vUnCom": "100.0000",
        "vProd": "500.00",
        "EAN": "7891234567891",
        "orig": "0"
      }
    ]
  }
}
```

---

### 3. **Validar NF-e**
```
POST /parse/validate-nfe
```

**Descrição**: Valida se o XML é uma NF-e válida e retorna informações básicas.

**Body**:
```json
{
  "xml": "<nfeProc>...</nfeProc>"
}
```

**Resposta de Sucesso**:
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

---

## 🔧 Campos Personalizados

### **Campos Adicionados Automaticamente**

| Campo | Tipo | Descrição | Valor Padrão |
|-------|------|-----------|--------------|
| `icProd` | string | Código interno do produto | `""` (vazio) |
| `ixProd` | string | Descrição interna do produto | `""` (vazio) |

### **Campos Originais Mantidos**

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

---

## 📝 Estruturas Suportadas

### **Formatos de NF-e Aceitos**

1. **NF-e completa com protocolo**:
   ```xml
   <nfeProc>
     <NFe>
       <infNFe>
         ...
       </infNFe>
     </NFe>
   </nfeProc>
   ```

2. **NF-e sem protocolo**:
   ```xml
   <NFe>
     <infNFe>
       ...
     </infNFe>
   </NFe>
   ```

3. **Apenas estrutura interna**:
   ```xml
   <infNFe>
     ...
   </infNFe>
   ```

---

## ⚠️ Validações Aplicadas

### **Validação de XML**
- ✅ Formato XML válido
- ✅ Estrutura básica de NF-e
- ✅ Presença de elementos obrigatórios
- ✅ Codificação UTF-8

### **Validação de Produtos**
- ✅ Máximo 60 caracteres para `cProd`
- ✅ Campos obrigatórios presentes
- ✅ Valores numéricos válidos
- ✅ Estrutura correta de produtos

### **Validação de NF-e**
- ✅ Chave de acesso com 44 dígitos
- ✅ CNPJ válido do emitente
- ✅ Estrutura `<ide>`, `<emit>`, `<det>`
- ✅ Informações básicas consistentes

---

## 🚨 Códigos de Erro

### **400 - Bad Request**
```json
{
  "success": false,
  "message": "XML é obrigatório",
  "errors": ["Campo xml não pode estar vazio"]
}
```

### **400 - XML Malformado**
```json
{
  "success": false,
  "message": "XML malformado",
  "errors": ["O XML enviado não está em formato válido"]
}
```

### **400 - XML Inválido**
```json
{
  "success": false,
  "message": "XML não é uma NF-e válida",
  "errors": ["XML deve conter estrutura de Nota Fiscal Eletrônica"]
}
```

### **500 - Erro Interno**
```json
{
  "success": false,
  "message": "Erro interno ao processar XML",
  "error": "Detalhes do erro (apenas em desenvolvimento)"
}
```

---

## 🛠️ Exemplos de Uso

### **1. Converter XML Completo**

```bash
curl -X POST https://seu-app.railway.app/parse/xml-to-json \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<?xml version=\"1.0\"?><nfeProc>...</nfeProc>"
  }'
```

### **2. Extrair Apenas Produtos**

```bash
curl -X POST https://seu-app.railway.app/parse/extract-info \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<?xml version=\"1.0\"?><nfeProc>...</nfeProc>"
  }'
```

### **3. Validar NF-e**

```bash
curl -X POST https://seu-app.railway.app/parse/validate-nfe \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<?xml version=\"1.0\"?><nfeProc>...</nfeProc>"
  }'
```

---

## 🔄 Fluxo de Processamento

1. **Receber XML** → Validar formato básico
2. **Validar NF-e** → Verificar estrutura específica
3. **Converter JSON** → Usar xml2js com configurações otimizadas
4. **Processar Produtos** → Adicionar campos `icProd` e `ixProd`
5. **Retornar Resultado** → JSON formatado com metadados

---

## 📊 Logs e Debug

### **Logs Gerados**
- ✅ Conversão XML para JSON
- ✅ Processamento de produtos
- ✅ Erros de validação
- ✅ Informações de debug

### **Níveis de Log**
- `INFO`: Operações normais
- `WARN`: Estruturas não reconhecidas
- `ERROR`: Erros de processamento

---

## 🔗 Integração com Frontend

### **Exemplo JavaScript**

```javascript
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
  // Processar produtos com icProd e ixProd em branco
  const produtos = result.data.nfeProc.NFe.infNFe.det;
  
  produtos.forEach(produto => {
    console.log(`Produto: ${produto.prod.cProd}`);
    console.log(`Código Interno: ${produto.prod.icProd}`); // Vazio
    console.log(`Descrição Interna: ${produto.prod.ixProd}`); // Vazio
  });
}
```

---

## 📋 Checklist de Implementação

- [x] ✅ Dependência `xml2js` instalada
- [x] ✅ Controller `XMLController` criado
- [x] ✅ Rotas `/parse/*` configuradas
- [x] ✅ Validações específicas implementadas
- [x] ✅ Campos `icProd` e `ixProd` adicionados
- [x] ✅ Servidor principal atualizado
- [x] ✅ Documentação completa criada
- [x] ✅ Testes básicos validados

---

## 🚀 Próximos Passos

1. **Integrar com Frontend** → Usar endpoints para processar NF-e
2. **Personalizar Campos** → Preencher `icProd` e `ixProd` no frontend
3. **Salvar Dados** → Usar endpoints de produtos para persistir
4. **Implementar Cache** → Otimizar performance para XMLs grandes
5. **Adicionar Webhook** → Notificar processamento concluído

---

## 📞 Suporte

- **Health Check**: `GET /health`
- **Documentação**: `GET /`
- **Logs**: Disponíveis no painel Railway
- **Repositório**: https://github.com/alertseapt/agenda-mercocamp-att

---

**Versão**: 1.0.0  
**Atualizado**: Janeiro 2024  
**Projeto**: Mercocamp - Sistema de Agendamento 