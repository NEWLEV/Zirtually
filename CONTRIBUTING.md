# Development Guidelines

## Code Quality Standards

### TypeScript

- **Strict Mode Enabled** - All strict type checking flags are active
- Use explicit types for function parameters and return values
- Avoid `any` type - use `unknown` if type is truly unknown
- Enable all recommended compiler checks

### Linting (ESLint)

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

**Rules**:

- React 18+ rules (no React imports needed)
- TypeScript recommended rules
- React Hooks rules
- Prettier integration

### Formatting (Prettier)

```bash
npm run format       # Format all files
npm run format:check # Check formatting
```

**Configuration**:

- 2 space indentation
- Semicolons required
- Single quotes for strings
- 100 character line width

### Testing (Vitest)

```bash
npm test            # Run tests in watch mode
npm run test:ui     # Interactive UI
npm run test:coverage # Generate coverage report
```

**Framework**: Vitest + React Testing Library

**Guidelines**:

- Write tests for all new components
- Aim for >80% code coverage
- Test user interactions, not implementation
- Mock external dependencies

## Project Structure

```
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── [Feature].tsx   # Feature-specific components
├── src/
│   └── test/           # Test files and setup
├── constants.ts        # Mock data
├── types.ts           # Type definitions
├── .eslintrc.cjs      # ESLint config
├── .prettierrc        # Prettier config
├── tsconfig.json      # TypeScript config
└── vitest.config.ts   # Test config
```

## Component Guidelines

### File Naming

- PascalCase for components: `MyComponent.tsx`
- camelCase for utilities: `formatDate.ts`
- Tests alongside or in `__tests__`: `MyComponent.test.tsx`

### Component Structure

```typescript
import React from 'react';
import { ComponentProps } from './types';

interface Props {
  // Define props with JSDoc comments
  /** User object containing profile data */
  user: User;
  /** Callback when action completes */
  onComplete?: () => void;
}

const MyComponent: React.FC<Props> = ({ user, onComplete }) => {
  // Hooks first
  const [state, setState] = useState(initial);

  // Event handlers
  const handleClick = () => {
    // logic
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Accessibility Requirements

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios (WCAG AA)

## Git Workflow

### Commit Messages

Follow conventional commits:

```
feat: add user profile editor
fix: resolve navigation bug
docs: update README
style: format with prettier
refactor: simplify auth logic
test: add login component tests
chore: update dependencies
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements
- `docs/description` - Documentation

## Performance

### Bundle Size

- Keep components small and focused
- Use dynamic imports for heavy features
- Optimize images and assets
- Monitor bundle analyzer output

### React Best Practices

- Use `React.memo` for expensive components
- Implement `useMemo` and `useCallback` appropriately
- Avoid inline function definitions in render
- Lazy load routes and heavy components

## Security

### Best Practices

- Never commit API keys
- Validate all user input
- Sanitize data before rendering
- Use HTTPS in production
- Implement CSRF protection
- Keep dependencies updated

### Environment Variables

- Use `.env.local` for secrets
- Never commit `.env.local`
- Document required variables in `.env.example`

## Documentation

### Code Comments

- Use JSDoc for functions and components
- Explain "why" not "what"
- Keep comments up to date
- Remove commented-out code

### README Updates

- Update when adding major features
- Document new environment variables
- Include setup instructions
- Add troubleshooting section

## Recommended Tools

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin
  - Tailwind CSS IntelliSense
  - Error Lens

- **Browser Extensions**:
  - React Developer Tools
  - Lighthouse

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Guide](https://vitest.dev/guide/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
