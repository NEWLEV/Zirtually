# 90-Day Strategic Roadmap

This roadmap sequences the findings from all 8 agent audits into a logical execution plan.

## Phase 1: Foundation & Security (Month 1)
**Theme:** "Stop the Leaks & Build the Floor"

-   **M1.1: Production Authentication (S1)**
    -   Replace `MockAuth` with Supabase/Auth0.
    -   Implement JWT handling and protected route guards.
-   **M1.2: Database Persistence (S2)**
    -   Schema definition for Employees, Goals, and Reviews.
    -   Migrate `MOCK_DATA` into a live Postgres/NoSQL store.
-   **M1.3: Security Baseline (S1)**
    -   Enable SSL, implement basic RBAC (Admin vs. Employee).
    -   Setup initial Audit Logging for sensitive "Review" data.
-   **M1.4: CI/CD Maturity (S3)**
    -   Automated deployments to a real Staging environment.
    -   Integrate SAST (Dependency scanning).

## Phase 2: Feature Integrity & UX (Month 2)
**Theme:** "Make it Work for Real"

-   **M2.1: Data Instrumentation (S2)**
    -   Implement Segment/PostHog for event tracking.
    -   Connect `Analytics.tsx` to real backend telemetry.
-   **M2.2: Accessibility (a11y) Remediation (S2)**
    -   Keyboard nav and ARIA labels for "Nova" and Sidebar.
    -   Contrast fixes for dark mode adherence.
-   **M2.3: Mobile Responsiveness (S3)**
    -   Grid system updates for small-screen productivity.
-   **M2.4: Bulk Data Tools (S2)**
    -   CSV Import for HR Admins to onboard departments.

## Phase 3: Adoption & Scale (Month 3)
**Theme:** "Launch & Support"

-   **M3.1: Pilot Launch (Alpha)**
    -   Deploy Zirtually to a 10-person pilot group.
    -   Weekly feedback syncs.
-   **M3.2: Support Readiness (S3)**
    -   Knowledge Base (KB) populated with top 20 "How-tos".
    -   Support Slack integration for Tier 1 issues.
-   **M3.3: Feature Polish (S4)**
    -   Skill Matrix comparison views.
    -   Manager notification system (Email/Slack).
-   **M3.4: GA Transition**
    -   Executive Review of Pilot metrics (Success KPI check).

## Success Metrics (End of Q1)
1.  **Auth Success Rate:** 100% (No mock login).
2.  **Data Freshness:** Real-time persistence.
3.  **Support Volume:** < 5 tickets/user/month for Pilot.
4.  **Lighthouse Score:** > 90 (Accessibility).
