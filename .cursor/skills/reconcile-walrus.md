# Reconcile with Walrus

## Purpose
When @do/walrus access is obtained, this skill reviews all "new" components and identifies which ones can be replaced with official Walrus components.

## Prerequisites
- `@do/walrus` is installed (`yarn add @do/walrus` succeeded)
- Storybook access to verify component matches
- Update `config/bridge.config.json`: set `walrusInstalled: true` and `preWalrusMode: false`

## Steps

### 1. Update Config
```json
{
  "walrusInstalled": true,
  "preWalrusMode": false
}
```

### 2. Read All New Components
```bash
cat src/handoff/registry.json | jq '.components | to_entries[] | select(.value.status == "new")'
```

### 3. Compare Against Walrus Catalog
For each "new" component, check if a Walrus equivalent exists.

Present findings in a table:

| Component | Walrus Match | Confidence | Recommendation |
|-----------|--------------|------------|----------------|
| [Name] | `[WalrusComponent]` | High/Medium/Low | Swap / Keep as New / Review |

### 4. User Decisions
For each component, ask the user:
- **Swap**: Replace with Walrus component
- **Keep**: Component doesn't exist in Walrus, keep as "new" (graduation candidate)
- **Review**: Needs manual review before deciding

### 5. Execute Swaps
For components marked "Swap":

1. Find all imports of the component in `src/prototype/`
2. Replace imports:
   ```typescript
   // Before
   import { CustomButton } from '@handoff/new/CustomButton';
   
   // After  
   import { Button } from '@do/walrus';
   ```
3. Update props if Walrus API differs
4. Update registry.json: change status to "existing"
5. Optionally delete the handoff component file

### 6. Update Registry
```json
{
  "[ComponentName]": {
    "status": "existing",
    "walrusComponent": "[WalrusName]",
    "import": "import { [WalrusName] } from '@do/walrus'",
    "storybookUrl": "[url]",
    "reconciledAt": "[ISO date]",
    "previousLocation": "src/handoff/new/[ComponentName].tsx"
  }
}
```

### 7. Update Component Checkpoint Rule
Add newly discovered Walrus components to the catalog in `walrus-component-checkpoint.mdc`.

## Output
Summary report:
- Components swapped to Walrus: [count]
- Components kept as New: [count] (graduation candidates)
- Components needing review: [count]

## Notes
- This skill should be run once when Walrus access is first obtained
- After reconciliation, the component checkpoint will properly identify Walrus components going forward
- Components kept as "new" are prime candidates for graduation to the master template
