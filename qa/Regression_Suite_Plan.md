# Regression Suite Plan

## 1. Purpose

To ensure that new changes do not break existing critical functionality. This suite should be run before every release.

## 2. Critical Paths (Must-Pass)

### 2.1 Authentication & Onboarding

- [ ] User can login with valid credentials.
- [ ] User is redirected to Dashboard after login.
- [ ] User cannot login with invalid credentials (error message shown).
- [ ] User can logout.

### 2.2 Profile Management

- [ ] **Profile View**: User can view their own profile details.
- [ ] **Edit Profile**: User can update editable fields (e.g., bio, skills) and save.
- [ ] **Validation**: Invalid inputs are rejected (e.g., empty required fields).

### 2.3 Dashboard & Navigation

- [ ] Dashboard loads with key widgets (Goals, Team, Quick Actions).
- [ ] Navigation menu links work and route to correct pages.
- [ ] Responsive check: Menu works on mobile/tablet breakpoints.

### 2.4 Performance Management (Core Value)

- [ ] **Goals**: User can create a new goal.
- [ ] **Goals**: User can update progress on an existing goal.
- [ ] **Reviews**: Manager can open a pending review.
- [ ] **Reviews**: Manager can submit a review (happy path).

## 3. Execution Frequency

- **Automated Suite**: Runs on every PR merge to `main`.
- **Manual Sanity Check**: Performed by QA/Product Owner before major version deployment.

## 4. Current Coverage Status

- **Automated**: `Profile`, `Settings`, `Wellness` components have baseline tests.
- **Missing**: Login flow, Goal creation, Dashboard integration tests are currently gaps.

## 5. Expansion Plan (Next 2 Sprints)

1.  Add Cypress E2E test for **Login Flow**.
2.  Add Cypress E2E test for **Goal Creation**.
3.  Add Unit tests for `useAuth` or equivalent context logic.
