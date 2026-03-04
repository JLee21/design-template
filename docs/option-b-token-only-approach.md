# Option B: Token-Only Approach (Fallback Strategy)

## Overview

If the full Walrus component rendering approach (Option A) proves unreliable for certain components, this document describes an alternative: build components using only Walrus **design tokens** (colors, spacing, typography, shadows) without importing the Walrus React components themselves.

This approach trades runtime Walrus compatibility for **visual fidelity** — your components look like Walrus but don't depend on Walrus's React internals.

## When to Use This

- A specific Walrus component crashes or behaves incorrectly even with matched dependencies
- You need a component that Walrus doesn't provide but must visually match the system
- You're building a prototype that doesn't need to be a 1:1 Walrus component copy
- The component's behavior is significantly different from any Walrus component

## How It Works

### 1. Import Only Design Tokens

```tsx
import styled from 'styled-components';
import { style } from '@do/walrus';

// Use tokens for all visual properties
const MyButton = styled.button`
  background: ${style.colors.primary.base};
  color: ${style.colors.white};
  border: none;
  border-radius: ${style.vars.borderRadius.base};
  padding: ${style.vars.space['2']} ${style.vars.space['4']};
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  cursor: pointer;
  transition: background ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};

  &:hover {
    background: ${style.colors.primary.dark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

### 2. Match Walrus Visual Patterns

Reference the Walrus Storybook or the live components on the DO platform to ensure your custom component matches the visual language:

- **Colors:** Always use `style.colors.*` — never hardcode hex values
- **Spacing:** Always use `style.vars.space['N']` — keeps rhythm consistent
- **Typography:** Use `style.vars.fontSize.*` and `style.vars.fontWeight.*`
- **Borders:** Use `style.vars.borderRadius.*`
- **Shadows:** Use `style.vars.boxShadow.*`
- **Transitions:** Use `style.vars.transitionSpeed.*` and `style.vars.easeInOutCubic`

### 3. Available Token Reference

#### Colors
```
style.colors.primary.base    → #0069ff (DO blue)
style.colors.primary.dark    → #0050c7
style.colors.primary.light   → #e6f0ff
style.colors.grey.darkest    → #031b4e
style.colors.grey.dark       → #5b6987
style.colors.grey.primary    → #98a2b3
style.colors.grey.light      → #e5e8ed
style.colors.grey.lightest   → #f5f7fa
style.colors.white           → #ffffff
style.colors.green.base      → #15cd72 (success)
style.colors.red.base        → #e6223c (danger)
style.colors.orange.base     → #f59e0b (warning)
```

#### Spacing
```
style.vars.space['1']  → 0.25rem  (4px)
style.vars.space['2']  → 0.5rem   (8px)
style.vars.space['3']  → 1rem     (16px)
style.vars.space['4']  → 1.5rem   (24px)
style.vars.space['5']  → 2rem     (32px)
style.vars.space['6']  → 2.5rem   (40px)
style.vars.space['7']  → 3rem     (48px)
style.vars.space['8']  → 3.5rem   (56px)
style.vars.space['9']  → 4rem     (64px)
style.vars.space['10'] → 4.5rem   (72px)
```

#### Typography
```
style.vars.fontSize.small   → 14px
style.vars.fontSize.base    → 16px
style.vars.fontSize.large   → 20px
style.vars.fontWeight.base  → 400
style.vars.fontWeight.bold  → 600
style.vars.fontWeight.bolder → 700
```

#### Other
```
style.vars.borderRadius.base  → 3px
style.vars.borderRadius.large → 5px
style.vars.boxShadow.base     → 0 1px 2px rgba(0,0,0,0.1)
style.vars.boxShadow.raised   → 0 2px 4px rgba(0,0,0,0.12)
style.vars.boxShadow.top      → 0 -1px 2px rgba(0,0,0,0.1)
style.vars.transitionSpeed.base → 0.25s
style.vars.easeInOutCubic     → cubic-bezier(0.645, 0.045, 0.355, 1)
```

## Template for Token-Only Components

```tsx
import React from 'react';
import styled from 'styled-components';
import { style } from '@do/walrus';
import { withDevMode } from '@dev-mode/DevModeProvider';

// --- Styled Elements (using only Walrus tokens) ---

const Wrapper = styled.div`
  background: ${style.colors.white};
  border: 1px solid ${style.colors.grey.light};
  border-radius: ${style.vars.borderRadius.large};
  padding: ${style.vars.space['4']};
  box-shadow: ${style.vars.boxShadow.base};
  transition: box-shadow ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};

  &:hover {
    box-shadow: ${style.vars.boxShadow.raised};
  }
`;

const Title = styled.h3`
  color: ${style.colors.grey.darkest};
  font-size: ${style.vars.fontSize.large};
  font-weight: ${style.vars.fontWeight.bold};
  margin: 0 0 ${style.vars.space['2']};
`;

const Description = styled.p`
  color: ${style.colors.grey.dark};
  font-size: ${style.vars.fontSize.small};
  line-height: 1.5;
  margin: 0;
`;

// --- Component ---

interface MyComponentProps {
  title: string;
  description: string;
}

function MyComponentBase({ title, description }: MyComponentProps) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Wrapper>
  );
}

export const MyComponent = withDevMode(MyComponentBase, {
  name: 'MyComponent',
  status: 'new',
  location: 'src/handoff/new/MyComponent.tsx',
  purpose: 'Description of what this component does',
});
```

## Trade-offs

| Aspect | Option A (Full Walrus) | Option B (Tokens Only) |
|--------|----------------------|----------------------|
| Visual fidelity | Exact match | Very close (manual) |
| Behavior fidelity | Exact match | Must reimplement |
| Accessibility | Inherited from Walrus | Must implement |
| Maintenance | Breaks if Walrus changes API | Breaks if tokens change |
| Engineer handoff | Copy-paste ready | Needs conversion to Walrus |
| Dependency risk | Tied to Walrus internals | Only tied to tokens |
| Speed to build | Faster (component exists) | Slower (build from scratch) |

## Recommendation

Use **Option A** (full Walrus components) as the default. Fall back to **Option B** only for specific components that don't render correctly or don't exist in Walrus. The audit at `docs/walrus-component-audit.md` identifies which components work and which might need this fallback.

When using Option B, always document in the component's `withDevMode` metadata that it's a token-only implementation, so engineers know it will need to be rebuilt using official Walrus components during handoff:

```tsx
export const MyComponent = withDevMode(MyComponentBase, {
  name: 'MyComponent',
  status: 'new',
  location: 'src/handoff/new/MyComponent.tsx',
  purpose: 'Token-only implementation — no Walrus component equivalent',
  // This signals to engineers that this is custom, not a Walrus wrapper
});
```
