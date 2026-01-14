# Architecture & Integration Plan

**Date:** 2026-01-13
**Status:** Draft / Proposed
**Owner:** Architecture & Integration Agent

## 1. Current State Architecture

### 1.1 Overview

The Zirtually application is currently a **Client-Side Single Page Application (SPA)** built with React and Vite. It relies almost entirely on local executions and static mock data, with no persistent backend or database layer.

### 1.2 Component & Service Map

```mermaid
graph TD
    Client[Client Browser]

    subgraph Frontend [React SPA (Vite)]
        Router[App Routes]
        Auth[Auth Hook (useAuth)]
        Notify[Notification Service]
        Context[Global Contexts]

        subgraph Views
            Dash[Dashboard]
            Profile[Profile]
            Ops[Operations Views]
        end

        subgraph Data_Layer
            Mock[constants.ts (Mock Data)]
            Local[localStorage]
        end

        subgraph Agents
            Nova[Nova Assistant]
            Scribe[Clinical Scribe]
        end
    end

    subgraph External_Services
        GenAI[Google GenAI API]
    end

    Client --> Router
    Router --> Views
    Views --> Context
    Views --> Auth
    Views --> Notify

    Auth .-> Mock
    Auth .-> Local

    Scribe -- "API Key (Env)" --> GenAI

    Nova --> Context
```

### 1.3 Data Flow Analysis

- **Primary Data Source:** `constants.ts` (Static Arrays).
- **Persistence:**
  - `localStorage`: Used for User Profile updates, Industry selection, Theme, and Notification history.
  - **Volatile:** All other creates/updates (Goals, Tasks, Reviews) are lost on page refresh.
- **State Management:**
  - **Global:** React Context (`SettingsContext`, `IndustryContext`, `NovaContext`).
  - **Local:** Component-level `useState`.
- **Authentication:** Simulated. No tokens, no sessions, no server-side validation.

### 1.4 Integration Patterns (Current)

| Integration Point | Pattern         | Mechanism             | Status               |
| ----------------- | --------------- | --------------------- | -------------------- |
| **Google GenAI**  | Direct API Call | `GoogleGenAI` SDK     | Active / Client-Side |
| **Notifications** | Browser API     | `window.Notification` | Active               |
| **Data Access**   | Direct Import   | `import { MOCK_... }` | **High Coupling**    |
| **Routing**       | Client-Side     | `react-router-dom`    | Active               |

---

## 2. Integration Risk Register

| ID       | Risk Item                   | Impact                                                         | Severity     | Brittleness Factor | Mitigation Strategy                                    |
| -------- | --------------------------- | -------------------------------------------------------------- | ------------ | ------------------ | ------------------------------------------------------ |
| **R-01** | **No Backend Persistence**  | Data loss on refresh; unusable for real workflows.             | **Critical** | High               | Implement DB (PostgreSQL) + API.                       |
| **R-02** | **Client-Side API Keys**    | Exposure of GenAI keys if not proxied.                         | **High**     | Medium             | Move AI calls to Server-Side/Edge Functions.           |
| **R-03** | **Tight Coupling to Mocks** | Refactoring to real API requires touching every component.     | **High**     | High               | Introduce Service Layer / Adapter Pattern immediately. |
| **R-04** | **Simulated Auth**          | No security; anyone can act as anyone.                         | **Critical** | High               | Implement OIDC/OAuth2 (e.g., Auth0, Supabase).         |
| **R-05** | **Environment Drift**       | "Works on my machine" issues due to lack of Docker/Env parity. | Medium       | Medium             | Dockerize dev environment; CI/CD pipelines.            |
| **R-06** | **Mock Data Scalability**   | Large bundle size as data grows (`constants.ts`).              | Medium       | Low                | Move data to remote source.                            |

---

## 3. Target-State Architecture (Blueprint)

### 3.1 Architecture Overview

Move to a **Three-Tier Architecture** or **BFF (Backend for Frontend)** pattern to ensure security, persistence, and scalability.

**Proposed Stack:**

- **Frontend:** React + Vite (Existing) + **TanStack Query** (Data Fetching).
- **Backend / BFF:** Node.js (Express or NestJS) OR Next.js (Fullstack).
- **Database:** PostgreSQL (Relational Data for Users, Companies, Tasks).
- **AI Gateway:** Middleware to proxy GenAI calls and handle rate limiting/context.

### 3.2 Target Diagram

```mermaid
graph TD
    User[User Device]

    subgraph Frontend_Tier [Frontend (React)]
        UI[UI Components]
        Query[TanStack Query]
        AuthClient[Auth Provider]
    end

    subgraph API_Tier [Backend API / BFF]
        Gateway[API Gateway / Router]
        AuthServ[Auth Service]
        BizLogic[Business Logic]
        AIGuard[AI Guardrails]
    end

    subgraph Data_Tier [Persistence]
        DB[(PostgreSQL)]
        Cache[Redis]
        Blob[Object Storage]
    end

    subgraph External
        Google[Google Gemini]
        SendGrid[Email Service]
    end

    User --> UI
    UI --> Query
    Query -- HTTPS/REST/GraphQL --> Gateway

    Gateway --> AuthServ
    Gateway --> BizLogic
    Gateway --> AIGuard

    BizLogic --> DB
    AIGuard --> Google

    AuthServ --> DB
```

### 3.3 Staged Migration Plan

#### **Phase 1: Decoupling (Immediate)**

1.  **Create Service Layer:** Stop components from importing `MOCK_DATA` directly.
    - Create `services/userService.ts`, `services/goalService.ts`.
    - Components call `userService.getUser()` which _internally_ returns mock data for now.
2.  **Standardize Interfaces:** Ensure `types.ts` is robust and aligns with expected database schema.

#### **Phase 2: Persistence Foundation (Short Term)**

1.  **Select Backend:** Spin up a lightweight Supabase or Node.js backend.
2.  **Schema Design:** Map `constants.ts` structures to SQL tables.
3.  **Auth Implementation:** Replace `useAuth` mock logic with real JWT-based auth.

#### **Phase 3: Integration Hardening (Medium Term)**

1.  **AI Proxy:** Create a server endpoint `/api/ai/scribe` to hide the API key and enforce PII filtering before sending to Google.
2.  **Notification Webhooks:** Replace local polling with WebSockets or Server-Sent Events (SSE) for real-time updates.

#### **Phase 4: Scalability (Long Term)**

1.  **Optimize Bundles:** Code-splitting and lazy loading (already started).
2.  **Observability:** Implement OpenTelemetry / Sentry for monitoring.

## 4. Immediate Next Steps (Action Items)

1.  **[Refactor]** Create `src/services/` directory and abstract `MOCK_USERS` access.
2.  **[Security]** Audit `ClinicalScribe` to ensure the API key is strictly env-variable based and consider risk of client-side exposure.
3.  **[Data]** Define the SQL Schema for the core entities (User, Goal, Review).
