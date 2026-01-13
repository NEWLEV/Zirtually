# Content & Communications Pack

## 1. In-App Guidance Strategy (Nova)

**Persona**: "Nova" is helpful, proactive, but unobtrusive.  
**Tone**: Professional, encouraging, concise. avoiding jargon.

### Proposed Nova Tips (JSON Structure Draft)

#### Context: Dashboard (First Login)
> "Welcome to Zirtually! 👋 I'm Nova. I can help you navigate your new workspace. Check out 'My Journey' to see your onboarding progress."
*   **Trigger**: First login, `user.isNewHire === true`.
*   **Action**: "Go to My Journey"

#### Context: Goals Page (Idle for 10s)
> "Setting clear goals is key to growth. Try using the S.M.A.R.T. framework: Specific, Measurable, Achievable, Relevant, Time-bound."
*   **Trigger**: Time on page > 10s.

#### Context: Profile (Missing Skills)
> "Your skills profile looks a bit empty. Adding skills helps managers match you with the right opportunities!"
*   **Trigger**: `user.skills.length === 0`.
*   **Action**: "Add a Skill"

---

## 2. Help Center / FAQs Draft

### General
*   **Q: How do I change my assigned industry/workspace?**
    *   A: You can switch workspaces from the login screen or via the Settings menu if you have multi-tenant access.
*   **Q: Who can see my profile information?**
    *   A: Your basic info (Name, Role) is visible in the Directory. You can control privacy settings for contact info in the **Settings > Privacy** tab.

### Performance & Growth
*   **Q: How often are performance reviews?**
    *   A: Zirtually supports quarterly and annual cycles. Check the 'Reviews' tab for your specific schedule.
*   **Q: How do I verify a credential?**
    *   A: When adding a credential, you can provide a verification URL. Your manager or admin can then mark it as 'Verified'.

---

## 3. Communication & Training Outline

### A. Launch Comms (Email / Slack)

**Subject**: Welcome to Zirtually – Your New Employee Experience Platform 🚀

**Body**:
Hi Team,

We are excited to introduce **Zirtually**, our new all-in-one platform for your work life, growth, and team connection.

**What can you do in Zirtually?**
*   **Track your Journey**: Clear onboarding and growth paths.
*   **Manage Goals**: Set and track your quarterly objectives.
*   **Connect**: Find teammates in the Directory and Org Chart.
*   **Wellness**: Access resources to keep you at your best.

**Next Steps**:
1.  Log in at [Link]
2.  Complete your Profile (Add a photo!)
3.  Say "Hi" to Nova, your AI assistant.

Best,
The People Team

### B. Training Outline (30-Minute Webinar)

1.  **Introduction (5 min)**
    *   Why Zirtually? (Employee-centric design).
    *   Navigation Overview.
2.  **Demo: The Basics (10 min)**
    *   Profile Setup.
    *   Navigating the Sidebar.
    *   Using the Command Palette (`Cmd+K`).
3.  **Demo: Growth & Performance (10 min)**
    *   Adding Skills.
    *   Viewing Goals.
4.  **Q&A (5 min)**
