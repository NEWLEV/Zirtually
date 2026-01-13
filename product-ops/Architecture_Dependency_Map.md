# Architecture Dependency Map

**Date:** 2026-01-13
**Status:** Post-Refactor (Initial Decoupling)

## 1. Structural Overview
The application has transitioned from a flat "Component -> Mock" structure to a layered "Component -> Service -> Data" architecture.

### 1.1 Layer Hierarchy
| Layer | Description | Key Artifacts |
|-------|-------------|---------------|
| **Presentation** | UI components that render data and handle user input. | `Goals.tsx`, `PerformanceReviews.tsx` |
| **Logic (Hooks/Context)** | Manages stateful logic and coordinates multiple services. | `AuthContext.tsx`, `useAuth.ts` |
| **Service (Abstraction)** | Single source of truth for data operations. Async-first. | `userService.ts`, `goalService.ts`, `reviewService.ts` |
| **Data (Persistence)** | Where data actually lives (Mocked for now). | `constants.ts`, `localStorage` |

---

## 2. Dependency Graph

```mermaid
graph TD
    subgraph UI_Layer [Presentation]
        App[App.tsx]
        G_View[Goals.tsx]
        R_View[PerformanceReviews.tsx]
        Login[Login.tsx]
    end

    subgraph Logic_Layer [Context & Hooks]
        AuthC[AuthContext.tsx]
        NovaC[NovaContext.tsx]
    end

    subgraph Service_Layer [Business Logic / BFF]
        UserS[userService.ts]
        GoalS[goalService.ts]
        ReviewS[reviewService.ts]
    end

    subgraph Data_Layer [Persistence]
        Constants[constants.ts (Mock)]
        Store[(Browser LocalStorage)]
    end

    %% Wiring
    App --> AuthC
    Login --> AuthC
    G_View --> GoalS
    R_View --> ReviewS
    
    AuthC --> UserS
    
    UserS --> Constants
    UserS --> Store
    
    GoalS --> Constants
    GoalS --> Store
    
    ReviewS --> Constants
    ReviewS --> Store
```

---

## 3. Brittleness Scorecard (Updates)

| Risk Item | Prev Status | Current Status | Improvement |
|-----------|-------------|----------------|-------------|
| **Tight Coupling to Mocks** | **High** | **Low** | Components no longer import `MOCK_GOALS` or `MOCK_REVIEWS`. |
| **State Volatility** | **Critical** | **Medium** | Most refactored modules now persist to `localStorage` via services. |
| **Async Readiness** | **None** | **High** | All services are `async` and mimic network latency. UI supports `isLoading`. |

---

## 4. Next Integration Targets
1.  **AI Clinical Scribe**: Move logic to a service to handle API key management and PII scrubbing patterns.
2.  **Learning & Training**: Transition `Learning.tsx` to use a `LearningService`.
3.  **Analytics**: Centralize metric calculation in an `AnalyticsService` to prepare for backend aggregation.
