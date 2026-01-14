# Decision Log

This log tracks key architectural and product decisions made by the Zirtually Agents.

## D-001: Move to 3-Tier Architecture

**Date:** 2026-01-13
**Decision:** Transition from a purely client-side SPA with mock data to a standard 3-tier architecture (React Frontend, Node.js/BFF, PostgreSQL DB).
**Rationale:** Current mock data dependency (`constants.ts`) is a blocker for multi-user collaboration, real-time updates, and data persistence.
**Outcome:** Architecture & Integration Agent created the [Architecture Integration Plan](./Architecture_Integration_Plan.md).

## D-002: Implementation of Service Layer Abstraction

**Date:** 2026-01-13
**Decision:** Introduce a formal Service Layer (`src/services/`) before connecting to a real backend.
**Rationale:** To minimize the impact of refactoring on UI components. Components should not know if data is coming from a mock file or a real API.
**Outcome:** `UserService.ts` implemented as the first abstraction.

## D-003: User Profile Picker for MVP

**Date:** 2026-01-13
**Decision:** Redesign the login screen as a "Profile Picker" rather than a standard username/password field for the initial demo.
**Rationale:** In a mock data environment, it's easier to switch between roles (Admin/Manager/IC) to verify features than to remember credentials.
**Outcome:** UX & Content Agent provided specs for the [Profile Picker Redesign](./UX_FINDINGS_REPORT.md).

## D-004: LocalStorage for Short-Term Persistence

**Date:** 2026-01-13
**Decision:** Use `localStorage` to persist "Draft" states (e.g., Performance Reviews) immediately.
**Rationale:** Provides immediate value/reliability to users while the backend tier is being developed.
**Outcome:** B-011 resolved in `PerformanceReviews.tsx`.

## D-005: Dual-Palette Nature Focus Design

**Date:** 2026-01-13
**Decision:** Standardize on a nature-inspired design system with high-contrast dark mode support.
**Rationale:** Aligns with wellness goals and reduces eye strain for employees spending long hours in the platform.
**Outcome:** `nature-focus-palette.css` and implementation guide created.
