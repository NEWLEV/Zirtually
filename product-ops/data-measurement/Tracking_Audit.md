# Tracking Audit & Implementation Plan

**Date:** 2026-01-13
**Status:** Critical Gaps Found

## Executive Summary
A code-level audit of the `Zirtually` application reveals that **no client-side or server-side event tracking is currently implemented.** The application relies entirely on mock data for its analytics display. There are no calls to external analytics providers (e.g., Google Analytics, Segment, Mixpanel, PostHog) and no internal logging mechanism for user actions.

## Current State Analysis
-   **Instrumentation:** None.
-   **Libraries:** No analytics libraries found in `package.json` or imported in components.
-   **Data Flow:** `Analytics.tsx` renders static `MOCK_ANALYTICS` data.
-   **User Identification:** No mechanism to tie actions to specific user IDs for behavioral analysis.

## Critical Gaps
1.  **Zero Visibility:** We cannot answer basic questions like "How many users logged in today?" or "Which features are used most?".
2.  **Blind Onboarding:** We do not know where potential users drop off during the sign-up or profile creation flows.
3.  **Feature Adoption:** We cannot measure the success of new features (e.g., the new Profile Picker).

## Implementation Plan

### Phase 1: Foundation (Week 1)
1.  **Select Analytics Provider:**
    *   *Recommendation:* **PostHog** (Open source, handles autocapture, session recording, and feature flags) or **Segment** (Industry standard for routing data).
2.  **Create Wrapper Component:**
    *   Implement a `useAnalytics` hook or context provider to abstract the vendor.
    *   Example: `track('Event Name', { properties })`.
3.  **Instrument Core Page Views:**
    *   Track route changes automatically.

### Phase 2: Key Journeys (Week 2)
Instrument the following high-value interactions:

| Journey | Event Name | Properties | Trigger |
| :--- | :--- | :--- | :--- |
| **Auth** | `User Signed Up` | `method`, `source` | Successful registration |
| **Auth** | `User Logged In` | `method` | Successful login |
| **Onboarding** | `Onboarding Step Completed` | `step_name`, `time_spent` | Clicking "Next" in wizard |
| **Profile** | `Profile Updated` | `section_changed` | Save profile changes |
| **Navigation** | `Navigation Item Clicked` | `label`, `destination` | Sidebar/Menu clicks |

### Phase 3: Validation
1.  Verify events are firing in the browser console (debug mode).
2.  Verify events are arriving in the analytics dashboard.
3.  Validate schema (property types and required fields).
