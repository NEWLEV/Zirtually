# Data & Measurement Agent - Tasks & Responsibilities

**Role:** Data & Measurement Agent
**Owner:** Analytics + Data Engineering
**Focus:** Instrumentation, truth in metrics, continuous improvement.

## Responsibilities

1.  **Instrumentation & Tracking**: Ensure every key user interaction is captured accurately.
2.  **Data Integrity**: Validate that the data flowing into dashboards matches reality.
3.  **Dashboards & Reporting**: define and build the views that stakeholders use to make decisions.
4.  **Continuous Improvement**: Identify gaps in measurement and propose new metrics.

## Active Tasks

### 1. Audit Event Tracking and Analytics Schema

**Status:** In Progress
**Goal:** Ensure key journey events are captured.

- [ ] Audit current codebase for existing tracking calls.
- [ ] Map critical user journeys (Sign up, Onboarding, Profile Creation) to required events.
- [ ] Define a standard event naming convention (e.g., `Object Action Context` -> `Profile Updated Modal`).
- [ ] specific tracking libraries or patterns to be used.
- [ ] Output: **Tracking Audit & Implementation Plan**.

### 2. Build KPI Dashboard Definitions

**Status:** In Progress
**Goal:** Validate accuracy end-to-end.

- [ ] Review existing `Analytics.tsx` implementation.
- [ ] Define the "North Star" metrics for the product (e.g., Active Users, Retention, Time to Value).
- [ ] Specify visualization types and data granularity (Daily/Weekly/Monthly).
- [ ] Output: **KPI Dashboard Spec**.

### 3. Identify Measurement Gaps

**Status:** Pending
**Goal:** Propose instrumentation changes.

- [ ] Compare current hardcoded data against desired business questions.
- [ ] Identify blind spots (e.g., "Where do users drop off during onboarding?").
- [ ] Output: **Metrics Dictionary** (updates).

## Key Artifacts

- [Metrics Dictionary](./Metrics_Dictionary.md)
- [Tracking Audit](./Tracking_Audit.md)
- [KPI Dashboard Spec](./KPI_Dashboard_Spec.md)
