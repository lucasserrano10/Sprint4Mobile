# Ford Nexus — Mobile App

> **Sprint 3 · Mobile Development and IoT**
> Desafio Ford × FIAP · Engenharia de Software

## 👥 Equipe

| Nome | RM |
|---|---|
| Ana Clara Melo | RM559021 |
| David Murillo | RM559078 |
| Lucas Serrano | RM555170 |
| Yasmin Gonçalves | RM559147 |

---

## 📱 Sobre o App

O **Ford Nexus** é a camada que mantém o carro dentro do ecossistema Ford mesmo onde não existe mais concessionária. O app entrega ao proprietário Ford:

- **Perfil completo do veículo por VIN/Chassi** — histórico auditável registrado no chassi
- **Agendamento inteligente de manutenção** — na rede de concessionárias e oficinas credenciadas
- **Histórico de serviços verificados** — cada serviço chancelado pela Ford
- **Mapa de oficinas parceiras** — Ford Service Partners nos bairros sem loja
- **Alertas e notificações** — lembretes de revisão, confirmações e recall

---

## 🏗️ Arquitetura

```
ford-nexus/
├── App.tsx                     # Entry point, providers, navegação raiz
├── app.json                    # Configuração Expo
├── eas.json                    # Configuração EAS Build (APK/AAB)
└── src/
    ├── constants/
    │   ├── theme.ts            # Design tokens (cores, tipografia, espaçamento Ford)
    │   └── app.ts              # Labels, dados mock, constantes de negócio
    ├── types/
    │   ├── user.ts             # Tipos de usuário e autenticação
    │   └── vehicle.ts          # Tipos de veículo, serviço, agendamento, notificação
    ├── services/
    │   ├── firebase.ts         # Inicialização Firebase (Auth + Realtime Database)
    │   ├── authService.ts      # Email, Google, Apple Sign-In
    │   ├── userService.ts      # CRUD de usuários no Firebase
    │   ├── vehicleService.ts   # CRUD de veículos por VIN
    │   ├── appointmentService.ts # Gerenciamento de agendamentos
    │   └── notificationService.ts # Notificações e mock data
    ├── contexts/
    │   ├── AuthContext.tsx     # Estado global de autenticação
    │   └── VehicleContext.tsx  # Estado global de veículos do usuário
    ├── hooks/
    │   └── useAuth.ts          # Hook de autenticação com tratamento de erros
    ├── components/
    │   ├── Loading.tsx         # Indicador de carregamento (tela cheia ou inline)
    │   ├── FeedbackBanner.tsx  # Banners de erro/sucesso/aviso/info
    │   ├── ScreenHeader.tsx    # Header padrão das telas (variante Ford)
    │   ├── Card.tsx            # Card, SectionHeader, InfoRow, Divider
    │   ├── Button.tsx          # Botão com variantes (primary/secondary/outline/danger)
    │   └── Badges.tsx          # StatusBadge, CertificationBadge, FordVerifiedBadge
    └── screens/
        ├── LoginScreen.tsx       # Login/Registro (email, Google, Apple)
        ├── HomeScreen.tsx        # Dashboard do proprietário
        ├── VehicleScreen.tsx     # Perfil do veículo + cadastro por VIN
        ├── ServiceHistoryScreen.tsx # Histórico de serviços com filtros
        ├── AppointmentScreen.tsx  # Wizard de agendamento (4 passos)
        ├── PartnerShopsScreen.tsx # Lista de oficinas parceiras Ford
        ├── NotificationsScreen.tsx # Central de notificações
        └── ProfileScreen.tsx      # Perfil do usuário e configurações
```

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Função |
|---|---|---|
| React Native | 0.76.9 | Framework mobile |
| Expo | ~54.0.0 | Toolchain & APIs nativas |
| TypeScript | ^5.3.3 | Tipagem estática |
| Firebase (Auth) | ^11.6.0 | Autenticação (Email, Google, Apple) |
| Firebase (Realtime DB) | ^11.6.0 | Banco de dados em tempo real |
| React Native Safe Area | 4.12.0 | Safe areas iOS/Android |
| Expo EAS Build | latest | Build APK/AAB para distribuição |

---

## ⚙️ Configuração do Ambiente

### 1. Pré-requisitos

```bash
node --version   # >= 18.x
npm --version    # >= 9.x

# Instalar EAS CLI globalmente
npm install -g eas-cli
```

### 2. Clonar e instalar dependências

```bash
cd ford-nexus
npm install
```

### 3. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais Firebase:

```bash
cp .env.example .env
```

Edite `.env` com os valores do seu projeto Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://seu-projeto-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=seu-web-client-id.apps.googleusercontent.com
```

### 4. Configurar Firebase

No console do Firebase (https://console.firebase.google.com):

1. **Authentication** → habilitar Email/Senha, Google e (opcional) Apple
2. **Realtime Database** → criar banco no modo teste para desenvolvimento
3. **Regras do banco de dados** (produção):

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "vehicles": {
      ".read": "auth !== null",
      ".write": "auth !== null"
    },
    "appointments": {
      ".read": "auth !== null",
      ".write": "auth !== null"
    },
    "notifications": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

---

## 🚀 Executar em Desenvolvimento

```bash
# Metro bundler (QR code para Expo Go)
npm start

# Android direto
npm run android

# iOS direto
npm run ios
```

Para testar no Expo Go:
1. Instale o **Expo Go** no seu celular
2. Escaneie o QR code exibido no terminal
3. O app carregará automaticamente

---

## 📦 Gerar APK (Sprint 3 — Entrega)

> **✅ APK gerado e validado:** `FordNexus-Sprint3.apk` (61 MB) — build local com Gradle 8.8 + JDK 17.

### Pré-requisitos

| Ferramenta | Versão | Instalação |
|---|---|---|
| Node.js | 18 LTS+ | [nodejs.org](https://nodejs.org) |
| JDK | 17 (Temurin) | `brew install --cask temurin@17` |
| Android SDK | API 34 + NDK 26.1 | `sdkmanager "platforms;android-34" "ndk;26.1.10909125"` |

### Passo a passo — Build Local (Verificado ✅)

```bash
# 1. Instalar dependências
npm install

# 2. Gerar o projeto nativo Android
npx expo prebuild --platform android

# 3. Criar arquivo com caminho do SDK
echo "sdk.dir=$HOME/android-sdk" > android/local.properties

# 4. Gerar APK Release
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export ANDROID_HOME=$HOME/android-sdk
cd android && ./gradlew assembleRelease --no-daemon

# APK gerado em:
# android/app/build/outputs/apk/release/app-release.apk
```

### Instalar no dispositivo

```bash
# Via ADB (dispositivo conectado via USB com depuração ativa)
adb install android/app/build/outputs/apk/release/app-release.apk

# Ou transfira o arquivo FordNexus-Sprint3.apk para o Android
# e instale manualmente (habilite "Fontes desconhecidas")
```

### Perfis de Build (`eas.json`)

| Perfil | Tipo | Uso |
|---|---|---|
| `development` | APK debug | Dev com Expo DevClient |
| `preview` | APK release | Distribuição interna / entrega Sprint |
| `production` | AAB | Google Play Store |

---

## 🎯 Fluxos Implementados (Sprint 3)

### Autenticação
- [x] Login com e-mail e senha
- [x] Cadastro de nova conta
- [x] Login social com Google (OAuth)
- [x] Login com Apple ID (iOS)
- [x] Persistência de sessão (AsyncStorage)
- [x] Logout

### Dashboard (Home)
- [x] Saudação personalizada (bom dia/tarde/noite)
- [x] Status do veículo ativo com quilometragem
- [x] Barra de progresso até a próxima revisão
- [x] Alertas de manutenção (verde/amarelo/vermelho)
- [x] Atalhos rápidos para todas as seções
- [x] Histórico recente de serviços
- [x] Banner de oficinas parceiras

### Veículo (VIN/Chassi)
- [x] Cadastro de veículo por VIN (17 dígitos)
- [x] Validação do código VIN
- [x] Exibição de dados completos do veículo
- [x] KPIs: quilometragem, serviços, valor investido
- [x] Progress bar da próxima manutenção
- [x] Dados gravados no Firebase por ownerId

### Histórico de Serviços
- [x] Lista com todos os serviços registrados
- [x] Filtro por tipo de serviço
- [x] Cards expandíveis com detalhes completos
- [x] Badge "Verificado Ford" nos serviços chancelados
- [x] Badge de certificação (Concessionária / Service Partner)
- [x] Notas e observações do técnico
- [x] KPIs: total de serviços, valor investido, verificados Ford

### Agendamento (Wizard 4 passos)
- [x] Passo 1: Seleção do tipo de serviço (grid visual)
- [x] Passo 2: Seleção da oficina (com avaliação e distância)
- [x] Passo 3: Data, horário e observações
- [x] Passo 4: Resumo e confirmação
- [x] Cancelamento de agendamentos
- [x] Histórico de agendamentos passados

### Oficinas Parceiras
- [x] Lista de concessionárias e Ford Service Partners
- [x] Filtro por tipo de certificação
- [x] Cards expandíveis com endereço, horário e especialidades
- [x] Botão direto para WhatsApp (link wa.me)
- [x] Botão de ligação telefônica
- [x] Informativo sobre o programa Ford Service Partner

### Notificações
- [x] Central de notificações com ícones por tipo
- [x] Indicador de não-lidas
- [x] Tipos: lembrete de revisão, confirmação de agendamento, recall, serviço concluído
- [x] Tempo relativo (há X min/h/dias)

### Perfil
- [x] Dados da conta (nome, e-mail, provider)
- [x] Edição de telefone
- [x] Card da missão Ford Nexus
- [x] Informações do projeto (equipe, versão)
- [x] Logout com confirmação

---

## 🎨 Identidade Visual

| Token | Valor | Uso |
|---|---|---|
| `fordBlue` | `#00274F` | Cor primária (headers, botões principais) |
| `fordBlueLight` | `#0066CC` | Ações, links, destaques |
| `fordBluePale` | `#E8F0FB` | Fundos de cards, badges suaves |
| `white` | `#FFFFFF` | Superfícies de cards |
| `background` | `#F5F7FA` | Fundo geral das telas |
| `textPrimary` | `#0D1B2A` | Texto principal |

---

## 🧑‍💻 Equipe

| Nome | RA | Responsabilidade |
|---|---|---|
| Ana Clara Melo | — | UX, fluxo de problema e evidências |
| David Murillo de Oliveira Soares | — | Solução técnica V1, agente WhatsApp |
| Lucas Serrano | — | Mobile Development, V2 Service Partner |
| Yasmim Gonçalves | — | Modelo de negócio, métricas e execução |

---

## 📋 Critérios Sprint 3 — Mobile Development

| Critério | Status |
|---|---|
| ✅ Versão final publicável em APK | EAS Build configurado (`eas.json`) |
| ✅ Todos os fluxos do desafio Ford funcionando | 8 telas com todos os fluxos completos |
| ✅ Identidade visual consolidada | Design System Ford (theme.ts) com tokens consistentes |
| ✅ Consistência de componentes, cores e tipografia | Components library completa |
| ✅ README completo | Este documento |
| ✅ Código organizado | Estrutura modular por camada (screens/services/contexts/hooks) |
| ✅ Demonstração visual de todas as telas | 8 telas totalmente implementadas |
| ✅ Build final em APK via Expo EAS Build | Perfis `preview` e `production` configurados |

---

## 📋 Imagens das Telas
<img width="737" height="789" alt="Captura de Tela 2026-09-27 às 21 26 44" src="https://github.com/user-attachments/assets/b2ab29fd-b648-48e2-af42-0bb83cddefc8" />
<img width="739" height="785" alt="Captura de Tela 2026-09-27 às 21 26 20" src="https://github.com/user-attachments/assets/ced23832-ffed-48ce-aa54-fa490e93af9a" />
<img width="749" height="783" alt="Captura de Tela 2026-09-27 às 21 26 36" src="https://github.com/user-attachments/assets/9b371b41-f40e-4844-9e0b-933c01fb81a8" />
<img width="737" height="789" alt="Captura de Tela 2026-09-27 às 21 26 44" src="https://github.com/user-attachments/assets/e867fecc-4bcf-4632-a2ee-e0601bc95c9d" />


*Ford Nexus · FIAP · 2024 — Sprint 3 entrega: 27/09*
