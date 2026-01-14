# Mock Data Strategy - Zirtually

Zirtually uses a centralized mock data strategy to ensure consistency across the application, facilitate testing, and enable rapid prototyping without a backend.

## Location

All mock data and constants are located in `c:\Users\P\Documents\Antigravity\Zirtually\Zirtually-1\constants.ts`.

## Core Principles

1.  **Centralization**: All mock objects and configurations are stored in `constants.ts`. Avoid defining large data arrays within component files.
2.  **Type Safety**: Every mock object must adhere to the TypeScript interfaces defined in `types.ts`.
3.  **Industry Consistency**: Terminology and features should adapt based on the selected `Industry`. Use the `INDUSTRY_CONFIGS` record for industry-specific settings.
4.  **Relationships**: Maintain logical connections between mock entities (e.g., `memberId` in `MOCK_TEAM_SKILLS` should correspond to an ID in `MOCK_USERS`).

## Data Entities

### 1. Industry Configurations (`INDUSTRY_CONFIGS`)

Defines the visual identity (colors, icons) and terminology for each industry (e.g., healthcare, technology, retail).

### 2. User Data (`MOCK_USERS`)

Contains user profiles including roles (`ADMIN`, `MANAGER`, `STAFF`), departments, and basic contact info.

### 3. Skills & Competencies

- `MOCK_SKILLS`: Definitions of available skills, their categories, and criticality levels.
- `MOCK_TEAM_SKILLS`: Detailed proficiency mappings for team members, including verification status and last assessment dates.

### 4. Lifecycle Modules

- `MOCK_ONBOARDING_TASKS`: Tasks for new hires.
- `MOCK_TRAINING`: Mandatory and optional training modules.
- `MOCK_REVIEWS`: Performance review records and statuses.
- `MOCK_JOURNEY_MILESTONES`: Historical events for the "My Journey" view.

### 5. Benefits & Wellness

- `MOCK_BENEFITS`: Available health and retirement plans.
- `MOCK_WELLNESS_RESOURCES`: Mental and physical health support links.

## Extending Mock Data

When adding new features:

1.  Define the necessary interfaces in `types.ts`.
2.  Create the initial mock data in `constants.ts`.
3.  If the data changes during a session (e.g., user updates profile), use React state or custom hooks (like `useAuth`) to manage the local copy of the data.

## Persistent State

For certain data (like `MOCK_USERS` or `notifiedItems`), we use `localStorage` to persist changes across page reloads during development. This mimics basic backend persistence.
