# Security Findings & Remediation Plan

**Date:** 2026-01-13
**Status:** DRAFT
**Author:** Security–Privacy–IAM Agent

## Executive Summary
The application is currently in a prototype execution mode with **no functional security controls**. Authentication is simulated via local state, and authorization is sporadic or missing at the routing level. Hardcoded PII exists in the source code.

**Overall Risk Level:** Critical 🚨

---

## 1. Authentication (AuthN)
| Finding | Severity | Description | Remediation |
|---------|----------|-------------|-------------|
| **Mock Authentication** | **Critical** | Login is implemented as a simple state selection using `MOCK_USERS`. No password verification, no tokens (JWT), no sessions. | replace `UserContext` with a real Identity Provider (e.g., Auth0, Firebase Auth, or AWS Cognito). |
| **Client-Side State** | **Critical** | User identity is stored in `localStorage` (`zirtually_users`) and can be manipulated by any user via DevTools to escalate privileges. | Move session management to HTTP-only cookies interacting with a secure backend. |

## 2. Authorization (AuthZ) & IAM
| Finding | Severity | Description | Remediation |
|---------|----------|-------------|-------------|
| **Missing Route Guards** | **High** | `AppRoutes.tsx` renders all components regardless of user role. Access control is delegated to individual components (e.g., `AuditLog.tsx`), increasing the risk of accidental exposure. | Implement a `ProtectedRoute` wrapper component that checks `user.role` against required permissions before rendering the route. |
| **Inconsistent Role Checks** | **High** | While `AuditLog` checks for `Admin`, other views may lack these checks. "Security by Convention" is fragile. | Centralize RBAC logic into an `Ability` or `Permission` hook (e.g., `usePermission('can_view_audit_logs')`). |

## 3. Data Privacy & Secrets
| Finding | Severity | Description | Remediation |
|---------|----------|-------------|-------------|
| **Hardcoded PII** | **High** | `constants.ts` contains full names, emails, and photos of "Mock Users". In a real repo, this could leak test data or real employee data if not sanitized. | Remove PII from source code. Use a data seeder or faker library for local development. |
| **Hardcoded Secrets** | **Medium** | Potential for API keys or sensitive config to drift into `constants.ts` or `config` objects without environment variable abstraction. | Ensure all secrets use `import.meta.env` (Vite) and are not committed to git. |

## 4. Dependencies & Infrastructure
| Finding | Severity | Description | Remediation |
|---------|----------|-------------|-------------|
| **Unpinned Dependencies** | **Medium** | `@google/genai`: "latest". This poses a stability and supply-chain risk if a malicious version is published or breaking changes occur. | Pin dependency versions in `package.json` (e.g., `1.2.0` instead of `latest`). |
| **Missing Security Headers** | **Low** | No CSP, HSTS, or X-Frame-Options headers defined (expected for a frontend-only repo, but critical for deployment). | configure strict headers in the production web server (Nginx/Vercel/Netlify). |

---

## Remediation Roadmap

### Phase 1: High Priority (Immediate)
1.  [ ] **Centralize Route Protection**: Create `RequireAuth` and `RequireRole` components in `AppRoutes`.
2.  [ ] **Audit Component Access**: Review all 20+ pages for role checks.
3.  [ ] **Sanitize Mock Data**: Replace realistic PII names with clearly fake data (e.g., "User One", "Admin User") or use `faker.js` dynamically.

### Phase 2: Architecture Fixes (Next Sprint)
1.  [ ] **Implement Auth Provider**: Integrate a real OIDC provider.
2.  [ ] **Secure Storage**: Stop putting User Objects in LocalStorage; store only non-sensitive preferences.

### Phase 3: Hardening
1.  [ ] **Dependency Audit**: Run `npm audit` and pinning.
2.  [ ] **SAST Integration**: Add CodeQL or SonarQube to GitHub Actions.
