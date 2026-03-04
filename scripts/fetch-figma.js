/**
 * Figma Node Fetcher
 *
 * Fetches a Figma design node and outputs a clean component summary
 * that can be matched against the Walrus catalog instantly.
 *
 * Usage:
 *   node scripts/fetch-figma.js <figma-url-or-node-id> [file-key]
 *
 * Examples:
 *   node scripts/fetch-figma.js "https://www.figma.com/design/ABC123/File?node-id=187-1714"
 *   node scripts/fetch-figma.js 187-1714 ABC123
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

// --- Token ---

function getToken() {
  try {
    const envFile = readFileSync(resolve(__dirname, '../.env'), 'utf-8');
    const match = envFile.match(/FIGMA_TOKEN=(.+)/);
    if (match) return match[1].trim();
  } catch { /* ignore */ }

  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN;

  console.error('No FIGMA_TOKEN found. Set it in .env or as an environment variable.');
  process.exit(1);
}

// --- URL Parsing ---

function parseInput(input, fileKeyArg) {
  // Full Figma URL
  const urlMatch = input.match(/figma\.com\/(?:design|file)\/([^/]+)\/.*node-id=([^&]+)/);
  if (urlMatch) {
    return { fileKey: urlMatch[1], nodeId: urlMatch[2].replace('-', ':') };
  }

  // Node ID + file key argument
  if (fileKeyArg) {
    return { fileKey: fileKeyArg, nodeId: input.replace('-', ':') };
  }

  console.error('Could not parse Figma URL or node ID. Provide a full URL or "nodeId fileKey".');
  process.exit(1);
}

// --- Figma API ---

async function fetchNode(token, fileKey, nodeId) {
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}&depth=4`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Figma API error ${res.status}: ${text}`);
    process.exit(1);
  }
  return res.json();
}

// --- Node Analysis ---

function rgbaToHex(c) {
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function extractInfo(node) {
  const result = {
    name: node.name,
    type: node.type,
    isInstance: node.type === 'INSTANCE',
    isComponent: node.type === 'COMPONENT' || node.type === 'COMPONENT_SET',
    componentProperties: {},
    width: node.absoluteBoundingBox?.width,
    height: node.absoluteBoundingBox?.height,
    fills: [],
    texts: [],
    typography: [],
    padding: null,
    gap: node.itemSpacing || null,
    cornerRadius: node.cornerRadius || null,
    children: [],
  };

  // Component properties (variant info)
  if (node.componentProperties) {
    for (const [key, val] of Object.entries(node.componentProperties)) {
      result.componentProperties[key] = val.value;
    }
  }

  // Fills
  for (const fill of (node.fills || [])) {
    if (fill.type === 'SOLID' && fill.visible !== false) {
      result.fills.push(rgbaToHex(fill.color));
    }
  }

  // Padding
  if (node.paddingLeft !== undefined) {
    result.padding = {
      left: node.paddingLeft,
      top: node.paddingTop,
      right: node.paddingRight,
      bottom: node.paddingBottom,
    };
  }

  // Recurse children
  for (const child of (node.children || [])) {
    if (child.visible === false) continue;

    // Collect text nodes
    if (child.type === 'TEXT') {
      result.texts.push(child.characters);
      result.typography.push({
        text: child.characters,
        fontFamily: child.style?.fontFamily,
        fontSize: child.style?.fontSize,
        fontWeight: child.style?.fontWeight,
        fill: (child.fills || []).find(f => f.type === 'SOLID' && f.visible !== false)
          ? rgbaToHex(child.fills.find(f => f.type === 'SOLID' && f.visible !== false).color)
          : null,
      });
    }

    const childInfo = extractInfo(child);
    result.texts.push(...childInfo.texts);
    result.typography.push(...childInfo.typography);
    if (!result.fills.length && childInfo.fills.length) {
      result.fills = childInfo.fills;
    }
    if (!result.padding && childInfo.padding) {
      result.padding = childInfo.padding;
    }
    if (!result.cornerRadius && childInfo.cornerRadius) {
      result.cornerRadius = childInfo.cornerRadius;
    }
    result.children.push(childInfo);
  }

  return result;
}

// --- Walrus Matching ---

const WALRUS_HEURISTICS = [
  {
    name: 'Button',
    match: (info) => {
      const props = info.componentProperties;
      const hasTypeVariant = 'Type' in props && ['Primary', 'Secondary', 'Tertiary', 'Success', 'Danger Primary', 'Danger Secondary'].includes(props.Type);
      const hasSizeVariant = 'Size' in props;
      const hasStateVariant = 'State' in props;
      const looksLikeButton = info.name?.toLowerCase().includes('button');
      return (hasTypeVariant && (hasSizeVariant || hasStateVariant)) || looksLikeButton;
    },
    mapProps: (info) => {
      const props = info.componentProperties;
      const typeMap = {
        'Primary': 'primary', 'Secondary': 'secondary', 'Tertiary': 'tertiary',
        'Success': 'success', 'Danger Primary': 'danger', 'Danger Secondary': 'danger-secondary',
      };
      const result = { variation: typeMap[props.Type] || 'primary' };
      if (props.Size === 'Compact') result.compact = true;
      if (props.State === 'Disabled') result.disabled = true;
      if (props.State === 'Loading') result._useSpinnerButton = true;
      if (props['Icon-Left'] === 'True') result.icon = '(icon)';
      if (props['Icon-Right'] === 'True') result.iconRight = '(icon)';
      result._text = info.texts[0] || 'Button';
      return result;
    },
    import: "import { Button } from '@do/walrus'",
  },
  {
    name: 'Badge',
    match: (info) => info.name?.toLowerCase().includes('badge'),
    mapProps: (info) => ({ color: 'blue', _text: info.texts[0] || 'Badge' }),
    import: "import { Badge } from '@do/walrus'",
  },
  {
    name: 'Alert',
    match: (info) => info.name?.toLowerCase().includes('alert'),
    mapProps: (info) => {
      const props = info.componentProperties;
      return { type: (props.Type || 'info').toLowerCase(), _text: info.texts[0] || 'Alert message' };
    },
    import: "import { Alert } from '@do/walrus'",
  },
  {
    name: 'Checkbox',
    match: (info) => info.name?.toLowerCase().includes('checkbox'),
    mapProps: (info) => ({ label: info.texts[0] || 'Checkbox' }),
    import: "import { Checkbox } from '@do/walrus'",
  },
  {
    name: 'Switch',
    match: (info) => info.name?.toLowerCase().includes('switch') || info.name?.toLowerCase().includes('toggle'),
    mapProps: (info) => ({ name: 'switch', label: info.texts[0] || 'Toggle' }),
    import: "import { Switch } from '@do/walrus'",
  },
  {
    name: 'TextInput',
    match: (info) => info.name?.toLowerCase().includes('input') || info.name?.toLowerCase().includes('textfield'),
    mapProps: (info) => ({ label: info.texts[0] || 'Input', placeholder: info.texts[1] || '' }),
    import: "import { TextInput } from '@do/walrus'",
  },
  {
    name: 'Card',
    match: (info) => info.name?.toLowerCase().includes('card'),
    mapProps: (info) => ({ _text: info.texts.join(', ') }),
    import: "import { Card, CardHeader, CardContent } from '@do/walrus'",
  },
  {
    name: 'Tooltip',
    match: (info) => info.name?.toLowerCase().includes('tooltip'),
    mapProps: (info) => ({ content: info.texts[0] || 'Tooltip' }),
    import: "import { Tooltip } from '@do/walrus'",
  },
  {
    name: 'Modal',
    match: (info) => info.name?.toLowerCase().includes('modal') || info.name?.toLowerCase().includes('dialog'),
    mapProps: (info) => ({ title: info.texts[0] || 'Modal' }),
    import: "import { Modal } from '@do/walrus'",
  },
  {
    name: 'Tag',
    match: (info) => info.name?.toLowerCase().includes('tag') && !info.name?.toLowerCase().includes('editor'),
    mapProps: (info) => ({ _text: info.texts[0] || 'Tag' }),
    import: "import { Tag } from '@do/walrus'",
  },
  {
    name: 'Accordion',
    match: (info) => info.name?.toLowerCase().includes('accordion'),
    mapProps: (info) => ({ id: 'accordion', _text: info.texts[0] || '' }),
    import: "import { Accordion, AccordionItem } from '@do/walrus'",
  },
  {
    name: 'ProgressBar',
    match: (info) => info.name?.toLowerCase().includes('progress'),
    mapProps: (info) => ({ label: 'Progress', valueNow: 50, valueText: '50%' }),
    import: "import { ProgressBar } from '@do/walrus'",
  },
  {
    name: 'Avatar',
    match: (info) => info.name?.toLowerCase().includes('avatar'),
    mapProps: (info) => ({ src: '', alt: 'User' }),
    import: "import { Avatar } from '@do/walrus'",
  },
  {
    name: 'SelectMenu',
    match: (info) => info.name?.toLowerCase().includes('select') || info.name?.toLowerCase().includes('dropdown'),
    mapProps: (info) => ({ label: info.texts[0] || 'Select' }),
    import: "import { SelectMenu, Option } from '@do/walrus'",
  },
];

function matchWalrus(info) {
  for (const heuristic of WALRUS_HEURISTICS) {
    if (heuristic.match(info)) {
      return {
        component: heuristic.name,
        props: heuristic.mapProps(info),
        import: heuristic.import,
        status: 'Existing',
      };
    }
  }
  return null;
}

// --- Output ---

function printSummary(info, match, fileKey, nodeId) {
  console.log(`\n${BOLD}${CYAN}Figma Node Summary${RESET}`);
  console.log(`${DIM}──────────────────────────────────────${RESET}`);
  console.log(`${BOLD}Name:${RESET}        ${info.name}`);
  console.log(`${BOLD}Type:${RESET}        ${info.type}`);
  console.log(`${BOLD}Size:${RESET}        ${info.width} x ${info.height}`);
  console.log(`${BOLD}File:${RESET}        ${fileKey}`);
  console.log(`${BOLD}Node:${RESET}        ${nodeId}`);

  if (Object.keys(info.componentProperties).length) {
    console.log(`${BOLD}Variants:${RESET}`);
    for (const [k, v] of Object.entries(info.componentProperties)) {
      console.log(`  ${k}: ${v}`);
    }
  }

  if (info.fills.length) {
    console.log(`${BOLD}Fills:${RESET}       ${info.fills.join(', ')}`);
  }
  if (info.texts.length) {
    console.log(`${BOLD}Text:${RESET}        "${info.texts.join('", "')}"`);
  }
  if (info.typography.length) {
    const t = info.typography[0];
    console.log(`${BOLD}Font:${RESET}        ${t.fontFamily} ${t.fontSize}px / weight ${t.fontWeight}`);
  }
  if (info.padding) {
    const p = info.padding;
    console.log(`${BOLD}Padding:${RESET}     ${p.top}/${p.right}/${p.bottom}/${p.left}`);
  }
  if (info.cornerRadius) {
    console.log(`${BOLD}Radius:${RESET}      ${info.cornerRadius}px`);
  }

  console.log(`\n${BOLD}${match ? GREEN : YELLOW}Walrus Match${RESET}`);
  console.log(`${DIM}──────────────────────────────────────${RESET}`);

  if (match) {
    console.log(`${GREEN}${BOLD}Component:${RESET}   ${match.component} (${match.status})`);
    console.log(`${GREEN}${BOLD}Import:${RESET}      ${match.import}`);
    console.log(`${GREEN}${BOLD}Props:${RESET}`);
    for (const [k, v] of Object.entries(match.props)) {
      if (!k.startsWith('_')) {
        console.log(`  ${k}: ${JSON.stringify(v)}`);
      }
    }
    if (match.props._text) {
      console.log(`${GREEN}${BOLD}Text:${RESET}        "${match.props._text}"`);
    }
    if (match.props._useSpinnerButton) {
      console.log(`${YELLOW}${BOLD}Note:${RESET}        Use SpinnerButton with isLoading prop for loading state`);
    }

    // Generate JSX
    const jsxProps = Object.entries(match.props)
      .filter(([k]) => !k.startsWith('_'))
      .map(([k, v]) => v === true ? k : `${k}="${v}"`)
      .join(' ');
    const text = match.props._text || '';
    const tag = match.props._useSpinnerButton ? 'SpinnerButton' : match.component;
    const jsx = text
      ? `<${tag} ${jsxProps}>${text}</${tag}>`
      : `<${tag} ${jsxProps} />`;
    console.log(`\n${BOLD}JSX:${RESET}         ${CYAN}${jsx}${RESET}`);
  } else {
    console.log(`${YELLOW}No Walrus match found.${RESET}`);
    console.log(`${YELLOW}This is a${RESET} ${BOLD}New${RESET} ${YELLOW}component — will need custom implementation.${RESET}`);
    console.log(`\n${BOLD}Visual Spec:${RESET}`);
    if (info.fills.length) console.log(`  Background: ${info.fills[0]}`);
    if (info.typography.length) {
      const t = info.typography[0];
      console.log(`  Font: ${t.fontFamily}, ${t.fontSize}px, weight ${t.fontWeight}, color ${t.fill}`);
    }
    if (info.padding) {
      const p = info.padding;
      console.log(`  Padding: ${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`);
    }
    if (info.cornerRadius) console.log(`  Border radius: ${info.cornerRadius}px`);
  }

  console.log('');
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.log('Usage: node scripts/fetch-figma.js <figma-url> [file-key]');
    process.exit(1);
  }

  const token = getToken();
  const { fileKey, nodeId } = parseInput(args[0], args[1]);

  console.log(`${DIM}Fetching node ${nodeId} from file ${fileKey}...${RESET}`);

  const data = await fetchNode(token, fileKey, nodeId);
  const nodeData = data.nodes?.[nodeId]?.document;

  if (!nodeData) {
    console.error('Node not found in Figma response.');
    process.exit(1);
  }

  const info = extractInfo(nodeData);
  const match = matchWalrus(info);
  printSummary(info, match, fileKey, nodeId);
}

main();
