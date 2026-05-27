# rastre.io 📦

> **Sistema de Rastreamento Logístico de Frotas e Encomendas** — Locatrans

![Logo](src/assets/rastreio-logo.webp)

## 📋 Sobre o Projeto

O **rastre.io** é um sistema de rastreamento logístico desenvolvido para a **Locatrans**, substituindo o acompanhamento manual por WhatsApp por uma plataforma web organizada, acessível e funcional.

### O que o sistema faz:
- ✅ **Rastreamento público** — Clientes consultam encomendas sem login
- ✅ **Dashboard interno** — Funcionários monitoram entregas e frota
- ✅ **Scanner QR** — Motoristas atualizam status em campo
- ✅ **Mapa da frota** — Localização em tempo real dos caminhões
- ✅ **Gerenciamento de usuários** — Admin controla acessos e permissões

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+ 
- npm 9+

### Instalação

```bash
# Clone o repositório
cd Rastreio

# Instale as dependências
npm install

# Configure o Firebase
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`

### Configuração do Firebase

Preencha o `.env` com as credenciais do app Web do Firebase. No Firebase Console, habilite **Authentication → Sign-in method → Email/Password** e crie usuários com os emails usados no sistema.

O login usa somente o Firebase Authentication. Não é necessário criar coleção/tabela `users` no Firestore para autenticar.

Permissões internas usam o papel do usuário. Se você configurar custom claim `role` no Firebase Auth, o app usa esse valor. Sem custom claim, ele usa o papel padrão do `.env`:

```bash
VITE_FIREBASE_DEFAULT_ROLE=employee
```

Valores aceitos: `admin`, `employee`, `driver`.

---

## 🔑 Contas de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| **Administrador** | carlos@locatrans.com | admin123 |
| **Funcionário** | maria@locatrans.com | func123 |
| **Motorista** | jose@locatrans.com | motor123 |

### Códigos de Rastreio para Teste
- `LCT2025A001` — Entregue ✅
- `LCT2025B042` — Em Trânsito 🚛
- `LCT2025C107` — Saiu para Entrega 📦
- `LCT2025D055` — Coletado 📋
- `LCT2025E200` — Pendente ⏳
- `LCT2025F018` — Devolvido ↩️

---

## 🏗️ Arquitetura

### Stack Tecnológica
| Tecnologia | Uso |
|------------|-----|
| **React + Vite** | SPA com HMR rápido |
| **React Router v6** | Roteamento SPA |
| **CSS vanilla** | Design system customizado |
| **Leaflet + OpenStreetMap** | Mapas (gratuito) |
| **Lucide React** | Ícones |
| **qrcode.react** | Geração de QR codes |
| **Context API** | Estado global de autenticação |

### Fluxo de Dados
```
Route → Page (Controller) → Service (Regras de Negócio) → Repository (Mock Data)
```

### Estrutura de Pastas
```
src/
├── app/                    # Configuração do app
│   ├── router/             # Rotas centralizadas
│   ├── layouts/            # Layouts (Public, Auth, Dashboard)
│   └── App.jsx             # Root component
│
├── modules/                # Módulos de domínio
│   ├── auth/               # Autenticação
│   ├── tracking/           # Rastreamento público
│   ├── deliveries/         # Gerenciamento de entregas
│   ├── dashboard/          # Dashboard
│   ├── locations/          # Mapa da frota
│   ├── scanner/            # Scanner QR
│   └── users/              # Gerenciamento de usuários
│
├── shared/                 # Código compartilhado
│   ├── components/         # Componentes reutilizáveis
│   ├── data/               # Dados mock centralizados
│   ├── hooks/              # Hooks customizados
│   ├── utils/              # Utilitários e constantes
│   └── styles/             # Design system CSS
│
├── assets/                 # Imagens e recursos
└── main.jsx                # Entry point
```

### Perfis de Acesso

| Funcionalidade | Admin | Funcionário | Motorista |
|----------------|:-----:|:-----------:|:---------:|
| Dashboard | ✅ | ✅ | ✅ |
| Ver entregas | ✅ | ✅ | ✅ |
| Criar entregas | ✅ | ✅ | ❌ |
| Atualizar status | ✅ | ✅ | ✅ |
| Mapa da frota | ✅ | ✅ | ❌ |
| Scanner QR | ✅ | ❌ | ✅ |
| Gerenciar usuários | ✅ | ❌ | ❌ |

---

## 📱 Telas do Sistema

1. **Rastreamento Público** (`/`) — Busca por código de rastreio
2. **Resultado do Rastreamento** (`/rastreio/:code`) — Status, timeline e detalhes
3. **Login** (`/login`) — Acesso à área interna
4. **Dashboard** (`/app/dashboard`) — Métricas e visão geral
5. **Lista de Entregas** (`/app/entregas`) — Tabela filtrada
6. **Detalhes da Entrega** (`/app/entregas/:id`) — Informações completas + timeline
7. **Scanner QR** (`/app/scanner`) — Leitura e atualização de status
8. **Mapa da Frota** (`/app/frota`) — Localização dos caminhões
9. **Gerenciamento de Usuários** (`/app/usuarios`) — CRUD de usuários
10. **Permissões** (embutido no gerenciamento) — Visualização por perfil

---

## 🎨 Decisões de Design

- **Dark mode** na área interna — reduz fadiga visual para uso prolongado
- **Light mode** na área pública — mais amigável para clientes
- **Paleta roxa** (#7C3AED) — consistente com a identidade da logo
- **Micro-animações** — staggered fade-in, hover effects, scan line
- **Responsivo** — funciona em desktop, tablet e mobile
- **Mapas dark** (CartoDB Dark) — coerente com o tema do dashboard

---

## 🔮 Evolução Futura

Este protótipo foi projetado para evolução. Próximos passos sugeridos:

1. **Backend real** — Node.js + Express + PostgreSQL
2. **Autenticação JWT** — Tokens com refresh
3. **WebSocket** — Atualizações em tempo real
4. **GPS real** — Integração com dispositivos móveis
5. **QR Scanner real** — Câmera do dispositivo
6. **Notificações** — Push notifications e email
7. **Relatórios** — Exportação PDF/Excel
8. **PWA** — App instalável offline

---

## 📄 Licença

Projeto desenvolvido para a **Locatrans** como protótipo funcional.
