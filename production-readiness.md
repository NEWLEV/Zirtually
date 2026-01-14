# Production Readiness & Deployment Plan

**Application:** Zirtually (React/Vite SPA)
**Target Infrastructure:** Modern Cloud (AWS/Vercel) + CI/CD (GitHub Actions)

## 1. Environment Strategy

We will establish three distinct environments to ensure stability and testing coverage before reaching production.

| Environment     | Branch      | URL Strategy                 | Purpose                                                                     |
| :-------------- | :---------- | :--------------------------- | :-------------------------------------------------------------------------- |
| **Development** | `feature/*` | `feat-xyz.zirtually-dev.com` | Ephemeral environments for PRs. Automated functional testing.               |
| **Staging**     | `main`      | `staging.zirtually.com`      | Integration testing, UAT, and final QA sign-off. Mirrors production config. |
| **Production**  | `release/*` | `app.zirtually.com`          | Live traffic. Immutable deployments.                                        |

### Configuration Management

- **Strict Separation**: No hardcoded secrets in code.
- **Method**: Use `.env` files loaded at build time (Vite) for public variables (e.g., API endpoints).
- **Secrets**: Store sensitive keys (e.g., third-party API keys) in GitHub Secrets and inject them during the build process.

## 2. Dependency Management & Version Control

- **Lockfile Policy**: `package-lock.json` MUST be committed.
- **Installation**: Use `npm ci` (Clean Install) in CI/CD to ensure exact dependency tree reproduction.
- **Version Strategy**: Semantic Versioning (SemVer). Tag releases (e.g., `v1.2.0`) in Git.

## 3. Security Hardening

- **Static Analysis (SAST)**:
  - Run `npm run lint` to enforce code quality.
  - Integrate **SonarQube** or **CodeQL** in GitHub Actions.
- **Dependency Scanning**:
  - Run `npm audit` in the pipeline.
  - Enable **Dependabot** or **Snyk** for automated vulnerability alerts.
- **Secret Detection**:
  - Implement **GitGuardian** or `trufflehog` pre-commit hooks to prevent committing API keys.

## 4. CI/CD Pipeline Configuration (GitHub Actions)

We will use a multi-stage pipeline. If any stage fails, the deployment aborts.

### Pipeline Stages via `workflow.yml`

1.  **Validate**:
    - Checkout code.
    - `npm ci` (Install dependencies).
    - `npm run lint` (Check style).
    - `npm run typecheck` (TypeScript validation: `tsc --noEmit`).
2.  **Test**:
    - `npm test` (Unit tests via Vitest).
    - `npm run cy:run` (E2E tests via Cypress - headless).
3.  **Build**:
    - `npm run build` (Vite production build).
    - Archive build artifacts (`dist/` folder).
4.  **Deploy (Staging/Prod)**:
    - Fetch artifacts.
    - Deploy to hosting provider (e.g., AWS S3/CloudFront or Vercel).
    - **Zero-Downtime Strategy**: Blue/Green deployment (built-in with Vercel/Netlify/Amplify) or immutable S3 bucket versions switched via CloudFront.

## 5. Deployment Architecture (AWS S3 + CloudFront)

Since Zirtually is a standard SPA, we should avoid complex container orchestration (K8s) unless a backend requires it.

- **Storage**: AWS S3 (configured for static website hosting).
- **CDN**: AWS CloudFront (SSL offloading, global caching, DDoS protection via WAF).
- **Routing**: React Router handles client-side; CloudFront configured to redirect 404s to `index.html`.

## 6. Observability & Monitoring

- **Error Tracking**: Implement **Sentry.io** to capture client-side React crashes and exceptions.
- **Performance**: **LogRocket** or **Datadog RUM** to monitor Core Web Vitals (LCP, CLS, FID).
- **Uptime**: **Pingdom** or **AWS Route53 Health Checks** pointing to the login page.

## 7. Rollback Strategy

We prioritize **Mean Time to Recovery (MTTR)**.

- **Strategy**: "Roll forward" to previous known good artifact.
- **Mechanism**:
  1.  Identify failure in Production.
  2.  Trigger "Revert" workflow in GitHub Actions.
  3.  Pipeline redeploys the _previous_ Git tag artifact.
- **Database**: Not applicable for frontend-only revert, but if backend schemas change, database backward compatibility must be maintained for N-1 version support.

## 8. Final Readiness Validation

- [ ] **Build check**: Does `npm run build` succeed locally without warnings?
- [ ] **Test coverage**: Are critical paths (Login, Profile, Settings) covered by Cypress tests?
- [ ] **Linting**: Is the codebase clean of basic errors?
- [ ] **Environment Variables**: Are `VITE_API_URL` and others defined for Prod?
- [ ] **Performance**: Has an initial Lighthouse audit been run?

## Recommendation

For the fastest path to a robust, zero-downtime production environment with automatic rollbacks, **Vercel** is highly recommended over raw AWS handling for this specific tech stack (Vite/React). If strict AWS compliance is required, use **AWS Amplify Console**.
