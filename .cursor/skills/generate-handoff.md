# Generate Handoff Documentation

## Purpose
Creates a comprehensive HANDOFF.md document from the registry, ready for engineering review and Google Docs export.

## When to Use
Run this skill when a prototype is ready for developer handoff.

## Steps

### 1. Read Registry
```bash
cat src/handoff/registry.json
```

### 2. Generate Document Structure

Create `docs/HANDOFF.md` with the following structure:

```markdown
# Project Handoff: [Project Name]

**Generated:** [Current Date]
**Status:** Pre-Walrus Mode (all components are New)

## Overview
[Brief description from project.name in registry]

## Component Inventory

### New Components ([count])
[For each component with status: "new"]

#### [ComponentName]
- **Status:** New Component
- **Location:** `[location]`
- **Import:** `[import statement]`
- **Purpose:** [purpose]

**Key Interactions:**
- [interaction 1]
- [interaction 2]

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| [prop] | [type] | [description] |

**Code:**
\`\`\`tsx
[Full component code from file]
\`\`\`

---

### Modified Components ([count])
[For each component with status: "modified"]
[Same format as above, plus "Base Component" and "Modifications" sections]

---

### Existing Walrus Components ([count])
[For each component with status: "existing"]
- **[Name]** - [import] - [Storybook link]
  - Changes: [any text/prop changes noted]

---

## Screenshots
[List any screenshots in exports/screenshots/]

## Next Steps
- [ ] Review New components for Walrus adoption candidates
- [ ] Verify Modified components against current Walrus
- [ ] Test all interactions listed above
```

### 3. Read Component Files
For each component in registry, read the actual file to embed the code:
```bash
cat src/handoff/new/[ComponentName].tsx
```

### 4. Check for Screenshots
```bash
ls exports/screenshots/
```

### 5. Write Output
Save to `docs/HANDOFF.md`

## Output
- Confirm document created
- Show component counts by status
- Remind user about Google Docs export skill if needed
