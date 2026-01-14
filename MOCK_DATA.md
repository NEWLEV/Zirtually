# Mock Data Documentation

## Overview

This application currently uses mock (simulated) data for all features. This allows for development, testing, and demonstration without requiring a backend API or database.

## Important Limitations

⚠️ **Data is not persistent** - Changes made in the application (except for some localStorage items) will be reset when the page refreshes.

⚠️ **No real API integration** - All data is hardcoded in `constants.ts`.

⚠️ **Limited scalability** - The mock data approach increases bundle size and is not suitable for production.

## Mock Data Location

All mock data is defined in: [`constants.ts`](file:///c:/Users/P/Documents/Antigravity/Zirtually/Zirtually-1/constants.ts)

## What Uses Mock Data

### Users & Authentication

- **MOCK_USERS** - 3 test users (Admin, Manager, Staff)
- Login is simulated - any user can be selected
- User profiles and permissions

### Employee Lifecycle

- **MOCK_ONBOARDING_TASKS** - Onboarding checklists
- **MOCK_OFFBOARDING_PROCESSES** - Employee exit workflows
- **MOCK_JOURNEY_MILESTONES** - Career milestones

### Performance & Goals

- **MOCK_GOALS** - Individual and team goals
- **MOCK_PERFORMANCE_REVIEWS** - (if exists) Review cycles
- **MANAGER_NUDGES** - AI-powered manager suggestions

### Learning & Development

- **MOCK_TRAINING** - Training modules and courses
- **MOCK_CERTIFICATIONS** - Professional certifications

### Time & Benefits

- **MOCK_TIME_OFF_REQUESTS** - PTO/sick leave requests
- **MOCK_HOLIDAYS** - Company holidays
- **MOCK_BENEFITS** - Benefits packages

### Team & Communication

- **MOCK_ANNOUNCEMENTS** - Company announcements
- **MOCK_RECOGNITIONS** - Employee recognition
- **MOCK_SURVEYS** - Employee surveys

### Analytics & Reporting

- **MOCK_ANALYTICS** - HR metrics and KPIs
- **MOCK_AUDIT_LOGS** - System activity logs

### Documents & Policies

- **MOCK_DOCUMENTS** - Company policies and handbooks
- **MOCK_POLICIES** - HR policies

## LocalStorage Items

Some data is persisted in browser localStorage:

- `zirtually_users` - User modifications
- `zirtually_theme` - Light/dark mode preference
- `zirtually_industry` - Selected industry
- `notificationSettings` - Notification preferences
- `notifiedItems` - Notification history

## Migration Strategy

### Phase 1: API Design (Recommended Next Steps)

1. Define API endpoints for each data type
2. Create API service layer (`/services/api.ts`)
3. Define TypeScript interfaces for API responses

### Phase 2: Backend Integration

1. Replace mock data imports with API calls
2. Add loading states and error handling
3. Implement data caching strategy
4. Add optimistic UI updates

### Phase 3: State Management

1. Consider adding Redux/Zustand for complex state
2. Implement data synchronization
3. Add offline support if needed

## Example API Migration

**Before (Mock Data):**

```typescript
import { MOCK_GOALS } from '../constants';
const goals = MOCK_GOALS.filter(g => g.owner === user.id);
```

**After (API Integration):**

```typescript
import { fetchUserGoals } from '../services/api';
const [goals, setGoals] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchUserGoals(user.id)
    .then(setGoals)
    .catch(handleError)
    .finally(() => setLoading(false));
}, [user.id]);
```

## Testing Recommendations

1. **Unit Tests** - Mock API responses for component testing
2. **Integration Tests** - Test with real API in staging
3. **E2E Tests** - Use mock data for consistent test scenarios

## Notes for Developers

- Mock data structure matches expected API response formats
- All mock IDs are strings (e.g., `'u0'`, `'g1'`)
- Date strings use ISO 8601 format
- Keep mock data realistic but minimal

## Production Readiness Checklist

- [ ] Design and implement backend API
- [ ] Create API service layer
- [ ] Add authentication/authorization
- [ ] Implement data validation
- [ ] Add error handling and retry logic
- [ ] Set up loading states
- [ ] Configure CORS and API keys
- [ ] Add rate limiting
- [ ] Implement data caching
- [ ] Set up monitoring and logging
