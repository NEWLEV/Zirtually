# Release Acceptance Criteria (Quality Gates)

## 1. Code Quality Gates
- [ ] **Linting**: No ESLint errors (warnings should be minimized).
- [ ] **Formatting**: Code must differ to Prettier standards.
- [ ] **Type Safety**: No TypeScript compile errors (`tsc --noEmit` passes).

## 2. Testing Gates
- [ ] **Unit Tests**: 100% pass rate for existing suite.
- [ ] **E2E Tests**: 100% pass rate for critical regression suite (Cypress).
- [ ] **Coverage**: New components must have at least basic rendering tests. Target global coverage: >40% (initial), >70% (long-term).

## 3. Functional Gates
- [ ] **Critical Bugs**: Zero (0) open Critical or High severity bugs.
- [ ] **UX Review**: Product Owner / Designer approval on UI changes.
- [ ] **Smoke Test**: Manual pass of the "Golden Path" on the staging environment.

## 4. Process Gates
- [ ] **Change Log**: Release notes prepared.
- [ ] **Version Bump**: `package.json` version incremented correctly.
