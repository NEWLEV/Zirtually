# Strategic Roadmap: Path to Adaptive (Level 5)

Based on the documentation and maturity assessment (Level 3), this roadmap outlines the strategy to evolve Zirtually into a Level 5 (Adaptive) platform.

This strategy bridges the gap between the current **Intelligent (Level 3)** state—characterized by static AI features and partial integrations—and the **Adaptive (Level 5)** state, where the system self-optimizes and intervenes autonomously.

## Phase 1: Foundation & Unification (Months 1–3)

*Goal: Move from "Partially Implemented" to "Fully Connected." Achieve Level 4 prerequisites by establishing a unified data layer and workflow engine.*

### 1. Establish the "System Nervous System" (Event-Driven Architecture)
Current integration is point-to-point or non-existent. Level 5 requires an event bus to trigger autonomous actions.

* **Action:** Implement an Event Bus (e.g., via Supabase Realtime or Node.js backend) to broadcast events like `user.promoted`, `survey.low_score`, or `project.burnout_risk`.
* **Value:** Enables "Closed-Loop Systems" (Domain 3). For example, a low survey score immediately triggers a manager notification.

### 2. Consolidate & Persist Core Data
Autonomous agents cannot function on mock data or local storage.

* **Action:** Execute the "Persistence & Scale" phase of the 90-Day Roadmap, moving all `constants.ts` data to PostgreSQL.
* **Action:** Unify `User`, `Goal`, and `Performance` datasets to allow cross-domain analytics (e.g., correlating *Wellness* data with *Performance* output).

### 3. Omnichannel Access (Mobile/PWA)
"Platform Agnostic Access" is currently marked as "Needed."

* **Action:** Deploy a Progressive Web App (PWA) wrapper for mobile access.
* **Value:** Enables real-time notifications and "in-the-flow" communication for frontline employees.

---

## Phase 2: Predictive Intelligence (Months 4–9)

*Goal: Transform "Hindsight" analytics into "Foresight" capabilities. Shift from reporting metrics to predicting outcomes.*

### 1. Predictive Workforce Planning (Domain 10)
Current analytics are historical (Headcount, Turnover).

* **Action:** Train ML models on the newly persisted historical data to forecast:
    * **Attrition Risk:** "Employee X shows a 65% risk of leaving based on recent time-off patterns and survey sentiment."
    * **Succession Gaps:** "Role Y will be vacant in 3 months; no internal candidates are ready."
* **Integration:** Surface these insights directly in the `Analytics.tsx` "AI Insights" section.

### 2. Intelligent Career Architecture (Domain 5)
Move `SkillMatrix.tsx` from a static view to a dynamic growth engine.

* **Action:** Implement AI-driven skills gap analysis that automatically maps an employee's current skills against their aspirational role.
* **Action:** Auto-generate "Personalized Development" learning paths in `Learning.tsx` based on performance review gaps.

### 3. Sentiment & Culture Heatmaps (Domain 2)
* **Action:** Implement NLP analysis on public channels (Communities) and open-text survey responses to generate real-time "Cultural Health" scores, replacing static engagement metrics.

---

## Phase 3: Autonomous Intervention (Months 10–18)

*Goal: Achieve Level 5. The platform detects issues and acts on them without human initiation.*

### 1. Autonomous Agents (Nova 2.0)
Upgrade `NovaAssistant.tsx` from a reactive helper to a proactive agent.

* **Scenario (Burnout Prevention):** If `TimeOff.tsx` shows no vacation for 6 months and `Wellness.tsx` participation is low, Nova automatically:
    * Pings the employee: *"You haven't taken a break lately. Shall I draft a PTO request for next Friday?"*
    * Nudges the manager: *"User X is at high risk of burnout. Recommend a check-in."*

### 2. Automated Workflow Orchestration (Domain 4)
Address the "Needed" Workflow Orchestration gap.

* **Action:** Build "Self-Healing" workflows.
* *Example:* When an employee is promoted, the system automatically:
    * Updates the Org Chart.
    * Provisions new software licenses.
    * Enrolls them in "New Manager Training."
    * Schedules a transition meeting with the old manager.

### 3. Adaptive Learning & Performance
* **Action:** Create a "Dynamic Performance" loop. If an employee fails a specific task or misses a goal, the system automatically assigns a micro-learning module from the `Learning.tsx` ecosystem to address that specific deficiency, closing the loop between *Performance* and *Development*.

---

## Summary of Key Enablers

| Capability | Current State (Level 3) | Target State (Level 5) | Required Tech Lift |
| --- | --- | --- | --- |
| **Data** | Mock / LocalStorage | Unified Graph DB | High (Backend Migration) |
| **Logic** | Hardcoded Rules | Predictive ML Models | High (Data Science) |
| **Action** | User-Initiated | System-Initiated | Medium (Event Bus) |
| **Nova** | Q&A Bot | Autonomous Agent | High (Agentic AI) |

This strategy prioritizes the "Missing" foundational elements (DB, Workflows) first, ensuring that the advanced AI features of Level 5 have a stable, data-rich environment to operate within.
