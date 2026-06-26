# IownOS 🤖💼

**IownOS** is an autonomous, agentic AI Executive Assistant designed to manage your inbox and schedule. It connects to your Gmail and Google Calendar, retrieves unread emails, analyzes their content using LLMs (Gemini), and takes real-world actions on your behalf—such as creating tasks, scheduling calendar events, and drafting reply emails.

🔗 **Live Demo**: [https://iown-os.vercel.app](https://iown-os.vercel.app) *(Replace with your actual Vercel URL once deployed)*

---

## 🌟 Key Features

- **Autonomous Email Management**: Retrieves unread emails, categorizes them, prioritizes urgency, and automatically drafts professional context-aware replies.
- **Smart Task Extraction**: Automatically creates tasks in your database from actionable items identified within email bodies.
- **Calendar Intelligence**: Checks your current schedule context to schedule meetings and creates Google Calendar events without double-booking.
- **OAuth Integration**: Secure OAuth 2.0 flows for Google Workspace (Gmail + Calendar) with built-in CSRF token protection.
- **Enterprise-Grade Security**: Access and refresh tokens are double-encrypted in transit and stored securely using symmetric **AES-256-GCM** encryption.
- **Execution Monitoring**: Rich run logs that track the status, execution duration, and stats (emails processed, tasks created, drafts written) of every agent execution.

---

## 🏗️ Architecture & Flows

### 1. High-Level System Architecture
The application is built on Next.js 16, utilizing Clerk for authentication, Drizzle ORM for PostgreSQL database interactions, Vercel AI SDK + Gemini 2.5 Flash for model orchestration, and Google APIs for user workspace integrations.

```mermaid
graph TD
    subgraph Client ["Client / Browser"]
        Dashboard["Next.js Frontend (Dashboard)"]
        ClerkUI["Clerk Auth UI"]
    end

    subgraph Server ["Next.js Server / Backend"]
        API["API Layer (auth, agents/run)"]
        AgentCore["Agent Orchestrator (lib/agent.ts)"]
        AIEngine["AI Processing Engine (process-email.ts)"]
        Crypto["AES Encryption Utilities"]
    end

    subgraph Integrations ["Third-Party Integrations"]
        Clerk["Clerk Auth Service"]
        GoogleAPI["Google APIs (Gmail & Calendar)"]
        Gemini["Google Gemini (gemini-2.5-flash)"]
    end

    subgraph Database ["PostgreSQL DB"]
        Drizzle["Drizzle ORM"]
        DB[(Postgres Storage)]
    end

    %% Client Interactions
    Dashboard -->|POST /api/agents/run| API
    ClerkUI -->|Auth tokens| Clerk
    Dashboard -.->|Session Auth| ClerkUI

    %% Server Logic Flow
    API --> AgentCore
    AgentCore -->|Read/Write Integrations| Drizzle
    AgentCore -->|Fetch Context & Execute Actions| GoogleAPI
    AgentCore -->|Analyze with Email Context| AIEngine
    AIEngine -->|Structured Object Request| Gemini
    AgentCore -->|Encrypt / Decrypt Tokens| Crypto

    %% DB Interaction
    Drizzle --> DB
```

---

### 2. Agent Execution Workflow (`runAgent`)
When an agent execution is triggered (either via the "Run Agent Now" dashboard button or an automated cron/webhook), it goes through the following multi-stage agentic pipeline:

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client / Trigger
    participant Backend as Next.js API / runAgent()
    participant Database as PostgreSQL (Drizzle)
    participant Google as Google APIs (Gmail & Calendar)
    participant AI as Vercel AI SDK (Gemini 2.5 Flash)

    Client->>Backend: POST /api/agents/run
    Backend->>Database: Create running record (agent_runs table)
    Backend->>Database: Fetch Google credentials & decrypt OAuth tokens
    
    alt Tokens near expiry (< 5 mins)
        Backend->>Google: Refresh Access Token
        Backend->>Database: Re-encrypt and save new token
    end

    Backend->>Google: Fetch unread emails (newer than 7 days, limit 10)
    
    alt No unread emails
        Backend->>Database: Update agent run as success (No emails)
        Backend->>Client: Return status (Idle / Success)
    end
    
    Backend->>Google: Fetch upcoming calendar events (next 24 hours)

    loop For each unread email (sequential execution)
        Backend->>AI: analyzeWithAI(email, calendarContext)
        Note over AI: Conforms to Zod output schema:<br/>- Priority / Category<br/>- Action Items / Calendar Events<br/>- Draft Reply (if reply needed)
        AI-->>Backend: Return Structured JSON Analysis
        
        loop For each Action Item
            Backend->>Database: Create task (tasks table)
        end
        
        loop For each Calendar Event
            Backend->>Google: Create Calendar Event
        end
        
        alt needsReply is true and draftReply present
            Backend->>Google: Create Gmail Draft response (thread-linked)
        end

        Backend->>Google: Mark email as Read
        Note over Backend: Wait 2s (respect free-tier rate limits)
    end

    Backend->>Database: Complete agent run (log status, actions, metrics)
    Backend->>Client: Return run stats (emails processed, tasks, drafts)
```

---

### 3. Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS {
        uuid id PK
        text clerk_id UK
        text email
        text name
        subscription_status subscription_status
        text subscription_id
        boolean agent_enabled
        boolean onboarding_completed
        jsonb preferences
        timestamp created_at
        timestamp updated_at
    }

    INTEGRATIONS {
        uuid id PK
        uuid user_id FK
        integration_provider provider
        text access_token "Encrypted"
        text refresh_token "Encrypted"
        timestamp expires_at
        text_array scope
        timestamp created_at
    }

    TASKS {
        uuid id PK
        uuid user_id FK
        text title
        text description
        task_status status
        task_priority priority
        timestamp due_date
        boolean created_by_agent
        timestamp created_at
        timestamp completed_at
    }

    AGENT_RUNS {
        uuid id PK
        uuid user_id FK
        agent_run_status status
        text summary
        jsonb actions_log "ProcessedEmail[]"
        integer emails_processed
        integer tasks_created
        integer drafts_created
        text error_message
        timestamp started_at
        timestamp completed_at
        integer duration_ms
    }

    USERS ||--o{ INTEGRATIONS : "has"
    USERS ||--o{ TASKS : "owns"
    USERS ||--o{ AGENT_RUNS : "executes"
```

---

## 📂 Codebase Structure

```
iown-os/
├── app/
│   ├── (auth)/             # Clerk authentication route pages
│   ├── (main)/dashboard/   # Dashboard core application space
│   │   ├── mail/           # Inbox and email views
│   │   ├── monitor/        # Execution logs and stats monitor page
│   │   ├── settings/       # Integration connections (Gmail & Google Calendar)
│   │   ├── layout.tsx      # Sidebar navigation and billing guard
│   │   └── page.tsx        # Main dashboard panel & stats summary
│   ├── api/
│   │   ├── agents/run/     # POST endpoint to trigger the AI Agent
│   │   └── auth/google/    # CSRF check, state creation, OAuth redirect & callback
│   ├── layout.tsx          # Root styling, fonts (Montserrat), and ClerkProvider
│   └── globals.css         # Theme design variables, transitions, and landing CSS
├── components/
│   ├── agents/             # RunAgentButton components
│   └── ui/                 # Shadcn customizable UI primitives
├── db/
│   ├── index.ts            # Postgres connection initialization
│   ├── queries.ts          # Core Drizzle DB functions (users, tasks, runs, integrations)
│   └── schema.ts           # PostgreSQL schema (Drizzle-ORM schemas, enums, & TS types)
├── lib/
│   ├── agents/
│   │   ├── calendar.ts     # Google Calendar event retrieval and insertion
│   │   ├── gmail.ts        # Gmail message retrieval, parsing, and draft creation
│   │   └── process-email.ts# Gemini LLM call using Vercel AI SDK generateObject
│   ├── agent.ts            # Orchestrator running the processing loop
│   ├── encryption.ts       # Symmetric AES-256-GCM token encryption
│   ├── google.ts           # Google OAuth Client parameters & URL generators
│   └── google-client.ts    # Google Client instantiators & Token Auto-Refresh logic
├── package.json            # React 19, Next.js 16, Drizzle, Clerk, AI SDK dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## 🔑 Security & Token Encryption
To protect sensitive Google Workspace scopes, `iown-os` never stores plain-text OAuth tokens in the database. Instead, it utilizes symmetric encryption via the Node.js `crypto` module:
- **Algorithm**: `aes-256-gcm` (authenticated encryption with associated data)
- **Keys**: Cryptographic hash generated from the `ENCRYPTION_KEY` environment variable.
- **Storage Format**: `iv:authTag:encryptedCiphertext`
- **Decryption**: Verified and decrypted on-the-fly inside the agent runtime when generating Google API clients.

---

## 🛠️ Local Development Setup

Follow these steps to run IownOS locally:

### 1. Prerequisites
- **Node.js** (v18+) or **Bun** installed
- **PostgreSQL** instance running locally or hosted on Neon/Supabase

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/ArmaanTDL/Iown-os.git
cd iown-os
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/iown_os"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Google Credentials (for OAuth)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Gemini AI API Key
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# AES Token Encryption Key (must be a long random string)
ENCRYPTION_KEY="your-random-aes-256-key"
```

### 4. Database Migrations
Generate and apply database migrations to setup the Postgres tables:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 5. Running the Application
Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view and test the application dashboard.

---

## 📝 License
This project is licensed under the MIT License.
