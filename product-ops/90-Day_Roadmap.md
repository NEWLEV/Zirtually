# 90-Day Strategic Roadmap

**Last Updated:** 2026-01-13
**Horizon:** Q1 - Q2 2026

## Month 1: The Secure Foundation (Hardening)
*Objective: Transition from a prototype to a secure, decoupled application.*

### Week 1-2: Security & Cleanup (PII Eradication)
- [ ] **B-015**: Sanitize all realistic PII from `constants.ts`.
- [ ] **B-016**: Pin all `package.json` dependencies to fixed versions.
- [ ] **Auth PoC**: Integrate Auth0/Supabase for a "Real" login experience (B-001).

### Week 3-4: The Service Layer (Decoupling)
- [ ] Complete `GoalService`, `ReviewService`, and `DocumentService` abstractions.
- [ ] Switch UI components to call Services exclusively.
- [ ] Implement global error handling for Service failures.

## Month 2: Persistence & Scale (The Backend)
*Objective: Enable multi-user persistence and real-world data management.*

### Week 5-6: Database & API Development
- [ ] Deploy Node.js/BFF (Backend for Frontend).
- [ ] Provision PostgreSQL database.
- [ ] Migrate `constants.ts` data to SQL seed scripts.

### Week 7-8: Feature Wiring
- [ ] Connect `GoalService` to real DB endpoints.
- [ ] Connect `ReviewService` to real DB endpoints.
- [ ] **B-009**: Connect Audit Logging to a persistent DB table.

## Month 3: Premium Tier & Polish (Enterprise Ready)
*Objective: High-end UX and compliance features for enterprise rollout.*

### Week 9-10: Advanced Product Features
- [ ] **B-005**: High-fidelity Profile Picker Redesign.
- [ ] **B-006**: Context-aware Onboarding Assistant (Nova) hardening.
- [ ] **B-008**: Bulk CSV Data Import/Export for HR.

### Week 11-12: Compliance & Launch Prep
- [ ] **Lighthouse ADA Audit**: Reach 100% score on Dashboard/Profile.
- [ ] **Security Hardening**: Implement CSP/HSTS headers (B-017).
- [ ] **Final QA**: Full regression pass of 90-day features.

---

## Success Metrics (End of 90 Days)
1. **0** High-Severity security vulnerabilities.
2. **100%** Data persistence (No data lost on page refresh).
3. **< 2s** Initial dashboard load time.
4. **90+** Lighthouse Accessibility score across all pages.
