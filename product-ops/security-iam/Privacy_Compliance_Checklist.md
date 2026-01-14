# Privacy Compliance Checklist

**Date:** 2026-01-13
**Frameworks:** GDPR, CCPA, SOC2 (Scope: HR Data)

## 1. Data Inventory & Minimization

| Data Category          | Fields Collected                | Purpose        | Minimization Status                                                                                            |
| ---------------------- | ------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------- |
| **Identity**           | Name, Email, Phone, Avatar      | Identification | ⚠️ **Action**: Verify if phone number is necessary for all users.                                              |
| **Employment**         | Title, Dept, Start Date, Salary | HR Operations  | ✅ Strictly necessary for HR platform.                                                                         |
| **Health (Sensitive)** | Sick Days, Wellness Usage       | Benefits       | ⚠️ **Critical**: Ensure Wellness resource usage is ANONYMIZED. Managers should not see "Mental Health" clicks. |
| **Performance**        | Reviews, Ratings, Feedback      | Assessment     | ✅ Standard business purpose.                                                                                  |
| **System**             | IP Address, Login Times         | Security Audit | ⚠️ Retention policy needed (e.g., 90 days).                                                                    |

## 2. Retention Policies

- [ ] **Employment Data**: Retain for duration of employment + 7 years (Legal requirement).
- [ ] **Audit Logs**: Retain for 1 year (Security requirement).
- [ ] **Chat/Messages**: Retain for 90 days (Operational).
- [ ] **Deleted Users**: Soft-delete immediately; Hard-delete after 30 days (Grace period).

## 3. Data Subject Rights (DSAR)

_Capabilities the system must support:_

- [ ] **Right to Access (Export)**:
  - _Current_: "Export CSV" button exists on some pages but needs to be comprehensive.
  - _Requirement_: A "Download My Data" button in Settings that zips all user JSON data.
- [ ] **Right to be Forgotten (Deletion)**:
  - _Requirement_: Admin function to anonymize a user record (e.g., replace name with "Deleted User", clear email).
- [ ] **Right to Rectification**:
  - _Current_: Users can edit detailed profile?
  - _Requirement_: Ensure users can edit their own personal details (Address, Emergency Contact).

## 4. Third-Party Vendor Processing

| Vendor           | Data Shared                            | Compliance Check                                                                                                           |
| ---------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Google GenAI** | Prompts (Likely Employee Data context) | ⚠️ **Risk**: Ensure no PII is sent in prompts unless covered by BAA/Enterprise agreement. Turn off model training options. |
| **Vite/Hosting** | Static Assets                          | ✅ Low risk.                                                                                                               |

## 5. Privacy by Design Features

- [ ] **Consent Banners**: Not needed for internal HR tool usually, but "Cookie" banner if Analytics are used.
- [ ] **Access Logs**: Restrict access to `AuditLog` (Done).
- [ ] **Encryption**:
  - _In Transit_: HTTPS (TLS 1.2+).
  - _At Rest_: DB Encryption (Future requirement).

---

## Action Items

1.  **Sanatize GenAI Prompts**: Review `./services/ai.ts` or similar to ensure we aren't sending full employee records to the LLM indiscriminately.
2.  **Mock Data Cleanup**: Remove realistic data to avoid confusion in demos.
