# Graduate Component to Master Template

## Purpose
Promotes a component from the current project's `handoff/` folder to the master template's `graduated/` folder, making it available in all future projects.

## When to Use
Run this skill when a component has proven valuable and should be included in the base template for future projects.

## Prerequisites
- Component exists in `src/handoff/new/` or `src/handoff/modified/`
- Component is registered in `src/handoff/registry.json`
- `config/bridge.config.json` has valid `masterTemplatePath`

## Steps

### 1. Identify the Component
Ask the user which component to graduate, or accept it as a parameter.

### 2. Read Component Details
```bash
# Read the component file
cat src/handoff/new/[ComponentName].tsx

# Read registry entry
cat src/handoff/registry.json | jq '.components["[ComponentName]"]'
```

### 3. Copy to Master Template
```bash
# Get master template path from config
MASTER_PATH=$(cat config/bridge.config.json | jq -r '.masterTemplatePath')

# Copy component to graduated folder
cp src/handoff/new/[ComponentName].tsx "$MASTER_PATH/src/graduated/[ComponentName].tsx"
```

### 4. Update Graduated Index
Add export to `src/graduated/index.ts`:
```typescript
export { [ComponentName] } from './[ComponentName]';
```

### 5. Update Master Template's Registry
Add component to master template's component catalog so it's recognized in future projects.

### 6. Update Component Checkpoint Rule (Optional)
If this component should be recognized as "existing" in future projects, add it to the Walrus catalog section of `walrus-component-checkpoint.mdc`.

## Output
Confirm graduation with:
- Component name
- Source location
- Destination location
- Reminder to remove from handoff if this was the source project

## Notes
- Graduated components use the `@graduated` import alias
- Components keep their DevMode metadata
- The registry.json in the master template tracks graduated components separately
