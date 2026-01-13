# KPI Dashboard Spec

**Target Audience:** HR Managers / Executives (User)
**Component:** `Analytics.tsx`

## Design Goals
1.  **At-a-glance Health:** Users should know "Is everything okay?" within 5 seconds.
2.  **Actionable:** Every red indicator should lead to a drill-down or recommended action.
3.  **Comparative:** Metrics need context (MoM, YoY, vs Industry Benchmark).

## Layout Specification

### Section 1: Hero Metrics (The "Pulse")
**Visual:** 4 Cards across top.
**Data Timeframe:** Current Month (vs Previous Month).

1.  **Total Headcount**
    *   *Value:* Integer.
    *   *Trend:* Percentage change (+/-).
    *   *Context:* "vs last month".
2.  **Turnover Rate**
    *   *Value:* Percentage.
    *   *Trend:* Color-coded reverse (Up = Red, Down = Green).
    *   *Context:* "Annualized".
3.  **New Hires**
    *   *Value:* Integer.
    *   *Trend:* Change.
4.  **Open Positions**
    *   *Value:* Integer.
    *   *Action:* Clicking leads to Recruiting module.

### Section 2: Trends & Breakdowns (Deep Dive)
**Visual:** 2x2 Grid of Charts.

1.  **Headcount Growth (Line/Area Chart)**
    *   *X-Axis:* Month (Last 12 months).
    *   *Y-Axis:* Employee Count.
    *   *Goal:* Show stability or growth curve.
2.  **Turnover Breakdown (Stacked Bar)**
    *   *X-Axis:* Month.
    *   *Y-Axis:* Termination Count.
    *   *Series:* Voluntary vs. Involuntary.
    *   *Goal:* Identify if people are quitting or being fired.
3.  **Department Distribution (Donut/Bar)**
    *   *Dimension:* Department Name (Eng, Sales, etc.).
    *   *Metric:* Headcount %.
    *   *Goal:* Show organizational balance.
4.  **Diversity / Demographics (Bar - Future)**
    *   *Dimension:* Gender / Location.
    *   *Metric:* % breakdown.

### Section 3: AI Insights (The "So What?")
**Visual:** List of cards with icons (Warning, Success, Info).
**Functionality:** Generative text based on data anomalies.

*   *Example:* "Engineering turnover is 15% above the company average."
*   *Example:* "Sales headcount grew by 10% this quarter, matching target."

## Data Requirements
-   **Backend:** `GET /api/analytics/summary?range=month`
-   **Refresh Rate:** Real-time or Daily Cache.
-   **Permissions:** Restricted to Admin/HR roles.

## Future Enhancements
-   Drill-down by clicking on chart bars (e.g., click "Engineering" to see Eng-only stats).
-   Export to PDF/CSV.
-   Industry benchmarking (Mock data > Real integration).
