# Metrics Dictionary

This document defines the core business metrics for `Zirtually`.

## 1. HR / Business Metrics (Customer Facing)
These are metrics displayed *to* the user (the HR Admin) within the application's dashboard.

| Metric Name | Definition | Calculation | Source |
| :--- | :--- | :--- | :--- |
| **Total Headcount** | Total number of active employee records. | Count(`Employee` where `status` = 'Active') | Database |
| **Turnover Rate** | Percentage of employees who left in a given period. | (`Terminations` / `Avg Headcount`) * 100 | Database |
| **Voluntary Turnover** | Resignations / retirements. | Count(`Terminations` where `type` = 'Voluntary') | Database |
| **Involuntary Turnover** | Terminations / layoffs. | Count(`Terminations` where `type` = 'Involuntary') | Database |
| **Retention Rate** | One minus turnover rate. | 1 - `Turnover Rate` | Calculated |
| **Time to Example** | Not defined yet. | N/A | N/A |

## 2. Product Usage Metrics (Internal)
These are metrics Zirtually tracks to measure product success.

| Metric Name | Definition | Why it matters | Event Needed |
| :--- | :--- | :--- | :--- |
| **DAU (Daily Active Users)** | Unique users triggered `Pageview` in 24h. | Core engagement. | `Page View` |
| **Onboarding Completion Rate** | % of sign-ups that complete the setup wizard. | First value delivery. | `Onboarding Complete` / `Sign Up` |
| **Feature Usage: Analytics** | % of sessions viewing the Analytics page. | Value of this specific feature. | `Page View` (url=/analytics) |
| **Search Utilization** | % of sessions performing a search. | Navigation efficiency. | `Search Performed` |
| **Profile Edit Rate** | % of users updating profile per month. | Data freshness. | `Profile Updated` |

## 3. System Health Metrics
| Metric Name | Definition | Threshold |
| :--- | :--- | :--- |
| **Error Rate** | 5xx responses / Total requests. | < 1% |
| **P95 Latency** | 95th percentile request duration. | < 500ms |
| **Uptime** | Availability of service. | > 99.9% |
