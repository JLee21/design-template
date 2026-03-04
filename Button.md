# Button
## Metadata
- **Status:** Existing (Walrus)
- **Import:** `import { Button } from '@do/walrus'`

## Visual Heuristics
- **Primary Color:** #0069ff (DigitalOcean Blue)
- **Corner Radius:** 8px
- **Styles:** Solid background for primary, 2px border for secondary.

## Props
- **variant:** 'primary' | 'secondary' | 'ghost' | 'danger'
- **size:** 'sm' | 'md' | 'lg'
- **isLoading:** boolean
- **isDisabled:** boolean

## Usage Example
```tsx
import { Button } from '@do/walrus';

<Button variant="primary" size="md">
  Click Me
</Button>
```
