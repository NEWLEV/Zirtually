# Findings Backlog Artifact

**Status:** Open
**Owner:** Orchestrator Agent

## Severity Definitions

- **S1 (Critical)**: Blocker, security vulnerability, implementation missing for core flows.
- **S2 (High)**: Major UX friction, feature partial failure, performance degradation.
- **S3 (Medium)**: Minor bug, UI inconsistency, text error.
- **S4 (Low)**: Polishing, nice-to-have, refactor.

## Backlog

| ID        | Description                                                                                                                         | Severity | Effort | Owner       | Dependency | Acceptance Criteria                                              | Status       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ----------- | ---------- | ---------------------------------------------------------------- | ------------ |
| **B-001** | **Missing Production Auth**<br>No real authentication provider integrated; relying on mock state.                                   | **S1**   | L      | Tech Lead   | -          | Auth0/Firebase implemented; secured routes.                      | Open         |
| **B-002** | **Broken Page Imports**<br>Pages (Reviews, OrgChart, Skills) verified as **WORKING** in latest audit (Orchestrator).                | **S1**   | M      | FE Agent    | -          | All nav links load without error boundaries triggering.          | **Resolved** |
| **B-003** | **Mock Data Dependency**<br>App relies heavily on local mock files; no DB connection.                                               | **S2**   | XL     | BE Agent    | B-001      | Real database connected (Supabase/Postgres).                     | Open         |
| **B-004** | **Accessibility Audit & Fixes**<br>Added `aria-label` to nav, `aria-live` to Nova, and improved focus styles.                       | **S2**   | M      | FE Agent    | -          | Lighthouse score > 90; ARIA on dynamic content.                  | **Resolved** |
| **B-005** | **Profile Picker Redesign**<br>Enhance the login/profile selection screen per UX specs.                                             | **S3**   | M      | FE Agent    | -          | New sticky footer, hover states, clear hierarchy.                | **Resolved** |
| **B-006** | **Onboarding Assistant "Nova"**<br>Implement context-aware tips and idle detection.                                                 | **S3**   | L      | FE Agent    | -          | Nova appears on dashboard; responds to clicks.                   | **Resolved** |
| **B-007** | **SSO Integration**<br>IT Requirement: Support Okta/Google Workspace auth.                                                          | **S1**   | L      | Tech Lead   | B-001      | SSO Login flow functional.                                       | New          |
| **B-008** | **Data Import/Export**<br>HR Requirement: Bulk upload for reviews/users (CSV).                                                      | **S2**   | M      | BE Agent    | B-003      | CSV upload parses correctly to DB.                               | New          |
| **B-009** | **Disconnected Audit Logging**<br>Audit UI shows static mocks; does not display real implementation events (Logins, profile edits). | **S1**   | M      | FE/BE Agent | -          | Action events from `createAuditLog` appear in real-time in UI.   | **Resolved** |
| **B-010** | **Notification Infrastructure**<br>Managers need email/Slack nudges for due dates.                                                  | **S3**   | L      | BE Agent    | -          | Notification service defined.                                    | New          |
| **B-011** | **Data Persistence Loss**<br>Forms (Performance Reviews, Profile) lose data on refresh. Risk to user trust.                         | **S1**   | M      | FE Agent    | -          | Drafts persist across page reloads (Local Storage MVP).          | **Resolved** |
| **B-012** | **Form Silent Failures**<br>Clicking "Add Skill" with empty fields does nothing. No feedback.                                       | **S2**   | S      | FE Agent    | -          | Inline error messages displayed on invalid submit.               | **Resolved** |
| **B-013** | **Nova Assistant A11y**<br>AI tips appear without screen reader announcement.                                                       | **S2**   | S      | FE Agent    | -          | Add `aria-live="polite"` to container.                           | **Resolved** |
| **B-014** | **Missing Empty States**<br>Lists (Skills, Credentials) look broken when empty.                                                     | **S3**   | S      | FE Agent    | -          | `EmptyState` component displayed when no data.                   | **Resolved** |
| **B-015** | **Hardcoded PII in Source**<br>Mock data files (`constants.ts`) contain realistic full names, emails, and photos.                   | **S1**   | S      | Tech Lead   | -          | Replace realistic PII with generic test data (e.g., "User One"). | Open         |
| **B-016** | **Unpinned Dependencies**<br>Critical SDKs (e.g., `@google/genai`) use "latest" versions.                                           | **S3**   | S      | Tech Lead   | -          | Pin all dependencies in `package.json` to fixed versions.        | Open         |
| **B-017** | **Missing Security Headers**<br>No CSP, HSTS, or X-Frame-Options configured.                                                        | **S2**   | M      | DevOps      | -          | Implement strict headers in production hosting config.           | Open         |
| **B-018** | **Hardcoded Time-Off Balances**<br>`TimeOff.tsx` uses hardcoded values instead of User employment data.                             | **S2**   | S      | FE Agent    | -          | Balances reflect real accrual logic/User fields.                 | **Resolved** |
| **B-019** | **Static Org Chart Status**<br>Org chart does not reflect real-time role changes or promotions.                                     | **S3**   | M      | FE Agent    | -          | Org nodes update dynamically when user data changes.             | **Resolved** |
| **B-020** | **Deep Navigation Friction**<br>Users lose context when navigating deep (Performance, Goals, Profile).                              | **S3**   | S      | FE Agent    | -          | Breadcrumbs integrated into all major screens.                   | **Resolved** |
