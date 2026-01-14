# Test Strategy - Zirtually

## 1. Overview

This document outlines the testing strategy for the Zirtually platform. The goal is to ensure high quality, reliability, and regression-free releases through a balanced testing pyramid.

## 2. Testing Levels (The Pyramid)

### 2.1 Unit Testing

- **Scope**: Individual functions, hooks, and isolated UI components.
- **Tools**: Vitest, React Testing Library.
- **Goal**: Verify logic correctness and component rendering in isolation.
- **Coverage Target**: 80% Statement coverage for utility functions and complex logic.
- **Convention**: `*.test.tsx` alongside the component/file.

### 2.2 Integration Testing

- **Scope**: Interaction between parent/child components, context providers, and mock API data flows.
- **Tools**: Vitest, React Testing Library.
- **Goal**: Ensure data passes correctly through props and context, and state updates trigger expected re-renders.
- **Convention**: Can be within `*.test.tsx` or `*.integration.test.tsx` if complex.

### 2.3 End-to-End (E2E) Testing

- **Scope**: Critical user journeys from the perspective of a real user running in a browser.
- **Tools**: Cypress.
- **Goal**: Verify the system works as a whole, including navigation, data persistence (mocked or real), and critical workflows.
- **Key Journeys**: Login, Profile Management, Goal Creation, Performance Review Submission.
- **Convention**: `cypress/e2e/*.cy.ts`.

## 3. Tooling & Configuration

- **Test Runner**: Vitest (fast, compatible with Vite).
- **Environment**: Jsdom for unit/integration; Chrome/Electron for Cypress.
- **Linting**: ESLint with React and Prettier plugins.
- **CI Pipeline**: Tests must run on every Pull Request.

## 4. Test Data Strategy

- **Unit/Integration**: Use mock objects and factories. Avoid hard dependencies on external services.
- **E2E**: Use reliable mock data (intercept network requests) to ensure determenistic tests, but strictly type-check mocks against API contracts.

## 5. Responsibilities

- **Developers**: Write unit tests for all new code. Update existing tests if functionality changes.
- **QA / Test Architect**: Maintain the E2E suite, review test coverage, and own the release gates.
