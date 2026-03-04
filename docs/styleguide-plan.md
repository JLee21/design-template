# do.next Styleguide Plan

## Overview

Build an interactive styleguide site (do.next) that serves as the component library, design documentation, and engineering handoff tool for DigitalOcean's evolving design system.

## Architecture: One Repo

Everything lives in one repo (Design Template). The styleguide is a view into the component library, and projects (Copilot, Home, etc.) are folders within the same repo.

```
design-template/
  src/
    do-next/                    ← Component library (the do.next system)
      components/               ← Graduated components
      registry.json             ← Master registry

    styleguide/                 ← Styleguide site UI
      pages/                    ← Component documentation pages
      components/               ← Styleguide-specific UI (code viewer, prop editor)

    projects/
      copilot/                  ← Copilot redesign
      home/                     ← Home screen redesign
      ...                       ← Future projects

    handoff/
      new/                      ← Brand new components (staging area)
```

## Three Tiers of Components

Every project can use components from three tiers:

1. **Walrus** (official) - `import { Button } from '@do/walrus'` (read-only)
2. **do.next** (our system) - components we've built and stabilized
3. **New** (handoff/new/) - brand new, not yet graduated to do.next

Flow: New → do.next → eventually Walrus (via engineering handoff)

The flow between projects and do.next is **bidirectional** - projects pull from do.next, and push new components back up.

## Styleguide Features

### Core (Must Have)
- [ ] Component catalog with search
- [ ] Live interactive previews
- [ ] Code copy (import statement + full source)
- [ ] Props documentation with TypeScript types
- [ ] Component status indicators (new / modified / existing / one-off)

### Guidance (For Designers + Leadership)
- [ ] "When to use" documentation per component
- [ ] Component decision wizard ("What are you trying to build?")
- [ ] Before/after comparisons
- [ ] Design rationale ("Why does this component exist?")

### Engineering Handoff
- [ ] Full source code viewer with one-click copy
- [ ] Walrus token reference (which design tokens are used)
- [ ] Accessibility notes
- [ ] Edge case documentation (long text, empty states, errors)

### Adoption & Graduation Tracking
- [ ] Where each component is used (which projects/pages)
- [ ] Stability tracking (time since last modification)
- [ ] Graduation checklist (typed, accessible, uses tokens, tested)
- [ ] Adoption metrics (usage count across projects)

### Interactive Features
- [ ] Auto-play demos (component cycles through states)
- [ ] Interactive sandbox (change props, see results live)
- [ ] Real context previews (component in actual page layouts)
- [ ] Edge case explorer

## Inspiration

| Company | What They Do Well |
|---------|------------------|
| Shopify Polaris | Decision trees, "when to use" guidance |
| Atlassian Design System | Design guidance + code together |
| Carbon (IBM) | Guidelines integrated with components |
| Primer (GitHub) | Status indicators (stable/draft/deprecated) |
| Adobe Spectrum | Role-based views (designer vs engineer) |
| Radix | Accessibility documentation |

## Technical Decisions

- **Styling:** styled-components (matches Walrus)
- **Design tokens:** Import `style` from `@do/walrus` for colors, spacing, typography
- **Global styles:** `WalrusGlobalStyle` included at app root
- **Component wrapper:** `withDevMode()` for Dev Mode inspection
- **Registry:** `registry.json` tracks all components with metadata
- **Version tracking:** Auto-check Walrus version on `npm run dev`

## Hosting

- Deploy to a DigitalOcean droplet
- Restrict access via VPN IP whitelist (nginx allow/deny)

## What Makes This Different From Storybook

1. **Design rationale and guidance** - not just "here's the component" but "here's when and why to use it"
2. **Real context** - components shown in actual page layouts, not just isolation
3. **Graduation pipeline** - track component lifecycle from new → stable → Walrus
4. **Adoption data** - evidence-based case for what should graduate
5. **Bidirectional with projects** - not a separate artifact, integrated with active work
6. **Copy-paste compatible** - uses same tech stack as Walrus (styled-components, same tokens)
