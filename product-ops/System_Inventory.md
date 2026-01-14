# System Inventory Artifact

**Last Updated:** 2026-01-13
**Status:** Initial Discovery

## Repositories

| Repo Name       | Location       | Description                  | Tech Stack                 |
| --------------- | -------------- | ---------------------------- | -------------------------- |
| **Zirtually-1** | Local / GitHub | Main application repository. | Vite, React 18, TypeScript |

## Services & Components

| Service           | Type        | Tech / Version         | Status     | Notes                                  |
| ----------------- | ----------- | ---------------------- | ---------- | -------------------------------------- |
| **Frontend**      | SPA         | React 18.3.1, Vite 6.2 | Active     | Code relocated to `src/`.              |
| **Service Layer** | Abstraction | TypeScript             | **Active** | `services/userService.ts` implemented. |
| **Testing**       | Unit        | Vitest                 | Active     | Configured in `vitest.config.ts`.      |
| **Testing**       | E2E         | Cypress                | Active     | Configured in `cypress/`.              |
| **AI Engine**     | Integration | Google GenAI SDK       | Active     | `@google/genai` dependency.            |

## Environments

| Environment     | URL                             | CI Workflow         | Status         |
| --------------- | ------------------------------- | ------------------- | -------------- |
| **Development** | `http://localhost:3000`         | N/A                 | Active (Local) |
| **Staging**     | `https://staging.zirtually.com` | `deploy-staging`    | Placeholder    |
| **Production**  | `https://app.zirtually.com`     | `deploy-production` | Placeholder    |

## Integrations & Vendors

| Vendor/Tool        | Purpose            | Integration Method    | Status     |
| ------------------ | ------------------ | --------------------- | ---------- |
| **Google GenAI**   | AI/LLM Features    | SDK (`@google/genai`) | Integrated |
| **GitHub Actions** | CI/CD              | `.github/workflows`   | Configured |
| **Framer Motion**  | Animations         | Library               | Integrated |
| **Recharts**       | Data Visualization | Library               | Integrated |

## Data Stores

| Name            | Type         | Location           | Status         |
| --------------- | ------------ | ------------------ | -------------- | ---------------------------- |
| **Mock Data**   | JSON/Local   | `src/constants.ts` | Primary Source |
| **Local Cache** | LocalStorage | Browser API        | **Active**     | Persists User/Review drafts. |
| _TBD_           | _Database_   | _Cloud_            | _Not Found_    | Target: PostgreSQL/Supabase. |

## IAM / SSO

| Provider      | Method | Scope       | Notes                                               |
| ------------- | ------ | ----------- | --------------------------------------------------- |
| **User Data** | Mock   | Local State | Current auth is likely simulated via mock profiles. |

## Logs & Monitoring

| Tool             | Scope        | Status    | Notes                              |
| ---------------- | ------------ | --------- | ---------------------------------- |
| **Console**      | Local        | Active    | Standard browser logging.          |
| _Sentry/Datadog_ | _Production_ | _Missing_ | No production monitoring detected. |
