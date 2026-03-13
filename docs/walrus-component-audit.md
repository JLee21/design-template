# Walrus Component Audit

**Walrus version:** 83.1.5
**React version:** 16.14.0
**styled-components:** 5.3.11
**react-router-dom:** 6.30.3
**formik:** 2.4.9
**Date:** 2026-02-17
**Live audit page:** `/audit`

## Summary

With React 16.14.0 and styled-components 5.3.11 installed (matching Walrus's peer dependencies exactly), the vast majority of components render correctly. Components marked "needs setup" require specific context providers or external data that won't be present in a basic render test but will work when properly configured.

| Status | Count | Meaning |
|--------|-------|---------|
| Works | 55+ | Renders and behaves correctly |
| Needs Setup | ~8 | Requires Router, Formik, or specific data/context |
| Display Only | ~3 | Renders but relies on external services for full behavior |

---

## Buttons & Actions

| Component | Import | Status | Notes |
|-----------|--------|--------|-------|
| **Button** | `import { Button } from '@do/walrus'` | Works | All variations: primary, secondary, tertiary, success, danger, danger-secondary, icon, list-item, banner, banner-secondary. Props: compact, active, fullWidth, disabled, icon, iconRight. |
| **SpinnerButton** | `import { SpinnerButton } from '@do/walrus'` | Works | Button with `isLoading` prop for loading state. |
| **InlineButton** | `import { InlineButton } from '@do/walrus'` | Works | Inline text-style button. |
| **UnstyledButton** | `import { UnstyledButton } from '@do/walrus'` | Works | Base button with no styles. |

## Form Controls

| Component | Import | Status | Notes |
|-----------|--------|--------|-------|
| **TextInput** | `import { TextInput, Input } from '@do/walrus'` | Works | Standard text input with label, error, placeholder. Also exports `Label`, `ErrorMessage`, `RequiredAsterisk`, `BaseInput`, `Wrapper`, `InputWrapper`, `ErrorText` from `TextInputUtils`. |
| **TextArea** | `import { TextArea } from '@do/walrus'` | Works | Multi-line text input with label. |
| **Checkbox** | `import { Checkbox } from '@do/walrus'` | Works | Controlled checkbox with label. |
| **RadioGroup** | `import { RadioGroup, RadioButton, RadioGroupDescription } from '@do/walrus'` | Works | Radio button group. Requires `name`, `value`, `onChange`. |
| **RadioTier** | `import { RadioTier } from '@do/walrus'` | Works | Tier/pricing selection radio. Also exports `RadioTierBulletItem`, `RadioTierDetailsBullet`, etc. |
| **Switch** | `import { Switch } from '@do/walrus'` | Works | Toggle switch. Requires `name` prop. |
| **SelectMenu** | `import { SelectMenu, Option, Dropdown } from '@do/walrus'` | Works | Dropdown select. Also exports `DropdownContainer`, `DropdownElement`, `OptionSubtext`, `OptionText`, `PlaceholderText`, `SelectMenuContainer`, `Trigger`. |
| **ComboBox** | `import { ComboBox } from '@do/walrus'` | Works | Searchable select. Items format: `{ name: string, value: string }`. |
| **MultiSelectComboBox** | `import { MultiSelectComboBox } from '@do/walrus'` | Works | Multi-select searchable dropdown. |
| **MultiSelectList** | `import { MultiSelectList } from '@do/walrus'` | Works | Multi-select list. Also exports `convertToFormikOptionsList`, `multiSelectListallSelected`. |
| **AutocompleteInput** | `import { AutocompleteInput } from '@do/walrus'` | Works | Autocomplete text input. |
| **FileSelector** | `import { FileSelector } from '@do/walrus'` | Works | File upload selector. |
| **InputStepper** | `import { InputStepper } from '@do/walrus'` | Works | Number stepper with min/max. |
| **TagEditor** | `import { TagEditor } from '@do/walrus'` | Works | Tag input editor with add/remove. |
| **PasswordMeter** | `import { PasswordMeter } from '@do/walrus'` | Works | Password strength indicator. Also exports `evaluatePassword`. |

## Layout

| Component | Import | Status | Notes |
|-----------|--------|--------|-------|
| **Box** | `import { Box } from '@do/walrus'` | Works | Basic layout primitive. |
| **FlexboxGrid** | `import { FlexboxGrid } from '@do/walrus'` | Works | Flexbox grid layout. |
| **Card** | `import { Card, CardHeader, CardContent, CardFooterRow } from '@do/walrus'` | Works | Also exports `CardCloseButton`, `CardGrid`, `CardGridColumn`, `CardHeaderRow`, `CardLink`, `CardList`, `CardListItem`. |
| **Accordion** | `import { Accordion, AccordionItem } from '@do/walrus'` | Works | Expandable sections. Requires `id` prop. |
| **CollapsibleContent** | `import { CollapsibleContent } from '@do/walrus'` | Works | Animated collapsible content with `isOpen` prop. |
| **Modal** | `import { Modal } from '@do/walrus'` | Works | Modal dialog with `onClose` and `title` props. |
| **FullScreenWizard** | `import { FullScreenWizard, PrimaryContent, SecondaryContent } from '@do/walrus'` | Needs Setup | Full-screen wizard flow. Requires navigation context and step management. |
| **Wizard** | `import { Wizard, WizardStep, useWizard } from '@do/walrus'` | Needs Setup | Multi-step wizard. Also exports `ContinueButton`, `ControlsContainer`, `SkipButton`. Requires step config. |
| **Table** | `import { Table, Row, Cell, Head, Header } from '@do/walrus'` | Works | Also exports `CellLink`, `CellSubText`, `CellTextWrapper`, `DropdownCell`, `ExternalCellLink`, `NestedContent`, `RowContext`, `TableElt`, `TableError`. |
| **SettingsActionRow** | `import { SettingsActionRow, DetailsRow, RevealContent } from '@do/walrus'` | Works | Also exports `DefaultContent`. |
| **FullWidthSettingsSection** | `import { FullWidthSettingsSection } from '@do/walrus'` | Works | Also exports `SettingsSectionCollapsedDescription`, `SettingsSectionDisclosureContent`, `SettingsSectionExpandableRow`, `SettingsSectionTitle`, `SettingsSectionTrigger`, `SettingsSectionTriggerWrapper`. |
| **DetailsSection** | `import { DetailsSection, DetailsHeading } from '@do/walrus'` | Works | Details layout section. |

## Navigation

| Component | Import | Status | Notes |
|-----------|--------|--------|-------|
| **Link** | `import { Link } from '@do/walrus'` | Works | Styled anchor link. |
| **BaseLink** | `import { BaseLink } from '@do/walrus'` | Works | Base link component. |
| **DOLink** | `import { DOLink } from '@do/walrus'` | Works | DigitalOcean-specific link. |
| **BreadcrumbBack** | `import { BreadcrumbBack } from '@do/walrus'` | Works | Back navigation breadcrumb. Uses `to` prop. |
| **TabbedNav** | `import { TabbedNav, RouterLinkTab, AuroraLinkTab } from '@do/walrus'` | Needs Setup | Navigation tabs that use react-router. `RouterLinkTab` requires a Router context. |
| **TabbedContent** | `import { TabbedContent, Tab, TabList, TabPanel, TabPanels } from '@do/walrus'` | Works | Content tabs (no routing needed). |
| **Tabs** | `import { Tabs } from '@do/walrus'` | Works | Simple tabbed interface. |
| **Paginator** | `import { Paginator } from '@do/walrus'` | Works | Page navigation. Props: `currentPage`, `totalPages`, `onPageChange`. |
| **DropdownMenu** | `import { DropdownMenu, ActionItem, DropdownLink, Divider } from '@do/walrus'` | Works | Also exports `AuroraLinkItem`, `InAppLinkItem`. |
| **MobileMenu** | `import { MobileMenu, ControlledMobileMenu } from '@do/walrus'` | Works | Mobile-optimized menu. |

## Feedback & Status

| Component | Import | Status | Notes |
|-----------|--------|--------|-------|
| **Alert** | `import { Alert, AlertContainer, useAlert } from '@do/walrus'` | Works | Types: success, warning, error, info. |
| **AlertContent** | `import { AlertContent, IconContent } from '@do/walrus'` | Works | Internal alert content layout. |
| **Badge** | `import { Badge } from '@do/walrus'` | Works | Uses `color` prop (not `variant`): green, blue, orange, red, grey. |
| **Tooltip** | `import { Tooltip } from '@do/walrus'` | Works | Hover tooltip. Also exports `TooltipChildren`. |
| **TooltipHelp** | `import { TooltipHelp } from '@do/walrus'` | Works | Help icon with tooltip. Also exports `TooltipContent`. |
| **Popover** | `import { Popover, usePopover } from '@do/walrus'` | Works | Popover component with hook for state management. |
| **ProgressBar** | `import { ProgressBar } from '@do/walrus'` | Works | Uses `valueNow` and `valueText` props (not `value`). Also exports `ProgressBarMeter`. Requires `label` prop. |
| **LoadingState** | `import { LoadingState } from '@do/walrus'` | Works | Spinner loading indicator. |
| **LoadingPage** | `import { LoadingPage } from '@do/walrus'` | Works | Full-page loading state. |
| **ErrorState** | `import { ErrorState } from '@do/walrus'` | Works | Error display with title/description. |
| **NotificationsBadge** | `import { NotificationsBadge } from '@do/walrus'` | Works | Notification count badge. |

## Display

| Component | Import | Status | Notes |
|-----------|--------|--------|-------|
| **Text** | `import { Text } from '@do/walrus'` | Works | Text rendering component. |
| **Icon** | `import { Icon, IconSvg } from '@do/walrus'` | Works | SVG icon. Requires `walrus-icons.svg` sprite loaded in the document (handled in `index.html`). |
| **Avatar** | `import { Avatar, UserAvatar, TeamAvatar, SkeletonAvatar } from '@do/walrus'` | Works | User/team avatars. |
| **Tag** | `import { Tag, CopyableTag } from '@do/walrus'` | Works | Display tags. |
| **TagGroup** | `import { TagGroup } from '@do/walrus'` | Works | Group of tags. |
| **Code** | `import { Code } from '@do/walrus'` | Works | Code display. Also exports `ColorTheme`. |
| **TruncateText** | `import { TruncateText } from '@do/walrus'` | Works | Single-line text truncation. |
| **TruncatedMultiLineText** | `import { TruncatedMultiLineText } from '@do/walrus'` | Works | Multi-line text truncation. |
| **ClickToCopy** | `import { ClickToCopy, CopyButton } from '@do/walrus'` | Works | Click-to-copy text. Also exports `CopyIcon`, `CopyText`, `CopyWrapper`. |
| **HighFive** | `import { HighFive } from '@do/walrus'` | Works | Celebration/success animation. |

## Specialized

| Component | Import | Status | Notes |
|-----------|--------|--------|-------|
| **RegionSelector** | `import { RegionSelector } from '@do/walrus'` | Needs Setup | Requires region data (uses DO datacenter regions). Also exports `SlugColumn`, and region constants. |
| **ResourceHeader** | `import { ResourceHeaderContainer, ResourceHeaderIcon, ResourceHeaderName } from '@do/walrus'` | Works | Also exports `ResourceHeaderActions`, `ResourceHeaderInfo`, `ResourceHeaderMeta`, `ResourceHeaderMetaItem`, `AppHeader`, `VpcHeader`. |
| **ResourceItem** | `import { ResourceItem, ResourceIcon } from '@do/walrus'` | Works | Also exports `ResourceItemDescription`, `ResourceItemMeta`, `ResourceItemName`, `ResourceItemSize`. |
| **DOLogoNav** | `import { DOLogoNav } from '@do/walrus'` | Display Only | DO logo navigation. Renders but intended for the main DO app header. |
| **IframeSliderModal** | `import { IframeSliderModal, useIframeSliderModal } from '@do/walrus'` | Needs Setup | Iframe modal that loads an external URL. |
| **LearnMoreSection** | `import { LearnMoreSection, CardsContainer } from '@do/walrus'` | Works | Learn more cards layout. |
| **ListItem** | `import { ListItem, ListItemLabel } from '@do/walrus'` | Works | List item display. |
| **StepTransitionManager** | `import { StepTransitionManager } from '@do/walrus'` | Needs Setup | Step transition animations for wizards. |

## Utilities

| Component | Import | Status | Notes |
|-----------|--------|--------|-------|
| **ClickAway** | `import { ClickAway } from '@do/walrus'` | Works | Detects clicks outside a component. |
| **ConditionalWrapper** | `import { ConditionalWrapper } from '@do/walrus'` | Works | Conditionally wraps children. |
| **ScrollMemory** | `import { ScrollMemory } from '@do/walrus'` | Needs Setup | Remembers scroll position. Requires Router context. |
| **VisuallyHidden** | `import { VisuallyHidden } from '@do/walrus'` | Works | Accessible hidden content. |
| **Backdrop** | `import { Backdrop } from '@do/walrus'` | Works | Background overlay. |
| **Background** | `import { Background } from '@do/walrus'` | Works | Background wrapper. |
| **DropdownArrow** | `import { DropdownArrow } from '@do/walrus'` | Works | Arrow icon for dropdowns. |
| **DropdownHandler** | `import { DropdownHandler, DropdownTransition } from '@do/walrus'` | Works | Dropdown open/close handler. |

## Hooks

| Hook | Import | Status | Notes |
|------|--------|--------|-------|
| **useAlert** | `import { useAlert } from '@do/walrus'` | Works | Alert state management. |
| **useDebounce** | `import { useDebounce } from '@do/walrus'` | Works | Debounced value. |
| **useHandleResize** | `import { useHandleResize } from '@do/walrus'` | Works | Window resize handler. |
| **useKeyboardNav** | `import { useKeyboardNav } from '@do/walrus'` | Works | Keyboard navigation. |
| **useMedia** | `import { useMedia } from '@do/walrus'` | Works | Media query hook. |
| **usePopover** | `import { usePopover } from '@do/walrus'` | Works | Popover state. |
| **useToggle** | `import { useToggle } from '@do/walrus'` | Works | Toggle state. |
| **useWindowSize** | `import { useWindowSize } from '@do/walrus'` | Works | Window dimensions. |
| **usePortalDropdownCoords** | `import { usePortalDropdownCoords } from '@do/walrus'` | Works | Portal dropdown positioning. |
| **useScrollbarSize** | `import { useScrollbarSize } from '@do/walrus'` | Works | Scrollbar dimensions. |
| **useIframeSliderModal** | `import { useIframeSliderModal } from '@do/walrus'` | Works | Iframe slider modal state. |
| **useWizard** | `import { useWizard } from '@do/walrus'` | Needs Setup | Wizard step state. Must be inside `Wizard` component. |

## Design Tokens & Global Styles

| Export | Import | Status | Notes |
|--------|--------|--------|-------|
| **style** | `import { style } from '@do/walrus'` | Works | Design tokens: `style.colors.*`, `style.vars.*` (space, fontSize, fontWeight, borderRadius, boxShadow, transitionSpeed, easeInOutCubic). |
| **WalrusGlobalStyle** | `import { WalrusGlobalStyle } from '@do/walrus'` | Works | Global CSS reset and base styles. Rendered in `main.tsx`. |

## Constants & Utilities (non-component exports)

| Export | Import | Status | Notes |
|--------|--------|--------|-------|
| **ALERT_TYPES** | `import { ALERT_TYPES, AlertType } from '@do/walrus'` | Works | Alert type constants. |
| **Keyboard constants** | `import { KEY_ENTER, KEY_ESCAPE, ... } from '@do/walrus'` | Works | Keyboard key code constants. |
| **ProductIconType** | `import { ProductIconType } from '@do/walrus'` | Works | Product icon type enum. |
| **PRIVATE_IP_REGEX** | `import { PRIVATE_IP_REGEX } from '@do/walrus'` | Works | IP validation regex. |
| **Region constants** | `import { DEFAULT_REGIONS_PROD, GEOGRAPHY_MAPPING, ... } from '@do/walrus'` | Works | DO datacenter region data. |
| **GRPCStatusCode** | `import { GRPCStatusCode } from '@do/walrus'` | Works | gRPC status code types. |
| **focusOutline** | `import { focusOutline } from '@do/walrus'` | Works | Focus outline style helper. |
| **formatBytes** | `import { formatBytes } from '@do/walrus'` | Works | Byte formatting utility. |
| **pluralize** | `import { pluralize } from '@do/walrus'` | Works | Pluralization utility. |
| **stringValidation** | `import { stringValidation, SCHEMA } from '@do/walrus'` | Works | String validation utilities. |
| **FormUtils** | `import { FieldSet, FieldSetLegend } from '@do/walrus'` | Works | Form utility components. |
| **CheckAndRadioUtils** | `import { DescriptionText, LabelText } from '@do/walrus'` | Works | Checkbox/radio utility components. |
| **mediaQueries** | `import { mediaQueries } from '@do/walrus'` | Works | Responsive media query helpers. |
| **Misc utilities** | `getInitialDropletName`, `convertCodesArrayToString`, `getFirstChildByType`, `getGeneratedNameRegex`, `hasOwnProperty`, `sortFleets` | Works | Various utility functions. |

---

## Known Prop Differences from Common Patterns

These are props that may trip up developers who guess at the API:

| Component | Common Mistake | Correct Usage |
|-----------|---------------|---------------|
| Badge | `variant="success"` | `color="green"` |
| ProgressBar | `value={65}` | `valueNow={65} valueText="65%"` |
| ProgressBar | (no label) | `label="Progress"` (required) |
| Switch | (no name) | `name="my-switch"` (required) |
| Accordion | (no id) | `id="unique-id"` (required) |
| Button | `variant="primary"` | `variation="primary"` |

## Live Audit Page

Visit `/audit` in the dev server to see every component rendered live with error boundaries. Components that crash will show their error message in red instead of rendering.
