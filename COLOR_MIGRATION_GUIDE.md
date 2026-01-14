# Nature Focus Palette Migration Guide

## Overview

This guide helps developers migrate existing components to use the new **Nature Focus** color palette, which is fully ADA-compliant (WCAG 2.1 AAA).

## Quick Reference

### Color Mapping (Old → New)

| Old Color    | Old Usage      | New Color Token  | New Hex   |
| ------------ | -------------- | ---------------- | --------- |
| `gray-50`    | Background     | `bg-primary`     | `#F8FAFB` |
| `gray-100`   | Cards          | `bg-secondary`   | `#E8F4F8` |
| `gray-900`   | Text           | `text-primary`   | `#1A3A4A` |
| `gray-700`   | Secondary text | `text-secondary` | `#4A6A7A` |
| `gray-500`   | Tertiary text  | `text-tertiary`  | `#6A8A9A` |
| `indigo-600` | Primary button | `action-primary` | `#2E7D6E` |
| `blue-600`   | Links          | `link-default`   | `#2A6F8F` |
| `green-600`  | Success        | `status-success` | `#2D7A5F` |
| `yellow-600` | Warning        | `status-warning` | `#9A6B00` |
| `red-600`    | Error          | `status-error`   | `#B71C1C` |

## Step-by-Step Migration

### 1. Update Background Colors

**Before:**

```tsx
<div className="bg-gray-50 dark:bg-slate-900">
```

**After:**

```tsx
<div className="bg-bg-primary dark:bg-dark-bg">
```

### 2. Update Text Colors

**Before:**

```tsx
<h1 className="text-gray-900 dark:text-gray-100">
<p className="text-gray-700 dark:text-gray-300">
<span className="text-gray-500">
```

**After:**

```tsx
<h1 className="text-text-primary dark:text-dark-text">
<p className="text-text-secondary dark:text-dark-text-secondary">
<span className="text-text-tertiary">
```

### 3. Update Button Colors

**Before:**

```tsx
<button className="bg-indigo-600 hover:bg-indigo-700 text-white">
```

**After:**

```tsx
<button className="bg-action-primary hover:bg-action-primary-hover text-text-inverse">
```

### 4. Update Link Colors

**Before:**

```tsx
<a className="text-blue-600 hover:text-blue-800">
```

**After:**

```tsx
<a className="text-link-default hover:text-link-hover">
```

### 5. Update Border Colors

**Before:**

```tsx
<div className="border border-gray-200">
<div className="border-2 border-gray-300">
```

**After:**

```tsx
<div className="border border-border-light">
<div className="border-2 border-border-medium">
```

### 6. Update Status Colors

**Before:**

```tsx
<div className="bg-green-100 text-green-800">Success!</div>
<div className="bg-yellow-100 text-yellow-800">Warning!</div>
<div className="bg-red-100 text-red-800">Error!</div>
```

**After:**

```tsx
<div className="bg-status-success-bg text-status-success">Success!</div>
<div className="bg-status-warning-bg text-status-warning">Warning!</div>
<div className="bg-status-error-bg text-status-error">Error!</div>
```

### 7. Update Focus States

**Before:**

```tsx
<button className="focus:ring-2 focus:ring-indigo-500">
```

**After:**

```tsx
<button className="focus:ring-2 focus:ring-focus-ring">
```

## Component-Specific Examples

### Card Component

**Before:**

```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
  <h3 className="text-gray-900 dark:text-white">Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

**After:**

```tsx
<div className="bg-bg-elevated dark:bg-dark-card border border-border-light dark:border-dark-border rounded-lg shadow-sm">
  <h3 className="text-text-primary dark:text-dark-text">Title</h3>
  <p className="text-text-secondary dark:text-dark-text-secondary">Description</p>
</div>
```

### Form Input

**Before:**

```tsx
<input
  type="text"
  className="border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900"
/>
```

**After:**

```tsx
<input
  type="text"
  className="border border-border-medium focus:border-action-primary focus:ring-focus-ring bg-bg-elevated text-text-primary"
/>
```

### Alert/Notification

**Before:**

```tsx
<div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
  <p>Information message</p>
</div>
```

**After:**

```tsx
<div className="bg-status-info-bg border-l-4 border-status-info text-status-info p-4">
  <p>Information message</p>
</div>
```

### Navigation Link

**Before:**

```tsx
<a
  href="/dashboard"
  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md"
>
  Dashboard
</a>
```

**After:**

```tsx
<a
  href="/dashboard"
  className="text-text-secondary hover:text-action-primary hover:bg-bg-secondary px-3 py-2 rounded-md"
>
  Dashboard
</a>
```

## Automated Migration Script

Use this regex find-and-replace to speed up migration:

### Background Colors

- Find: `bg-gray-50(?!\d)`
- Replace: `bg-bg-primary`

- Find: `bg-white(?!\d)`
- Replace: `bg-bg-elevated`

- Find: `bg-gray-100(?!\d)`
- Replace: `bg-bg-secondary`

### Text Colors

- Find: `text-gray-900(?!\d)`
- Replace: `text-text-primary`

- Find: `text-gray-700(?!\d)`
- Replace: `text-text-secondary`

- Find: `text-gray-600(?!\d)`
- Replace: `text-text-secondary`

- Find: `text-gray-500(?!\d)`
- Replace: `text-text-tertiary`

### Button Colors

- Find: `bg-indigo-600(?!\d)`
- Replace: `bg-action-primary`

- Find: `bg-indigo-700(?!\d)`
- Replace: `bg-action-primary-hover`

- Find: `bg-blue-600(?!\d)`
- Replace: `bg-action-secondary`

### Border Colors

- Find: `border-gray-200(?!\d)`
- Replace: `border-border-light`

- Find: `border-gray-300(?!\d)`
- Replace: `border-border-medium`

## Testing Checklist

After migrating a component, verify:

- [ ] All text is readable (check contrast with browser DevTools)
- [ ] Focus states are visible (tab through interactive elements)
- [ ] Hover states work correctly
- [ ] Dark mode looks good (toggle theme)
- [ ] Colors match the Nature Focus palette
- [ ] No hardcoded hex values remain
- [ ] Status colors are distinguishable
- [ ] Links are underlined and clearly visible

## Common Pitfalls

### ❌ Don't Use Hardcoded Colors

```tsx
// Bad
<div style={{ backgroundColor: '#005A9C' }}>
```

### ✅ Use Tailwind Tokens

```tsx
// Good
<div className="bg-action-primary">
```

### ❌ Don't Skip Dark Mode

```tsx
// Bad
<div className="bg-bg-primary text-text-primary">
```

### ✅ Include Dark Mode Classes

```tsx
// Good
<div className="bg-bg-primary dark:bg-dark-bg text-text-primary dark:text-dark-text">
```

### ❌ Don't Forget Focus States

```tsx
// Bad
<button className="bg-action-primary">
```

### ✅ Always Add Focus Indicators

```tsx
// Good
<button className="bg-action-primary focus-visible:ring-2 focus-visible:ring-focus-ring">
```

## Accessibility Requirements

When using the new palette, ensure:

1. **Contrast Ratios**
   - Normal text: ≥7:1 (AAA)
   - Large text (18pt+): ≥4.5:1 (AA)
   - UI components: ≥3:1 (AA)

2. **Touch Targets**
   - Minimum 44x44px for all interactive elements
   - Use `min-h-[44px] min-w-[44px]` or the `touch-target` class

3. **Focus Indicators**
   - Always visible on keyboard focus
   - Minimum 3px outline
   - Use `focus-visible:ring-2 focus-visible:ring-focus-ring`

4. **Color Independence**
   - Never use color alone to convey information
   - Pair status colors with icons or text labels

## Component Priority

Migrate components in this order:

1. **High Priority** (User-facing, frequently used)
   - [ ] App.tsx (main layout)
   - [ ] Header component
   - [ ] Sidebar/Navigation
   - [ ] Login page
   - [ ] Dashboard

2. **Medium Priority** (Important features)
   - [ ] Forms and inputs
   - [ ] Buttons and CTAs
   - [ ] Cards and panels
   - [ ] Modals and dialogs
   - [ ] Alerts and notifications

3. **Low Priority** (Less critical)
   - [ ] Settings pages
   - [ ] Admin panels
   - [ ] Documentation pages
   - [ ] Error pages

## Validation Tools

Use these tools to verify compliance:

1. **Browser DevTools**
   - Chrome: Lighthouse Accessibility Audit
   - Firefox: Accessibility Inspector

2. **Extensions**
   - WAVE (Web Accessibility Evaluation Tool)
   - axe DevTools
   - Color Contrast Analyzer

3. **Manual Testing**
   - Keyboard navigation (Tab, Shift+Tab, Enter, Space)
   - Screen reader (NVDA, JAWS, VoiceOver)
   - Color blindness simulation

## Support

For questions or issues:

- Review [ADA_COMPLIANCE.md](./ADA_COMPLIANCE.md)
- Check [nature-focus-palette.css](./nature-focus-palette.css) for CSS variables
- See [tailwind.config.js](./tailwind.config.js) for Tailwind tokens

---

**Last Updated:** January 11, 2026  
**Palette Version:** Nature Focus v1.0  
**Compliance:** WCAG 2.1 Level AAA
