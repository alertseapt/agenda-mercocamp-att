# 🚚 Agenda Mercocamp - Frontend React

Sistema frontend completo de gerenciamento de agendamentos para logística da Mercocamp, desenvolvido com React.js.

## 🎯 Funcionalidades

### ✅ Interface de Agendamentos
- **Visualização em lista** com filtros avançados
- **Modal de detalhes** interativo e responsivo
- **Edição de dados** com validação em tempo real
- **Histórico de status** com timestamps editáveis
- **Busca inteligente** por múltiplos campos

### 🔧 Edição Avançada
- **Data principal** do agendamento com correção de fuso horário
- **Timestamps do histórico** com edição individual por status
- **Detecção inteligente** de alterações (histórico vs dados gerais)
- **Rotas específicas** otimizadas para cada tipo de atualização
- **Validação completa** com limpeza automática de dados

### 🎨 UX/UI Moderna
- **Design responsivo** e intuitivo
- **Modais interativos** com animações suaves
- **Botões diferenciados** visualmente (📅 data principal vs 🕐 histórico)
- **Fechamento automático** do modal após salvar
- **Feedback visual** em tempo real durante operações

## 🛠️ Tecnologias

- **React.js** 18.x
- **JavaScript ES6+**
- **CSS3** com design moderno
- **Axios** para comunicação com API
- **React Hooks** para gerenciamento de estado

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+ 
- NPM ou Yarn

### Setup
```bash
# Clone o repositório
git clone https://github.com/alertseapt/agenda-mercocamp-att.git
cd agenda-mercocamp-att

# Instale as dependências
npm install

# Configure a URL da API (src/services/api.js)
# const API_BASE_URL = 'https://sua-api.railway.app/api';

# Inicie o servidor de desenvolvimento
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── components/                    # Componentes React
│   ├── administrativo/            # Componentes admin
│   │   ├── InvoiceDetailsModal.js # Modal principal de edição
│   │   ├── FilterControls.js      # Controles de filtro
│   │   ├── ProcessingInvoicesList.js # Lista de agendamentos
│   │   └── ...                    # Outros componentes admin
│   ├── clientes/                  # Gestão de clientes
│   ├── leitura/                   # Componentes de visualização
│   └── Navbar.js                  # Navegação principal
├── contexts/                      # Contextos React
│   └── AuthContext.js             # Contexto de autenticação
├── pages/                         # Páginas principais
│   ├── AdministrativoPage.js      # Página administrativa
│   ├── ClientesPage.js            # Página de clientes
│   └── LeituraPage.js             # Página de leitura
├── services/                      # Serviços de API
│   └── api.js                     # Cliente HTTP Axios
├── styles/                        # Estilos globais
└── utils/                         # Utilitários
    └── nfUtils.js                 # Utilitários para NF-e
```

## 🔧 Scripts Disponíveis

```bash
npm start          # Servidor de desenvolvimento
npm run build      # Build para produção  
npm test           # Executar testes
npm run eject      # Ejetar configuração (irreversível)
```

## 📋 Funcionalidades Detalhadas

### 🔍 Sistema de Busca e Filtros
- **Busca global** por número da NF, chave de acesso, cliente
- **Filtros por cliente** com dropdown dinâmico
- **Filtros por status** com seleção múltipla
- **Cálculo automático** da volumetria total

### 📝 Modal de Edição
- **Modo visualização** e **modo edição** bem definidos
- **Proteção por senha** para acesso à edição
- **Validação em tempo real** de todos os campos
- **Preview visual** das alterações antes de salvar

### 🕐 Gerenciamento de Histórico
- **Visualização cronológica** ordenada por timestamp
- **Edição individual** de cada entrada do histórico
- **Detecção automática** de mudanças específicas no histórico
- **API otimizada** com rota específica para histórico

### 🎯 Otimizações Implementadas

#### ✅ Resolução de Loops Infinitos
- Implementação de `useCallback` para funções
- Otimização de dependências em `useEffect`
- Uso de `useMemo` para processamento pesado

#### ✅ Sincronização de Timestamps
- Conversão automática Firebase → ISO strings
- Função unificada `processTimestamps()`
- Validação contra objetos Firebase não convertidos

#### ✅ UX Aprimorada
- **📅 Data Principal** (botão azul) - campo `data` do agendamento
- **🕐 Data/Hora do Status** (botão cinza) - timestamp do histórico
- Labels descritivos e feedback visual claro

## 🌐 Configuração da API

Configure a URL da API em `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
REACT_APP_API_URL=https://agenda-mercocamp-backend-production.up.railway.app/api
```

## 🚀 Deploy

### Opções Recomendadas
- **Vercel** (recomendado para React)
- **Netlify** 
- **GitHub Pages**
- **Railway**

### Deploy na Vercel
```bash
npm run build
npx vercel --prod
```

## 🐛 Problemas Resolvidos

### ✅ Loops Infinitos de Renderização
- **Problema**: useEffect disparando infinitamente
- **Solução**: useCallback e dependências otimizadas

### ✅ Timestamps Firebase 
- **Problema**: Objetos `{_seconds, _nanoseconds}` causando erro 500
- **Solução**: Função `processTimestamps()` unificada

### ✅ Confusão entre Botões
- **Problema**: Usuário confundindo botão de data principal vs histórico
- **Solução**: Cores e labels diferenciados

### ✅ Modal Reabrindo
- **Problema**: Modal reabria após refresh da lista
- **Solução**: `onClose()` automático após salvar

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Changelog

### v3.1.0 - Atual
- ✅ Resolução completa de loops infinitos
- ✅ Sistema de detecção inteligente de alterações
- ✅ Fechamento automático do modal após salvar
- ✅ Interface UX/UI completamente otimizada
- ✅ Processamento unificado de timestamps

## 📞 Suporte

- **Issues**: GitHub Issues
- **Documentação**: Este README
- **Debug**: Console do navegador

---

**🚚 Mercocamp - Logística Inteligente**
