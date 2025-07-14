# 🚚 Agenda Mercocamp - Sistema de Logística

Sistema completo de gerenciamento de agendamentos para logística da Mercocamp, desenvolvido com React.js no frontend e Node.js no backend.

## 🎯 Funcionalidades Principais

### ✅ Sistema de Agendamentos
- **Visualização em lista** com filtros avançados
- **Modal de detalhes** completo com todas as informações
- **Edição de dados** com validação completa
- **Histórico de status** rastreável
- **Busca inteligente** por múltiplos campos

### 🔧 Edição Avançada
- **Data principal** do agendamento com correção de fuso horário
- **Timestamps do histórico** com edição individual
- **Detecção inteligente** de alterações (histórico vs dados gerais)
- **Rotas específicas** para cada tipo de atualização
- **Validação de dados** com limpeza automática

### 🎨 Interface Moderna
- **Design responsivo** e intuitivo
- **Modais interativos** com UX aprimorada
- **Botões diferenciados** para data principal vs histórico
- **Fechamento automático** após salvar alterações
- **Feedback visual** em tempo real

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js** 18.x
- **JavaScript ES6+**
- **CSS3** com design moderno
- **Axios** para requisições HTTP
- **React Hooks** para gerenciamento de estado

### Backend (API)
- **Node.js** com Express
- **Firebase Firestore** como banco de dados
- **Railway** para deploy

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn
- Conta no Firebase (para backend)

### Frontend
```bash
# Clone o repositório
git clone https://github.com/alertseapt/agenda-mercocamp-att.git

# Navegue para o diretório do frontend
cd agenda-mercocamp-att/agenda-mercocam-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

O frontend estará disponível em `http://localhost:3000`

### Configuração da API
Configure a URL da API no arquivo `src/services/api.js`:
```javascript
const API_BASE_URL = 'https://sua-api.railway.app/api' || 'http://localhost:3000/api';
```

## 📋 Funcionalidades Detalhadas

### 🔍 Sistema de Busca e Filtros
- **Busca global** por número da NF, chave de acesso, cliente
- **Filtros por cliente** com dropdown
- **Filtros por status** com múltipla seleção
- **Volumetria total** calculada automaticamente

### 📝 Modal de Edição
- **Modo visualização** e **modo edição** distintos
- **Proteção por senha** para edições
- **Validação em tempo real** de todos os campos
- **Preview das alterações** antes de salvar

### 🕐 Gerenciamento de Histórico
- **Visualização cronológica** do histórico de status
- **Edição individual** de timestamps
- **Detecção automática** de mudanças no histórico
- **API específica** para alterações de histórico (`PUT /historico-status/:index`)

### 🎯 Rotas Inteligentes
- **Rota geral** (`PUT /agendamentos/:id`) para alterações de dados
- **Rota específica** (`PUT /historico-status/:index`) para histórico
- **Detecção automática** do tipo de alteração
- **Otimização de requisições** baseada no contexto

## 🐛 Problemas Resolvidos

### ✅ Loops Infinitos de Renderização
- Implementação de `useCallback` para funções
- Otimização de dependências em `useEffect`
- Uso de `useMemo` para processamento de filtros

### ✅ Sincronização de Timestamps
- Conversão automática Firebase → ISO strings
- Processamento unificado em função `processTimestamps()`
- Detecção de objetos Firebase não convertidos

### ✅ Confusão entre Botões
- **📅 Data Principal** (azul) - altera campo `data` do agendamento
- **🕐 Data/Hora do Status** (cinza) - altera timestamp do histórico
- Labels descritivos e cores distintas

### ✅ Problemas de API
- Adição do campo `observacao` obrigatório na API
- Validação completa de dados antes do envio
- Remoção de campos proibidos (como `chaveAcesso`)

## 📊 Estrutura do Projeto

```
agenda-mercocamp-att/
├── agenda-mercocam-frontend/           # Frontend React
│   ├── public/                         # Arquivos públicos
│   ├── src/
│   │   ├── components/                 # Componentes React
│   │   │   ├── administrativo/         # Componentes admin
│   │   │   ├── clientes/               # Gestão de clientes
│   │   │   └── leitura/                # Visualização
│   │   ├── contexts/                   # Contextos React
│   │   ├── pages/                      # Páginas principais
│   │   ├── services/                   # Serviços de API
│   │   ├── styles/                     # Estilos globais
│   │   └── utils/                      # Utilitários
│   ├── package.json                    # Dependências
│   └── README.md                       # Documentação
├── API_DOCUMENTATION.md                # Documentação da API
├── .gitignore                          # Arquivos ignorados
└── README.md                           # Este arquivo
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia servidor de desenvolvimento
npm run build          # Build para produção
npm test               # Executa testes
npm run eject          # Ejeta configuração (irreversível)

# Verificação
npm run lint           # Verifica código
npm run format         # Formata código
```

## 🌐 Deploy

### Frontend
O frontend pode ser deployado em:
- **Vercel** (recomendado para React)
- **Netlify**
- **GitHub Pages**
- **Railway**

### Backend
Backend já está deployado no Railway:
- URL da API: `https://agenda-mercocamp-backend-production.up.railway.app/api`

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Changelog

### v3.1.0 - Atual
- ✅ Resolução completa de loops infinitos
- ✅ Sistema de detecção inteligente de alterações
- ✅ Rotas específicas para histórico vs dados gerais
- ✅ Fechamento automático do modal após salvar
- ✅ Interface UX aprimorada com botões diferenciados
- ✅ Processamento unificado de timestamps Firebase

### v3.0.0 - Base
- ✅ Sistema completo de agendamentos
- ✅ Modal de edição com validação
- ✅ Filtros e busca avançada
- ✅ Integração com API Railway

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma **Issue** no GitHub
- Consulte a **API_DOCUMENTATION.md**
- Verifique os **logs do console** para debug

## 📄 Licença

Este projeto é propriedade da Mercocamp. Todos os direitos reservados.

---

**🚚 Mercocamp - Logística Inteligente** 