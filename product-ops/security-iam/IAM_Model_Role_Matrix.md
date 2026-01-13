# IAM Model & Role Matrix

**Date:** 2026-01-13
**Status:** DRAFT

## RBAC Definitions

### Roles
1.  **Admin** (`UserRole.ADMIN`)
    -   Full system access.
    -   Can manage users, settings, integrations, and view audit logs.
    -   Cannot view private messages (Privacy barrier).
2.  **Manager** (`UserRole.MANAGER`)
    -   Access to own data + data of direct reports (Downstream scope).
    -   Can approve Time Off, conduct Performance Reviews.
    -   Cannot see system-wide settings or other teams' data.
3.  **Staff** (`UserRole.STAFF`)
    -   Access `read/write` to own data (Profile, Goals, Learning).
    -   Access `read` to public specific data (Org Chart, Directory).

### Attributes (ABAC Potential)
-   `Department`: Limits scope for Managers (e.g., 'Engineering' Manager seeing 'Engineering' data).
-   `Location`: Could be used for compliance filtering (GDPR vs CCPA).

---

## Permission Matrix

| Feature / Resource | Action | Admin | Manager | Staff |
|--------------------|--------|-------|---------|-------|
| **Dashboard** | View | ✅ (Org View) | ✅ (Team View) | ✅ (Personal View) |
| **My Journey** | View/Edit | ✅ | ✅ | ✅ (Own Only) |
| **Onboarding** | Assign | ✅ | ✅ | ❌ |
| **Onboarding** | Complete | ✅ | ✅ | ✅ |
| **Goals** | Create Org Goal | ✅ | ❌ | ❌ |
| **Goals** | Create Team Goal | ✅ | ✅ | ❌ |
| **Goals** | Update Own Goal | ✅ | ✅ | ✅ |
| **Performance** | Initiate Review | ✅ | ✅ | ❌ |
| **Performance** | Submit Assessment| ✅ | ✅ | ✅ |
| **Team Directory** | View | ✅ | ✅ | ✅ |
| **Org Chart** | View | ✅ | ✅ | ✅ |
| **Documents** | Upload Policy | ✅ | ❌ | ❌ |
| **Documents** | View Policy | ✅ | ✅ | ✅ |
| **System Settings**| Edit | ✅ | ❌ | ❌ |
| **Audit Logs** | View | ✅ | ❌ | ❌ |
| **Integrations** | Configure | ✅ | ❌ | ❌ |
| **Billing** | Manage | ✅ | ❌ | ❌ |

---

## Implementation Plan (TS Interfaces)

```typescript
// Proposed structure for centralizing permissions

type Permission = 
  | 'view_audit_logs'
  | 'manage_users'
  | 'manage_integrations'
  | 'approve_time_off'
  | 'view_team_goals';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: ['view_audit_logs', 'manage_users', 'manage_integrations', 'approve_time_off', 'view_team_goals'],
  [UserRole.MANAGER]: ['approve_time_off', 'view_team_goals'],
  [UserRole.STAFF]: []
};

// Hook usage
const { can } = usePermission();
if (can('view_audit_logs')) { ... }
```
