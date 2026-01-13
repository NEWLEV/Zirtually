# Sequencing Roadmap

**Version:** 1.0
**Status:** In Progress
**Last Update:** 2026-01-13

## Milestone 1: Stability & Navigation (DONE)
*Focus: Stabilize the existing SPA, fix broken routes, and implement basic persistence.*
- [x] Audit navigation links and fix broken imports (Reviews, Skills, Org Chart).
- [x] Implement `useLocalStorage` for Performance Review drafts.
- [x] Establish the Product Ops artifact structure.
- [x] Initial Stakeholder Intake (Simulated).

## Milestone 2: Infrastructure & Security (CURRENT)
*Focus: Moving from "Fake" to "Real" backend and security.*
- [ ] **Decoupling Phase:**
    - [ ] Abstract Goal Management into `GoalService`.
    - [ ] Abstract Performance Management into `ReviewService`.
- [ ] **Security (IAM):**
    - [ ] Integrate Auth0/Supabase Auth PoC (B-001/B-007).
    - [ ] Define RBAC (Role-Based Access Control) in the backend.
- [ ] **Persistence:**
    - [ ] Define PostgreSQL Schema for core tables.
    - [ ] Set up local development database (Dockerized).

## Milestone 3: Product Polishing & UX
*Focus: Premium feel, accessibility, and AI assistant hardening.*
- [ ] **UX Redesign:**
    - [ ] Implement new Profile Picker (B-005).
    - [ ] Implement Onboarding Assistant "Nova" (B-006).
- [ ] **Accessibility (A11y):**
    - [ ] Fix Nova Assistant screen reader compatibility (B-013).
    - [ ] Complete full Lighthouse ADA Audit on Dashboard.

## Milestone 4: Enterprise Ready (Expansion)
*Focus: Collaboration and data at scale.*
- [ ] **Data Portability:**
    - [ ] Bulk Review/User CSV Upload (B-008).
- [ ] **Compliance:**
    - [ ] Audit Logging infrastructure (B-009).
- [ ] **Engagement:**
    - [ ] Notification service (Slack/Email) triggers (B-010).
    - [ ] KPI Metrics Dashboard for Admins.

---

## Sequencing Logic
1.  **Workstream Parallelism:** UX/Content and Accessibility work can happen in parallel with Backend/DB work.
2.  **Service Layer Dependency:** Moving to a DB *requires* the Service Layer to be finished first to prevent massive UI churn.
3.  **Auth First:** Real data persistence depends on User IDs being secure/real.
