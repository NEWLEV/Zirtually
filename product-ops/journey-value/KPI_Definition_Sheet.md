# KPI Definition Sheet

## Objective: Define success metrics to validate that Zirtually is solving core HR and Management pain points.

## 1. Compliance & Security Oversight

- **Audit Trail Latency**: Time from user action to event appearing in the Audit Log.
  - _Target_: < 1 second (Real-time).
  - _Value_: High trust for IT/Security stakeholders.
- **Credential Expiry Visibility**: % of upcoming license/credential expiries flagged > 30 days in advance.
  - _Target_: 100%.
  - _Value_: Critical for healthcare/finance verticals.

## 2. Manager Effectiveness

- **Team Balance Accuracy**: Real-time correlation between manager's `TimeOff` approvals and org-wide availability calendar.
  - _Target_: Zero scheduling conflicts.
  - _Value_: Reduces administrative overhead for managers.
- **Feedback Richness**: Average word count of performance reviews (before vs. after AI Magic Draft integration).
  - _Target_: > 200 words per major assessment section.
  - _Value_: Higher quality feedback leads to better retention.

## 3. Employee Self-Service (Adoption)

- **Profile Freshness**: Average days since last profile update (Skills, Certs, Bio).
  - _Target_: < 90 days.
  - _Value_: Ensures the "Skills Cloud" data is useful for project matching.
- **Policy Acknowledgment TTO**: Time-to-Acknowledge for new mandatory policies.
  - _Target_: < 24 hours.
  - _Value_: Risk mitigation for HR.

## 4. Platform Health

- **Data Persistence Success Rate**: % of draft sessions resumed without data loss.
  - _Target_: 100%.
  - _Value_: Core UX health metric (Validation for B-011).
- **Search Discovery Rate**: % of users who find their desired page/document via `CommandPalette` on the 1st attempt.
  - _Target_: > 85%.

## Measurement strategy

1.  **Phase 1 (MVP)**: Log events to `localStorage` and display on the `Analytics.tsx` tab to demonstrate tracking capabilities.
2.  **Phase 2**: Integrate with a real-time event stream (e.g., PostHog or Segment) for production-grade insights.
