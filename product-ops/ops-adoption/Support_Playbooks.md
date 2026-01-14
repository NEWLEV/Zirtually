# Support Model & Playbooks

## 1. Support Tiers & Escalation

structure for handling user inquiries and platform issues.

### Tier 1: Help Desk / Frontline

- **Scope:** Login issues, basic "how-to" questions, browser compatibility.
- **Goal:** Resolve 70% of inbound volume.
- **Escalation Trigger:** Unable to resolve within 15 mins or requires admin permissions.

### Tier 2: Product Operations / Platform Admins

- **Scope:** Configuration changes, data discrepancies, complex workflow debugging, role adjustments.
- **Goal:** Resolve 25% of volume.
- **Escalation Trigger:** Confirmed bug, outage, or security incident.

### Tier 3: Engineering / Cloud Ops

- **Scope:** Code defects, infrastructure failures, performance tuning.
- **Goal:** <5% of volume (Defect remediation).

## 2. Service Level Agreements (SLAs)

| Priority | Definition | Response Time (biz hrs) | Resolution Goal |
| men | --- | --- | --- |
| **P1 - Critical** | System down, data loss, large group blocked. | 30 mins | 4 hours |
| **P2 - High** | Major feature broken, workaround difficult. | 2 hours | 1 business day |
| **P3 - Normal** | Minor bug, single user affected, workaround exists. | 8 hours | 3 business days |
| **P4 - Low** | Cosmetic, typo, feature request. | 24 hours | Best effort / Roadmap |

## 3. Ticket Taxonomy

Standard categories for tagging tickets to improve reporting and root cause analysis.

- **Category:** Access, Defect, Feature Request, How-to, Data Issue
- **Sub-Category:**
  - _Access:_ SSO, MFA, Permissions, Invite
  - _Defect:_ UI Glitch, 500 Error, Timeout, Calculation Error
  - _Feature:_ New Field, Report Request, Integration Request

## 4. Knowledge Base (KB) Strategy

- **Self-Service First:** "How-to" tickets must be answered with a KB link. If one doesn't exist, it is created immediately (KCS methodology).
- **Maintenance:** Top 10 accessed articles reviewed monthly for accuracy.
- **Gap Analysis:** Monthly review of search queries returning 0 results.

## 5. Incident Remediation Playbook (P1/P2)

1.  **Acknowledge:** Change ticket status, notify stakeholders via status page/#ops-channel.
2.  **Triage:** Replicate issue, check logs, determine scope (Tier 2).
3.  **Escalate:** Page Tier 3 if code fix/restart required.
4.  **Communicate:** Hourly updates to stakeholders until resolution.
5.  **Post-Mortem:** Root cause analysis (RCA) document required within 48 hours.
