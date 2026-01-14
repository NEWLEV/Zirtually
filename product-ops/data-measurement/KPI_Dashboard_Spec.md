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
    - _Value:_ Integer.
    - _Trend:_ Percentage change (+/-).
    - _Context:_ "vs last month".
2.  **Turnover Rate**
    - _Value:_ Percentage.
    - _Trend:_ Color-coded reverse (Up = Red, Down = Green).
    - _Context:_ "Annualized".
3.  **New Hires**
    - _Value:_ Integer.
    - _Trend:_ Change.
4.  **Open Positions**
    - _Value:_ Integer.
    - _Action:_ Clicking leads to Recruiting module.

### Section 2: Trends & Breakdowns (Deep Dive)

**Visual:** 2x2 Grid of Charts.

1.  **Headcount Growth (Line/Area Chart)**
    - _X-Axis:_ Month (Last 12 months).
    - _Y-Axis:_ Employee Count.
    - _Goal:_ Show stability or growth curve.
2.  **Turnover Breakdown (Stacked Bar)**
    - _X-Axis:_ Month.
    - _Y-Axis:_ Termination Count.
    - _Series:_ Voluntary vs. Involuntary.
    - _Goal:_ Identify if people are quitting or being fired.
3.  **Department Distribution (Donut/Bar)**
    - _Dimension:_ Department Name (Eng, Sales, etc.).
    - _Metric:_ Headcount %.
    - _Goal:_ Show organizational balance.
4.  **Diversity / Demographics (Bar - Future)**
    - _Dimension:_ Gender / Location.
    - _Metric:_ % breakdown.

### Section 3: AI Insights (The "So What?")

**Visual:** List of cards with icons (Warning, Success, Info).
**Functionality:** Generative text based on data anomalies.

- _Example:_ "Engineering turnover is 15% above the company average."
- _Example:_ "Sales headcount grew by 10% this quarter, matching target."

## Data Requirements

- **Backend:** `GET /api/analytics/summary?range=month`
- **Refresh Rate:** Real-time or Daily Cache.
- **Permissions:** Restricted to Admin/HR roles.

## Future Enhancements

- Drill-down by clicking on chart bars (e.g., click "Engineering" to see Eng-only stats).
- Export to PDF/CSV.
- Industry benchmarking (Mock data > Real integration).
