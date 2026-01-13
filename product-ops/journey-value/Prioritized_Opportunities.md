# Prioritized Opportunity List

## Strategy: "Fix the Foundation, Then WOW with AI."

## Tier 1: Must-Fix (Critical Value Gaps)
*These issues prevent the product from being "viable" beyond a simple visual demo.*

1.  **System-Wide Data Persistence (B-011)**
    *   *Context*: Persistence was added to Performance Reviews, but is missing in Profile, Goals, and Task completion.
    *   *Impact*: **Critical**. Trust killer if user input is lost.
    *   *Action*: Expand `useLocalStorage` usage across all input-heavy components.

2.  **Live Audit Logging Integration (B-009)**
    *   *Context*: The Audit Log UI is currently a static mock, disconnected from real system events.
    *   *Impact*: **High**. Compliance and security are core value props for Zirtually.
    *   *Action*: Connect the `createAuditLog` helper to the Audit Log UI (via a globally accessible store or context).

3.  **Real-Time Data-Driven Balances**
    *   *Context*: Time-off balances are hardcoded in `TimeOff.tsx`.
    *   *Impact*: **High**. Breaks the "System of Record" promise.
    *   *Action*: Drive balances from the `User` object or a centralized accrual logic.

4.  **Role-Specific Data Contexts**
    *   *Context*: Managers need to see their specific team members, not the entire org or a generic mock list.
    *   *Impact*: **High**. Essential for validating Manager workflows.
    *   *Action*: Implement filtering logic based on the logged-in user's `managerId` and `role`.

## Tier 2: Nice-to-Have (Product Differentiators)
*These features add significant premium value and "WOW" factor.*

5.  **AI-Assisted Writing (Magic Draft)**
    *   *Context*: Users struggle to word performance reviews or job descriptions.
    *   *Solution*: Integrate GenAI to turn bullet points into professional prose.
    *   *Value*: High differentiation and user retention.

6.  **Nova "Smart Nudges"**
    *   *Context*: Notifications are currently generic.
    *   *Solution*: Logic-driven triggers (e.g., "It's Been 90 days since your last 1-on-1 with Sarah").
    *   *Value*: Turns the platform into a proactive "Assistant" rather than a passive portal.

7.  **Dynamic Org Chart Interaction**
    *   *Context*: Org chart is currently a static view.
    *   *Solution*: Interactive nodes, drag-and-drop for re-org simulations.
    *   *Value*: Powerful demo tool for HR Admins.

## Tier 3: Future / Roadmap
8.  **Predictive Retention Analytics**: Sentiment analysis on feedback to flag churn risk.
9.  **Automated Provisioning**: Real integrations with Slack/GitHub/Jira for onboarding.

## Immediate Recommendation
**"Connect the Wiring"**: Before adding AI features, we must connect the existing UI (Audit Logs, Time Off, Team Hub) to real (persisted) data state. A user action in `Profile.tsx` should immediately show up in `AuditLog.tsx`.
