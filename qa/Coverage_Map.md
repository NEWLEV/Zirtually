# Coverage Map

## Journey / Feature Coverage

| Feature Area | Priority | Unit Tests | Integration | E2E (Cypress) | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Authentication** | P0 | ❌ | ❌ | ✅ `login.cy.ts` | **Improved** |
| **Dashboard** | P0 | ✅ `Dashboard.test.tsx` | ⚠️ Partial | ✅ `dashboard.cy.ts` | **Good** |
| **Profile** | P1 | ✅ `Profile.test.tsx` | ⚠️ Partial | ✅ `Profile.cy.ts` | **Good** |
| **Settings** | P2 | ✅ `Settings.test.tsx`| ⚠️ Partial | ✅ `Settings.cy.ts` | **Good** |
| **Wellness** | P2 | ✅ `Wellness.test.tsx`| ⚠️ Partial | ✅ `Wellness.cy.ts` | **Good** |
| **Goals** | P1 | ❌ | ❌ | ✅ `goals.cy.ts` | **Improved** |
| **Team Management** | P1 | ❌ | ❌ | ❌ | **Gap** |
| **Performance Reviews**| P1 | ❌ | ❌ | ✅ `reviews.cy.ts` | **Improved** |
| **Error Boundary** | P0 | ✅ `src/test/ErrorBoundary.test.tsx` | - | - | **Good** |

## Legend
- ✅ : Covered / Present
- ⚠️ : Partial coverage (happy path only or incomplete)
- ❌ : No existing automated tests
- **Gap** : Needs immediate attention

## Action Items
1.  **Team Management**: Create baseline tests for manager views.
2.  **Audit Log**: Add tests for compliance-critical logs.
3.  **Onboarding**: Automation for the "First 30 Days" journey.
