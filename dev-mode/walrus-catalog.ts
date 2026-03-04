/**
 * Walrus Component Catalog for DevInspector
 *
 * Maps Walrus component names to their documentation data
 * so the inspector can show useful info when clicking Walrus components.
 */

export interface WalrusCatalogEntry {
  name: string;
  import: string;
  description: string;
  storybookUrl?: string;
  variations?: string[];
  props: Record<string, { type: string; description?: string }>;
}

export const walrusCatalog: Record<string, WalrusCatalogEntry> = {
  Button: {
    name: 'Button',
    import: "import { Button } from '@do/walrus';",
    description: 'Standard action button with multiple style variations.',
    storybookUrl: 'https://walrus.internal.digitalocean.com/?path=/docs/button',
    variations: [
      'primary',
      'secondary',
      'tertiary',
      'icon',
      'success',
      'danger',
      'danger-secondary',
      'list-item',
      'banner',
      'banner-secondary',
    ],
    props: {
      variation: { type: "'primary' | 'secondary' | 'tertiary' | 'icon' | 'success' | 'danger' | 'danger-secondary' | 'list-item' | 'banner' | 'banner-secondary'", description: 'Visual style variant' },
      compact: { type: 'boolean', description: 'Smaller button height (40px vs 48px)' },
      active: { type: 'boolean', description: 'Active/pressed state' },
      fullWidth: { type: 'boolean', description: 'Expand to fill container width' },
      disabled: { type: 'boolean', description: 'Disable interactions' },
      icon: { type: 'string', description: 'Icon name to display' },
      iconSize: { type: "'small' | 'large' | 'xlarge'", description: 'Size of the icon' },
      iconRight: { type: 'boolean', description: 'Position icon on the right side' },
      url: { type: 'string', description: 'Renders as an anchor tag instead of button' },
      external: { type: 'boolean', description: 'Opens URL in new tab (adds target="_blank")' },
    },
  },

  SpinnerButton: {
    name: 'SpinnerButton',
    import: "import { SpinnerButton } from '@do/walrus';",
    description: 'Button with built-in loading spinner state.',
    props: {
      loading: { type: 'boolean', description: 'Show spinner and disable interactions' },
    },
  },

  TextInput: {
    name: 'TextInput',
    import: "import { TextInput } from '@do/walrus';",
    description: 'Standard text input with label and error states.',
    storybookUrl: 'https://walrus.internal.digitalocean.com/?path=/docs/textinput',
    props: {
      label: { type: 'string', description: 'Input label text' },
      error: { type: 'string', description: 'Error message to display' },
      required: { type: 'boolean', description: 'Show required asterisk' },
      placeholder: { type: 'string', description: 'Placeholder text' },
      disabled: { type: 'boolean', description: 'Disable input' },
    },
  },

  Card: {
    name: 'Card',
    import: "import { Card, CardHeader, CardContent, CardFooterRow } from '@do/walrus';",
    description: 'Container card with optional header, content, and footer sections.',
    props: {},
  },

  Alert: {
    name: 'Alert',
    import: "import { Alert, AlertContainer, useAlert } from '@do/walrus';",
    description: 'Notification banner for success, warning, error, or info messages.',
    variations: ['success', 'warning', 'error', 'info'],
    props: {
      type: { type: "'success' | 'warning' | 'error' | 'info'", description: 'Alert type/color' },
      dismissible: { type: 'boolean', description: 'Show dismiss button' },
    },
  },

  Modal: {
    name: 'Modal',
    import: "import { Modal } from '@do/walrus';",
    description: 'Dialog overlay for focused content or actions.',
    props: {
      isOpen: { type: 'boolean', description: 'Control modal visibility' },
      onRequestClose: { type: '() => void', description: 'Called when modal should close' },
    },
  },

  Badge: {
    name: 'Badge',
    import: "import { Badge } from '@do/walrus';",
    description: 'Small status indicator label.',
    props: {},
  },

  Tooltip: {
    name: 'Tooltip',
    import: "import { Tooltip } from '@do/walrus';",
    description: 'Hover tooltip for additional context.',
    props: {
      content: { type: 'string | ReactNode', description: 'Tooltip content' },
    },
  },

  SelectMenu: {
    name: 'SelectMenu',
    import: "import { SelectMenu, Option, Dropdown } from '@do/walrus';",
    description: 'Dropdown select menu.',
    props: {
      value: { type: 'string', description: 'Selected value' },
      onChange: { type: '(value: string) => void', description: 'Selection change handler' },
    },
  },

  Checkbox: {
    name: 'Checkbox',
    import: "import { Checkbox } from '@do/walrus';",
    description: 'Standard checkbox input.',
    props: {
      checked: { type: 'boolean', description: 'Checked state' },
      onChange: { type: '(e: ChangeEvent) => void', description: 'Change handler' },
      label: { type: 'string', description: 'Checkbox label' },
    },
  },

  Switch: {
    name: 'Switch',
    import: "import { Switch } from '@do/walrus';",
    description: 'Toggle switch control.',
    props: {
      checked: { type: 'boolean', description: 'On/off state' },
      onChange: { type: '() => void', description: 'Toggle handler' },
    },
  },

  Accordion: {
    name: 'Accordion',
    import: "import { Accordion, AccordionItem } from '@do/walrus';",
    description: 'Expandable/collapsible content sections.',
    storybookUrl: 'https://walrus.internal.digitalocean.com/?path=/docs/accordion',
    props: {
      id: { type: 'string', description: 'Unique ID for the accordion' },
      defaultExpandedIndex: { type: 'number', description: 'Index of initially expanded item' },
    },
  },

  AccordionItem: {
    name: 'AccordionItem',
    import: "import { Accordion, AccordionItem } from '@do/walrus';",
    description: 'Individual expandable section within an Accordion.',
    props: {
      title: { type: 'string', description: 'Header text for the accordion item' },
    },
  },

  ProgressBar: {
    name: 'ProgressBar',
    import: "import { ProgressBar } from '@do/walrus';",
    description: 'Horizontal progress indicator.',
    props: {
      value: { type: 'number', description: 'Progress percentage (0-100)' },
    },
  },

  Tag: {
    name: 'Tag',
    import: "import { Tag, CopyableTag } from '@do/walrus';",
    description: 'Small label tag, optionally copyable.',
    props: {},
  },

  DropdownMenu: {
    name: 'DropdownMenu',
    import: "import { DropdownMenu, ActionItem, DropdownLink, Divider } from '@do/walrus';",
    description: 'Contextual action menu.',
    props: {},
  },

  TabbedContent: {
    name: 'TabbedContent',
    import: "import { TabbedContent, Tab, TabList, TabPanel, TabPanels } from '@do/walrus';",
    description: 'Tabbed content panels.',
    props: {},
  },

  Table: {
    name: 'Table',
    import: "import { Table, Row, Cell, Header, Head } from '@do/walrus';",
    description: 'Data table with headers and rows.',
    props: {},
  },

  LoadingState: {
    name: 'LoadingState',
    import: "import { LoadingState } from '@do/walrus';",
    description: 'Loading spinner placeholder.',
    props: {},
  },

  ErrorState: {
    name: 'ErrorState',
    import: "import { ErrorState } from '@do/walrus';",
    description: 'Error state with message and retry action.',
    props: {},
  },

  Avatar: {
    name: 'Avatar',
    import: "import { Avatar, UserAvatar, TeamAvatar } from '@do/walrus';",
    description: 'User or team avatar display.',
    props: {},
  },
};

/**
 * Look up a Walrus catalog entry by component name.
 */
export function lookupWalrusComponent(name: string): WalrusCatalogEntry | null {
  return walrusCatalog[name] ?? null;
}
