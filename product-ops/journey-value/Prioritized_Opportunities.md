# Prioritized Opportunity List

## Strategy: "Fix the Foundation, Then WOW with AI."

## Tier 1: Must-Fix (Critical Value Gaps)

_These issues prevent the product from being "viable" beyond a simple visual demo._

1.  **System-Wide Data Persistence (B-011)**
    - _Context_: Persistence was added to Performance Reviews, but is missing in Profile, Goals, and Task completion.
    - _Impact_: **Critical**. Trust killer if user input is lost.
    - _Action_: Expand `useLocalStorage` usage across all input-heavy components.

2.  **Live Audit Logging Integration (B-009)**
    - _Context_: The Audit Log UI is currently a static mock, disconnected from real system events.
    - _Impact_: **High**. Compliance and security are core value props for Zirtually.
    - _Action_: Connect the `createAuditLog` helper to the Audit Log UI (via a globally accessible store or context).

3.  **Real-Time Data-Driven Balances**
    - _Context_: Time-off balances are hardcoded in `TimeOff.tsx`.
    - _Impact_: **High**. Breaks the "System of Record" promise.
    - _Action_: Drive balances from the `User` object or a centralized accrual logic.

4.  **Role-Specific Data Contexts**
    - _Context_: Managers need to see their specific team members, not the entire org or a generic mock list.
    - _Impact_: **High**. Essential for validating Manager workflows.
    - _Action_: Implement filtering logic based on the logged-in user's `managerId` and `role`.

## Tier 2: Nice-to-Have (Product Differentiators)

_These features add significant premium value and "WOW" factor._

5.  **AI-Assisted Writing (Magic Draft)**
    - _Context_: Users struggle to word performance reviews or job descriptions.
    - _Solution_: Integrate GenAI to turn bullet points into professional prose.
    - _Value_: High differentiation and user retention.

6.  **Nova "Smart Nudges"**
    - _Context_: Notifications are currently generic.
    - _Solution_: Logic-driven triggers (e.g., "It's Been 90 days since your last 1-on-1 with Sarah").
    - _Value_: Turns the platform into a proactive "Assistant" rather than a passive portal.

7.  **Dynamic Org Chart Interaction**
    - _Context_: Org chart is currently a static view.
    - _Solution_: Interactive nodes, drag-and-drop for re-org simulations.
    - _Value_: Powerful demo tool for HR Admins.

## Tier 3: Future / Roadmap

8.  **Predictive Retention Analytics**: Sentiment analysis on feedback to flag churn risk.
9.  **Automated Provisioning**: Real integrations with Slack/GitHub/Jira for onboarding.

## Immediate Recommendation

**"Connect the Wiring"**: Before adding AI features, we must connect the existing UI (Audit Logs, Time Off, Team Hub) to real (persisted) data state. A user action in `Profile.tsx` should immediately show up in `AuditLog.tsx`.
