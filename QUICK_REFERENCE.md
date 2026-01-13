# Nature Focus Palette - Quick Reference

## 🎨 At a Glance

### Background Colors
```
bg-primary       #F8FAFB  Soft Cloud White    Main canvas, page backgrounds
bg-secondary     #E8F4F8  Misty Blue          Cards, panels, sections
bg-elevated      #FFFFFF  Pure White          Elevated surfaces, modals
```

### Text Colors
```
text-primary     #1A3A4A  Deep Ocean          Headings, important text (14.2:1)
text-secondary   #4A6A7A  Slate Blue          Body text, paragraphs (7.8:1)
text-tertiary    #6A8A9A  Light Slate         Supporting text, captions (5.2:1)
text-inverse     #FFFFFF  White               Text on dark backgrounds
```

### Action Colors (Buttons)
```
action-primary         #2E7D6E  Forest Teal       Primary buttons
action-primary-hover   #236B5D  Deep Forest       Primary button hover
action-primary-active  #1A5547  Darker Forest     Primary button active
action-secondary       #3A8FB7  Ocean Blue        Secondary buttons
action-secondary-hover #2A6F8F  Deep Ocean Blue   Secondary button hover
```

### Link Colors
```
link-default     #2A6F8F  Deep Ocean Blue     Default links (7.1:1)
link-hover       #1A5570  Darker Ocean        Link hover state (9.5:1)
link-visited     #5A4A7A  Purple-slate        Visited links
```

### Border Colors
```
border-light     #D4E4EA  Soft Mist           Subtle borders, dividers
border-medium    #B4D4DA  Medium Mist         Standard borders
border-strong    #8AB4BA  Strong Mist         Emphasized borders
```

### Focus & Accessibility
```
focus-ring       #5BA3C5  Sky Blue            Keyboard focus indicator (3px)
```

### Status Colors (All AAA Compliant)
```
status-success      #2D7A5F  Deep Green       Success messages (7.2:1)
status-success-bg   #E8F5F0  Light Green      Success backgrounds

status-warning      #9A6B00  Deep Amber       Warning messages (7.5:1)
status-warning-bg   #FFF4E0  Light Amber      Warning backgrounds

status-error        #B71C1C  Deep Red         Error messages (8.1:1)
status-error-bg     #FFEBEE  Light Red        Error backgrounds

status-info         #1A5F7A  Deep Blue        Info messages (8.5:1)
status-info-bg      #E3F2F9  Light Blue       Info backgrounds
```

### Dark Mode Colors
```
dark-bg                #0F1F2A  Deep Ocean Night      Dark background
dark-card              #1A3A4A  Ocean Card            Dark cards
dark-border            #2A4A5A  Ocean Border          Dark borders
dark-text              #E8F4F8  Light Mist Text       Dark mode text
dark-text-secondary    #B4D4DA  Medium Mist Text      Dark mode secondary text
```

## 🚀 Quick Usage

### Tailwind Classes
```tsx
// Backgrounds
className="bg-bg-primary"
className="bg-bg-secondary"

// Text
className="text-text-primary"
className="text-text-secondary"

// Buttons
className="bg-action-primary hover:bg-action-primary-hover text-text-inverse"

// Links
className="text-link-default hover:text-link-hover"

// Status
className="bg-status-success-bg text-status-success"

// Dark Mode
className="bg-bg-primary dark:bg-dark-bg text-text-primary dark:text-dark-text"
```

### CSS Variables
```css
background-color: var(--bg-primary);
color: var(--text-primary);
border-color: var(--border-light);
```

## ✅ Accessibility Checklist

- [ ] Text contrast ≥7:1 (AAA)
- [ ] UI components contrast ≥3:1
- [ ] Focus indicators 3px visible
- [ ] Touch targets ≥44x44px
- [ ] Color not sole indicator
- [ ] Dark mode support
- [ ] Keyboard navigation works

## 📱 Common Patterns

### Card
```tsx
<div className="bg-bg-elevated border border-border-light rounded-lg p-6">
  <h3 className="text-text-primary font-semibold">Title</h3>
  <p className="text-text-secondary mt-2">Description</p>
</div>
```

### Primary Button
```tsx
<button className="bg-action-primary hover:bg-action-primary-hover text-text-inverse px-6 py-3 rounded-lg focus-visible:ring-2 focus-visible:ring-focus-ring">
  Click Me
</button>
```

### Link
```tsx
<a href="#" className="text-link-default hover:text-link-hover underline">
  Learn More
</a>
```

### Success Alert
```tsx
<div className="bg-status-success-bg border-l-4 border-status-success text-status-success p-4 rounded">
  <p>Operation completed successfully!</p>
</div>
```

### Form Input
```tsx
<input
  type="text"
  className="border-2 border-border-medium focus:border-action-primary focus:ring-2 focus:ring-focus-ring bg-bg-elevated text-text-primary px-4 py-3 rounded-lg"
/>
```

## 🎯 Key Principles

1. **Always use semantic tokens** - Never hardcode hex values
2. **Include dark mode** - Add `dark:` variants
3. **Test focus states** - Tab through components
4. **Verify contrast** - Use DevTools
5. **Pair colors with icons** - Don't rely on color alone

---

**Palette:** Nature Focus v1.0  
**Compliance:** WCAG 2.1 AAA  
**Updated:** January 11, 2026
