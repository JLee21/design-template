import React, { useState, useEffect, useCallback } from 'react';
import { useDevMode } from './DevModeProvider';
import type { ComponentMetadata } from './DevModeProvider';
import { lookupWalrusComponent, type WalrusCatalogEntry } from './walrus-catalog';

type InspectedInfo =
  | { kind: 'registered'; metadata: ComponentMetadata; element: HTMLElement | null; props?: Record<string, unknown> }
  | { kind: 'walrus'; catalog: WalrusCatalogEntry; element: HTMLElement; detectedProps: Record<string, string> }
  | { kind: 'raw'; element: HTMLElement; styles: Record<string, string> };

export function DevInspector() {
  const { isEnabled, toggleDevMode, selectedComponent } = useDevMode();
  const [inspected, setInspected] = useState<InspectedInfo | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // When a withDevMode component is clicked, show it
  useEffect(() => {
    if (selectedComponent) {
      setInspected({
        kind: 'registered',
        metadata: selectedComponent.metadata,
        element: selectedComponent.element,
      });
    }
  }, [selectedComponent]);

  // Handle raw element inspection
  useEffect(() => {
    if (!isEnabled) {
      setInspected(null);
      setHoveredElement(null);
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-dev-mode-ui]')) return;
      if (target.closest('[data-devmode-ignore]') || target.hasAttribute('data-devmode-ignore')) return;

      // Snap to nearest component boundary instead of highlighting raw inner elements
      const registered = target.closest('[data-devmode-id]') as HTMLElement;
      if (registered) {
        setHoveredElement(registered);
        return;
      }

      const walrusRoot = findNearestWalrusRoot(target);
      setHoveredElement(walrusRoot || target);
    };

    const handleMouseOut = () => {
      setHoveredElement(null);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-dev-mode-ui]')) return;

      // Skip styleguide scaffolding (labels, headings, import badges)
      if (target.closest('[data-devmode-ignore]') || target.hasAttribute('data-devmode-ignore')) return;

      // Don't handle if a withDevMode component will handle it
      const devModeWrapper = target.closest('[data-devmode-id]');
      if (devModeWrapper) return;

      e.preventDefault();
      e.stopPropagation();

      // Try to identify as a Walrus component (snaps to component root element)
      const walrusInfo = identifyWalrusComponent(target);
      if (walrusInfo) {
        setInspected({
          kind: 'walrus',
          catalog: walrusInfo.catalog,
          element: walrusInfo.rootElement,
          detectedProps: walrusInfo.detectedProps,
        });
        return;
      }

      // Fall back to raw element inspection
      const computedStyles = window.getComputedStyle(target);
      const relevantStyles: Record<string, string> = {};
      const propsToCapture = [
        'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
        'width', 'height', 'padding', 'margin',
        'background', 'background-color',
        'color', 'font-size', 'font-weight', 'font-family',
        'border', 'border-radius',
        'box-shadow', 'opacity',
        'position', 'top', 'right', 'bottom', 'left',
      ];
      propsToCapture.forEach(prop => {
        const value = computedStyles.getPropertyValue(prop);
        if (value && value !== 'none' && value !== 'normal' && value !== '0px' && value !== 'auto') {
          relevantStyles[prop] = value;
        }
      });

      setInspected({ kind: 'raw', element: target, styles: relevantStyles });
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isEnabled]);

  // Push page content down when Dev Mode banner is shown
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    if (isEnabled) {
      root.style.paddingTop = '40px';
    } else {
      root.style.paddingTop = '';
    }
    return () => { root.style.paddingTop = ''; };
  }, [isEnabled]);

  const copyToClipboard = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }, []);

  // Highlight overlay
  const overlayStyle: React.CSSProperties | null =
    hoveredElement && isEnabled
      ? {
          position: 'fixed',
          top: hoveredElement.getBoundingClientRect().top,
          left: hoveredElement.getBoundingClientRect().left,
          width: hoveredElement.getBoundingClientRect().width,
          height: hoveredElement.getBoundingClientRect().height,
          border: '2px solid #0069ff',
          backgroundColor: 'rgba(0, 105, 255, 0.1)',
          pointerEvents: 'none',
          zIndex: 9997,
        }
      : null;

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-15px); }
        }
        @keyframes iconGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(10, 166, 83, 0.8)) drop-shadow(0 0 8px rgba(10, 166, 83, 0.5)) drop-shadow(0 0 12px rgba(10, 166, 83, 0.3)); }
          50% { filter: drop-shadow(0 0 6px rgba(10, 166, 83, 1)) drop-shadow(0 0 12px rgba(10, 166, 83, 0.7)) drop-shadow(0 0 20px rgba(10, 166, 83, 0.4)); }
        }
      `}</style>

      {/* Dev Mode Banner */}
      {isEnabled && (
        <div
          data-dev-mode-ui="true"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '40px',
            background: '#07743A', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px', fontSize: '13px', fontWeight: 500,
            zIndex: 10000, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            animation: 'slideDown 0.3s ease-out forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            <span>Dev Mode Active — Click any element to inspect</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ opacity: 0.8, fontSize: '12px' }}>
              <Kbd>⌘</Kbd> + <Kbd>⇧</Kbd> + <Kbd>D</Kbd> to exit
            </span>
            <button
              onClick={toggleDevMode}
              style={{
                background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: 'white',
                padding: '4px 12px', borderRadius: '4px', cursor: 'pointer',
                fontSize: '12px', fontWeight: 500,
              }}
            >
              Exit Dev Mode
            </button>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      {overlayStyle && <div style={overlayStyle} />}

      {/* Inspector Panel + Toggle */}
      <div
        data-dev-mode-ui="true"
        style={{
          position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
        }}
      >
        {/* Enhanced Inspection Panel */}
        {isEnabled && inspected && (
          inspected.kind === 'registered' ? (
            <RegisteredComponentPanel
              metadata={inspected.metadata}
              props={inspected.props}
              onCopy={copyToClipboard}
              copiedKey={copiedKey}
              onClose={() => setInspected(null)}
            />
          ) : inspected.kind === 'walrus' ? (
            <WalrusComponentPanel
              catalog={inspected.catalog}
              detectedProps={inspected.detectedProps}
              element={inspected.element}
              onCopy={copyToClipboard}
              copiedKey={copiedKey}
              onClose={() => setInspected(null)}
            />
          ) : (
            <RawElementPanel
              element={inspected.element}
              styles={inspected.styles}
              onCopy={copyToClipboard}
              copiedKey={copiedKey}
              onClose={() => setInspected(null)}
            />
          )
        )}

        {/* Toggle Buttons */}
        <ToggleButtons isEnabled={isEnabled} toggleDevMode={toggleDevMode} />
      </div>
    </>
  );
}

// ============================================================
// Walrus Component Detection
// ============================================================

/**
 * Get the React fiber node attached to a DOM element.
 * React 16 uses __reactInternalInstance$, React 17+ uses __reactFiber$.
 */
function getReactFiber(element: HTMLElement): any | null {
  const key = Object.keys(element).find(
    k => k.startsWith('__reactInternalInstance$') || k.startsWith('__reactFiber$')
  );
  return key ? (element as any)[key] : null;
}

/**
 * Walk up the React fiber tree from a DOM element to find the nearest
 * Walrus component. Returns the catalog entry and the component's actual
 * React props (not guessed from CSS).
 *
 * Uses two strategies:
 * 1. Named match — walk fiber tree looking for components with displayName/name
 *    matching a catalog entry (works for components that set displayName).
 * 2. DOM heuristic + fiber props — identify the component by DOM structure
 *    (tag name, sc- classes), then extract real props from the nearest
 *    forwardRef/component fiber (works for anonymous forwardRef wrappers
 *    like Walrus Button).
 */
function identifyWalrusComponent(element: HTMLElement): { catalog: WalrusCatalogEntry; detectedProps: Record<string, string>; rootElement: HTMLElement } | null {
  // Strategy 1: Walk fiber tree looking for named catalog matches
  let domNode: HTMLElement | null = element;
  while (domNode) {
    const result = identifyWalrusFromFiber(domNode);
    if (result) return { ...result, rootElement: domNode };
    domNode = domNode.parentElement;
  }

  // Strategy 2: DOM heuristics + fiber prop extraction
  const domResult = identifyWalrusFromDOM(element);
  if (domResult) {
    const styledEl = findStyledAncestor(element);
    return { ...domResult, rootElement: styledEl || element };
  }

  return null;
}

/**
 * Find the nearest DOM element that resolves to a Walrus component.
 * Used by the hover handler to snap highlights to component boundaries.
 */
function findNearestWalrusRoot(element: HTMLElement): HTMLElement | null {
  let domNode: HTMLElement | null = element;
  while (domNode) {
    if (identifyWalrusFromFiber(domNode)) return domNode;
    domNode = domNode.parentElement;
  }
  const styledEl = findStyledAncestor(element);
  if (styledEl && guessWalrusComponentFromDOM(styledEl)) return styledEl;
  return null;
}

/**
 * Strategy 1: Walk fiber tree looking for component names that match the catalog.
 * Works for components that have displayName set (e.g., Tabs, TabList).
 */
function identifyWalrusFromFiber(element: HTMLElement): { catalog: WalrusCatalogEntry; detectedProps: Record<string, string> } | null {
  const fiber = getReactFiber(element);
  if (!fiber) return null;

  let node = fiber;
  const maxDepth = 20;
  let depth = 0;

  while (node && depth < maxDepth) {
    const type = node.type;
    const elementType = node.elementType;

    if (type && typeof type !== 'string') {
      const name =
        type.displayName ||
        type.name ||
        (type.render && (type.render.displayName || type.render.name)) ||
        null;

      if (name) {
        const styledMatch = name.match(/^Styled\((\w+)\)$/);
        const componentName = styledMatch ? styledMatch[1] : name;

        const catalog = lookupWalrusComponent(componentName);
        if (catalog) {
          const rawProps = node.memoizedProps || {};
          const detectedProps = serializeProps(rawProps, catalog);
          return { catalog, detectedProps };
        }
      }
    }

    if (elementType && typeof elementType === 'object' && elementType.render) {
      const renderName = elementType.render.displayName || elementType.render.name;
      if (renderName) {
        const styledMatch = renderName.match(/^Styled\((\w+)\)$/);
        const componentName = styledMatch ? styledMatch[1] : renderName;
        const catalog = lookupWalrusComponent(componentName);
        if (catalog) {
          const rawProps = node.memoizedProps || {};
          const detectedProps = serializeProps(rawProps, catalog);
          return { catalog, detectedProps };
        }
      }
    }

    node = node.return;
    depth++;
  }

  return null;
}

/**
 * Strategy 2: Use DOM structure to identify the Walrus component type,
 * then extract real props from the React fiber tree.
 *
 * This handles components like Button where the forwardRef wrapper
 * has no displayName in the bundled output.
 */
function identifyWalrusFromDOM(element: HTMLElement): { catalog: WalrusCatalogEntry; detectedProps: Record<string, string> } | null {
  // Walk up to find the nearest styled-component element
  const styledEl = findStyledAncestor(element);
  if (!styledEl) return null;

  // Guess which Walrus component this is from the DOM
  const componentName = guessWalrusComponentFromDOM(styledEl);
  if (!componentName) return null;

  const catalog = lookupWalrusComponent(componentName);
  if (!catalog) return null;

  // Now extract real props from the fiber tree.
  // Walk up fibers looking for the nearest forwardRef or function component
  // that has props matching this component type.
  const props = extractComponentProps(styledEl, catalog);
  const detectedProps = props ? serializeProps(props, catalog) : {};

  return { catalog, detectedProps };
}

/**
 * Walk up the DOM to find the nearest element with a styled-component class (sc-*).
 */
function findStyledAncestor(element: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = element;
  while (el) {
    const classList = Array.from(el.classList);
    if (classList.some(c => c.startsWith('sc-'))) return el;
    el = el.parentElement;
  }
  return null;
}

/**
 * Map DOM characteristics to Walrus component names.
 * This is the fallback for when fiber displayName isn't available.
 */
function guessWalrusComponentFromDOM(element: HTMLElement): string | null {
  const tag = element.tagName.toLowerCase();
  const classList = Array.from(element.classList);
  const isStyled = classList.some(c => c.startsWith('sc-'));

  if (!isStyled) return null;

  // Button: <button> or <a> styled-component
  if (tag === 'button') {
    // AccordionItem trigger: has aria-expanded with a sibling region panel
    if (element.getAttribute('aria-expanded') !== null) {
      const nextSibling = element.nextElementSibling;
      const parentHasRegion = element.parentElement?.querySelector('[role="region"]');
      if (nextSibling?.getAttribute('role') === 'region' || parentHasRegion) {
        return 'Accordion';
      }
    }
    return 'Button';
  }

  if (tag === 'a' && isStyled) {
    const style = window.getComputedStyle(element);
    if (style.borderRadius && style.borderRadius !== '0px') {
      return 'Button';
    }
    return null;
  }

  // Input elements
  if (tag === 'input' && isStyled) {
    const type = element.getAttribute('type');
    if (type === 'checkbox') return 'Checkbox';
    return 'TextInput';
  }

  if (tag === 'textarea' && isStyled) return 'TextArea';
  if (tag === 'select' && isStyled) return 'SelectMenu';
  if (tag === 'table' && isStyled) return 'Table';

  // Div-based components
  if (tag === 'div' && isStyled) {
    if (element.getAttribute('role') === 'progressbar') return 'ProgressBar';
    if (element.getAttribute('role') === 'alert') return 'Alert';
    if (element.getAttribute('role') === 'dialog') return 'Modal';
    if (element.getAttribute('role') === 'tablist') return 'TabbedContent';

    // Accordion container: has multiple buttons with aria-expanded
    const expandButtons = element.querySelectorAll('button[aria-expanded]');
    if (expandButtons.length > 0) return 'Accordion';

    // Tooltip: small positioned overlay
    if (element.getAttribute('role') === 'tooltip') return 'Tooltip';
  }

  // Label wrapping a checkbox input = Switch
  if (tag === 'label' && isStyled) {
    if (element.querySelector('input[type="checkbox"]')) return 'Switch';
  }

  return null;
}

/**
 * Extract component props from the React fiber tree.
 * Walks up from the DOM element's fiber looking for the nearest
 * forwardRef or function component fiber that has relevant props.
 */
function extractComponentProps(element: HTMLElement, catalog: WalrusCatalogEntry): Record<string, any> | null {
  const fiber = getReactFiber(element);
  if (!fiber) return null;

  // The catalog tells us which props to look for
  const catalogPropNames = new Set(Object.keys(catalog.props));
  // Always look for children
  catalogPropNames.add('children');

  let node = fiber;
  const maxDepth = 15;
  let depth = 0;

  while (node && depth < maxDepth) {
    const type = node.type;

    // Skip host elements (div, button, span, etc.) — we want component fibers
    if (type && typeof type !== 'string') {
      const props = node.memoizedProps;
      if (props) {
        // Check if this fiber's props contain any of the catalog's known props
        const matchingProps = Object.keys(props).filter(k => catalogPropNames.has(k));
        if (matchingProps.length > 0) {
          return props;
        }
      }
    }

    node = node.return;
    depth++;
  }

  return null;
}

/**
 * Convert React props into display-friendly string values.
 * Filters out functions, refs, internal React props, and objects.
 */
function serializeProps(rawProps: Record<string, any>, catalog: WalrusCatalogEntry): Record<string, string> {
  const detectedProps: Record<string, string> = {};
  const skipKeys = new Set(['key', 'ref', '__self', '__source', 'theme', 'forwardedComponent', 'forwardedRef', 'as', 'className', 'style']);

  for (const [key, value] of Object.entries(rawProps)) {
    if (skipKeys.has(key)) continue;
    if (typeof value === 'function') continue;
    if (value === undefined || value === null) continue;
    if (value === false) continue;

    if (key === 'children') {
      // Only include text children, not React elements
      if (typeof value === 'string') {
        detectedProps[key] = value;
      } else if (typeof value === 'number') {
        detectedProps[key] = String(value);
      }
      // Skip React element children — we'll grab textContent as fallback
      continue;
    }

    if (typeof value === 'string') {
      detectedProps[key] = value;
    } else if (typeof value === 'number') {
      detectedProps[key] = String(value);
    } else if (value === true) {
      detectedProps[key] = 'true';
    }
    // Skip objects, arrays, React elements — they can't be meaningfully serialized to a snippet
  }

  return detectedProps;
}

// ============================================================
// Panel: Registered Component (withDevMode wrapped)
// ============================================================

/**
 * Strip the withDevMode wrapper and its import from source code,
 * producing a clean production-ready component.
 */
function stripDevModeWrapper(source: string, componentName: string): string {
  let cleaned = source;

  // Remove the withDevMode import line
  cleaned = cleaned.replace(/import\s*\{[^}]*withDevMode[^}]*\}\s*from\s*['"][^'"]+['"];\s*\n?/g, '');

  // Remove the `export const X = withDevMode(XBase, { ... });` at the bottom
  // This handles multiline withDevMode calls
  const wrapperRegex = new RegExp(
    `export\\s+const\\s+${componentName}\\s*=\\s*withDevMode\\s*\\([\\s\\S]*?\\);\\s*\\n?`,
    'g'
  );
  cleaned = cleaned.replace(wrapperRegex, '');

  // Rename XBase to X in function declaration and export
  const baseNameRegex = new RegExp(`\\b${componentName}Base\\b`, 'g');
  cleaned = cleaned.replace(baseNameRegex, componentName);

  // Ensure the component function is exported
  cleaned = cleaned.replace(
    new RegExp(`(^|\\n)(function\\s+${componentName})`),
    '$1export $2'
  );

  // Clean up trailing whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim() + '\n';

  return cleaned;
}

function RegisteredComponentPanel({
  metadata,
  props: componentProps,
  onCopy,
  copiedKey,
  onClose,
}: {
  metadata: ComponentMetadata;
  props?: Record<string, unknown>;
  onCopy: (text: string, key: string) => void;
  copiedKey: string | null;
  onClose: () => void;
}) {
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const statusLabels: Record<string, { label: string; color: string }> = {
    new: { label: 'New', color: '#3b82f6' },
    modified: { label: 'Modified', color: '#f59e0b' },
    existing: { label: 'Walrus', color: '#10b981' },
    'one-off': { label: 'One-off', color: '#8b5cf6' },
  };

  const status = statusLabels[metadata.status] || statusLabels['new'];

  // Build usage JSX from known props
  const propsEntries = componentProps
    ? Object.entries(componentProps).filter(([, v]) => v !== undefined && v !== null)
    : [];
  const propsString = propsEntries
    .filter(([key]) => key !== 'children')
    .map(([key, value]) => {
      if (value === true) return key;
      if (typeof value === 'string') return `${key}="${value}"`;
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(' ');

  const children = componentProps?.children as string | undefined;
  const hasChildren = children && typeof children === 'string';
  const usage = hasChildren
    ? `<${metadata.name}${propsString ? ' ' + propsString : ''}>\n  ${children}\n</${metadata.name}>`
    : `<${metadata.name}${propsString ? ' ' + propsString : ''} />`;

  // Fetch source code on demand
  const fetchSource = useCallback(async () => {
    if (sourceCode) {
      setShowSource(!showSource);
      return;
    }
    setSourceLoading(true);
    try {
      const response = await fetch(`/${metadata.location}`);
      if (response.ok) {
        const text = await response.text();
        // The response from Vite may be a JS module — extract the original source
        // For dev mode, try fetching the raw file
        const rawResponse = await fetch(`/${metadata.location}?raw`);
        const rawText = rawResponse.ok ? await rawResponse.text() : text;
        const cleaned = stripDevModeWrapper(rawText, metadata.name);
        setSourceCode(cleaned);
        setShowSource(true);
      }
    } catch {
      setSourceCode('// Unable to load source file');
      setShowSource(true);
    } finally {
      setSourceLoading(false);
    }
  }, [metadata.location, metadata.name, sourceCode, showSource]);

  return (
    <PanelContainer onClose={onClose}>
      <PanelHeader
        name={metadata.name}
        badge={status.label}
        badgeColor={status.color}
        onClose={onClose}
      />

      {/* Purpose */}
      <PanelSection>
        {metadata.purpose && (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
            {metadata.purpose}
          </p>
        )}
      </PanelSection>

      {/* Usage */}
      <PanelSection>
        <SectionHeader label="USAGE" />
        <CodeBlock text={usage} onCopy={() => onCopy(usage, 'usage')} copied={copiedKey === 'usage'} />
      </PanelSection>

      {/* Current Props */}
      {propsEntries.length > 0 && (
        <PanelSection>
          <SectionHeader label="CURRENT PROPS" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {propsEntries.map(([key, value]) => (
              <PropRow key={key} name={key} value={String(value)} />
            ))}
          </div>
        </PanelSection>
      )}

      {/* Source — loads on demand */}
      <PanelSection noBorder>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={fetchSource}
            style={{
              background: 'none', border: 'none', color: '#3b82f6',
              fontSize: '12px', cursor: 'pointer', padding: 0,
            }}
          >
            {sourceLoading ? 'Loading...' : showSource ? 'Hide source' : 'View source'}
          </button>
          {showSource && sourceCode && (
            <button
              onClick={() => onCopy(sourceCode, 'source')}
              style={{
                padding: '4px 10px', background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '4px',
                color: '#3b82f6', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {copiedKey === 'source' ? '✓ Copied' : 'Copy source'}
            </button>
          )}
        </div>
        {showSource && sourceCode && (
          <div style={{ marginTop: '8px' }}>
            <CodeBlock
              text={sourceCode}
              onCopy={() => onCopy(sourceCode, 'source')}
              copied={copiedKey === 'source'}
            />
          </div>
        )}
      </PanelSection>

      {/* Interactions */}
      {metadata.interactions && metadata.interactions.length > 0 && (
        <PanelSection>
          <SectionHeader label="INTERACTIONS" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {metadata.interactions.map((interaction, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#3b82f6', fontSize: '10px' }}>●</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{interaction}</span>
              </div>
            ))}
          </div>
        </PanelSection>
      )}

      {/* Based on Walrus */}
      {metadata.walrusComponent && (
        <PanelSection noBorder>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Based on Walrus: </span>
          <span style={{ color: '#10b981', fontSize: '12px' }}>{metadata.walrusComponent}</span>
        </PanelSection>
      )}
    </PanelContainer>
  );
}

// ============================================================
// Panel: Walrus Component (auto-detected)
// ============================================================

function WalrusComponentPanel({
  catalog,
  detectedProps,
  element,
  onCopy,
  copiedKey,
  onClose,
}: {
  catalog: WalrusCatalogEntry;
  detectedProps: Record<string, string>;
  element: HTMLElement;
  onCopy: (text: string, key: string) => void;
  copiedKey: string | null;
  onClose: () => void;
}) {
  const [showAllProps, setShowAllProps] = useState(false);

  // Build usage JSX from detected props
  const propsString = Object.entries(detectedProps)
    .filter(([key]) => key !== 'children')
    .map(([key, value]) => {
      if (value === 'true') return key;
      return `${key}="${value}"`;
    })
    .join(' ');

  // Use detected children prop, fall back to DOM textContent
  const children = detectedProps['children'] || element.textContent?.trim() || '...';
  const hasChildren = children !== '...';
  const usage = hasChildren
    ? `<${catalog.name}${propsString ? ' ' + propsString : ''}>\n  ${children}\n</${catalog.name}>`
    : `<${catalog.name}${propsString ? ' ' + propsString : ''} />`;
  const fullSnippet = `${catalog.import}\n\n${usage}`;

  return (
    <PanelContainer onClose={onClose}>
      <PanelHeader name={catalog.name} badge="Walrus" badgeColor="#10b981" onClose={onClose} />

      <PanelSection>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
          {catalog.description}
        </p>
        <p style={{ color: 'rgba(16, 185, 129, 0.7)', fontSize: '11px', margin: '6px 0 0', lineHeight: 1.4 }}>
          Already in your codebase — just import it.
        </p>
      </PanelSection>

      {/* Combined CODE section: import + usage */}
      <PanelSection>
        <SectionHeader label="CODE" />
        <CodeBlock text={fullSnippet} onCopy={() => onCopy(fullSnippet, 'code')} copied={copiedKey === 'code'} />
        <button
          onClick={() => onCopy(fullSnippet, 'code')}
          style={{
            width: '100%', marginTop: '8px', padding: '8px 12px',
            background: copiedKey === 'code' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${copiedKey === 'code' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '6px', color: '#10b981',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {copiedKey === 'code' ? '✓ Copied to clipboard' : 'Copy code'}
        </button>
      </PanelSection>

      {/* Current Props */}
      {Object.keys(detectedProps).length > 0 && (
        <PanelSection>
          <SectionHeader label="CURRENT PROPS" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(detectedProps).map(([key, value]) => (
              <PropRow key={key} name={key} value={value} />
            ))}
          </div>
        </PanelSection>
      )}

      {/* Variations */}
      {catalog.variations && catalog.variations.length > 0 && (
        <PanelSection>
          <SectionHeader label="VARIATIONS" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {catalog.variations.map(v => (
              <span
                key={v}
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  background: v === detectedProps['variation']
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(255,255,255,0.05)',
                  color: v === detectedProps['variation']
                    ? '#10b981'
                    : 'rgba(255,255,255,0.5)',
                  border: v === detectedProps['variation']
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </PanelSection>
      )}

      {/* All Props */}
      <PanelSection noBorder>
        <button
          onClick={() => setShowAllProps(!showAllProps)}
          style={{
            background: 'none', border: 'none', color: '#3b82f6',
            fontSize: '12px', cursor: 'pointer', padding: 0,
          }}
        >
          {showAllProps ? 'Hide' : 'Show'} all props ({Object.keys(catalog.props).length})
        </button>
        {showAllProps && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
            {Object.entries(catalog.props).map(([name, info]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#ff79c6', fontSize: '11px', fontFamily: 'monospace' }}>{name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: 'monospace' }}>{info.type}</span>
                </div>
                {info.description && (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{info.description}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </PanelSection>

      {catalog.storybookUrl && (
        <PanelSection noBorder>
          <a
            href={catalog.storybookUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#3b82f6', fontSize: '12px', textDecoration: 'none' }}
          >
            View in Storybook →
          </a>
        </PanelSection>
      )}
    </PanelContainer>
  );
}

// ============================================================
// Panel: Raw Element (fallback)
// ============================================================

function RawElementPanel({
  element,
  styles,
  onCopy,
  copiedKey,
  onClose,
}: {
  element: HTMLElement;
  styles: Record<string, string>;
  onCopy: (text: string, key: string) => void;
  copiedKey: string | null;
  onClose: () => void;
}) {
  const displayName =
    element.id ? `#${element.id}` :
    element.classList.length > 0 ? `.${Array.from(element.classList).join('.')}` :
    `<${element.tagName.toLowerCase()}>`;

  const outerHTML = element.outerHTML.slice(0, 200) + (element.outerHTML.length > 200 ? '...' : '');

  return (
    <PanelContainer onClose={onClose}>
      <PanelHeader name={displayName} badge="Element" badgeColor="#6b7280" onClose={onClose} />

      <PanelSection>
        <SectionHeader label="ELEMENT" />
        <CodeBlock text={outerHTML} onCopy={() => onCopy(element.outerHTML, 'html')} copied={copiedKey === 'html'} />
      </PanelSection>

      <PanelSection noBorder>
        <SectionHeader label="COMPUTED STYLES" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Object.entries(styles).map(([prop, value]) => (
            <div
              key={prop}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '4px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px',
              }}
            >
              <span style={{ color: '#ff79c6', fontSize: '11px', fontFamily: 'monospace', minWidth: '120px' }}>{prop}:</span>
              <span style={{ color: '#f1fa8c', fontSize: '11px', fontFamily: 'monospace', flex: 1 }}>{value}</span>
              <CopyButton onClick={() => onCopy(`${prop}: ${value};`, prop)} copied={copiedKey === prop} />
            </div>
          ))}
          {Object.keys(styles).length === 0 && (
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>No significant styles found</span>
          )}
        </div>
      </PanelSection>
    </PanelContainer>
  );
}

// ============================================================
// Shared UI Components
// ============================================================

function PanelContainer({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        width: '340px',
        maxHeight: '480px',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {children}
    </div>
  );
}

function PanelHeader({ name, badge, badgeColor, onClose }: { name: string; badge: string; badgeColor: string; onClose: () => void }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'white', fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{name}</span>
        <span style={{
          fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px',
          background: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}44`,
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          {badge}
        </span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.5)',
          cursor: 'pointer', fontSize: '18px', padding: '0', lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

function PanelSection({ children, noBorder }: { children: React.ReactNode; noBorder?: boolean }) {
  return (
    <div style={{ padding: '12px 16px', borderBottom: noBorder ? 'none' : '1px solid rgba(255, 255, 255, 0.06)' }}>
      {children}
    </div>
  );
}

function SectionHeader({ label, copyLabel, onCopyAll, copiedAll }: { label: string; copyLabel?: string; onCopyAll?: () => void; copiedAll?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
        {label}
      </span>
      {onCopyAll && (
        <button
          onClick={onCopyAll}
          style={{ background: 'none', border: 'none', color: copiedAll ? '#50fa7b' : 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '10px', padding: 0 }}
        >
          {copiedAll ? '✓ Copied' : copyLabel || 'Copy'}
        </button>
      )}
    </div>
  );
}

function CodeBlock({ text, onCopy, copied, mono }: { text: string; onCopy: () => void; copied: boolean; mono?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <code
        style={{
          display: 'block',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '8px 32px 8px 8px',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#8be9fd',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          lineHeight: 1.5,
        }}
      >
        {text}
      </code>
      <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
        <CopyButton onClick={onCopy} copied={copied} />
      </div>
    </div>
  );
}

function PropRow({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
      <span style={{ color: '#ff79c6', fontSize: '11px', fontFamily: 'monospace', minWidth: '80px' }}>{name}</span>
      <span style={{ color: '#f1fa8c', fontSize: '11px', fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}

function CopyButton({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}
    >
      {copied ? (
        <span style={{ color: '#50fa7b', fontSize: '14px', animation: 'floatUp 1s ease-out forwards' }}>✓</span>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.4)">
          <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
        </svg>
      )}
    </button>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{
      background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px',
      fontFamily: 'system-ui', fontSize: '11px',
    }}>
      {children}
    </kbd>
  );
}

// ============================================================
// Toggle Buttons
// ============================================================

function NavPanel({ onClose }: { onClose: () => void }) {
  const pages = [
    { path: '/', label: 'Home', desc: 'Figma: node 189-1755', icon: '◇' },
    { path: '/instructions', label: 'Instructions', desc: 'Setup guide and README', icon: '○' },
  ];

  const currentPath = window.location.pathname;

  return (
    <PanelContainer onClose={onClose}>
      <PanelHeader name="Pages" badge="Nav" badgeColor="#0AA653" onClose={onClose} />
      <PanelSection noBorder>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {pages.map((page) => {
            const isActive = currentPath === page.path;
            return (
              <a
                key={page.path}
                href={page.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '6px', textDecoration: 'none',
                  background: isActive ? 'rgba(10, 166, 83, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid rgba(10, 166, 83, 0.25)' : '1px solid transparent',
                  transition: 'background 0.15s ease',
                  cursor: isActive ? 'default' : 'pointer',
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)'; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)'; }}
              >
                <span style={{
                  width: '28px', height: '28px', borderRadius: '6px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0,
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.4)',
                }}>
                  {page.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#0AA653' : 'rgba(255, 255, 255, 0.85)',
                    lineHeight: 1.3,
                  }}>
                    {page.label}
                  </div>
                  <div style={{
                    fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', lineHeight: 1.3, marginTop: '1px',
                  }}>
                    {page.desc}
                  </div>
                </div>
                {isActive && (
                  <span style={{ fontSize: '10px', color: '#0AA653', flexShrink: 0 }}>●</span>
                )}
              </a>
            );
          })}
        </div>
      </PanelSection>
      <PanelSection noBorder>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '10px' }}>Dev Mode:</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '10px' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: '3px', fontFamily: 'system-ui', fontSize: '10px' }}>⌘</span>
            {' + '}
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: '3px', fontFamily: 'system-ui', fontSize: '10px' }}>⇧</span>
            {' + '}
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: '3px', fontFamily: 'system-ui', fontSize: '10px' }}>D</span>
          </span>
        </div>
      </PanelSection>
    </PanelContainer>
  );
}

function ToggleButtons({ isEnabled, toggleDevMode }: { isEnabled: boolean; toggleDevMode: () => void }) {
  const [showNav, setShowNav] = useState(() => sessionStorage.getItem('design-to-code-nav-open') === '1');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleNav = useCallback((open: boolean) => {
    setShowNav(open);
    if (open) {
      sessionStorage.setItem('design-to-code-nav-open', '1');
    } else {
      sessionStorage.removeItem('design-to-code-nav-open');
    }
  }, []);

  useEffect(() => {
    if (!showNav) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        toggleNav(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNav, toggleNav]);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
      {/* Nav Panel */}
      {showNav && <NavPanel onClose={() => toggleNav(false)} />}

      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        {/* Help / Nav */}
        <div style={{
          background: showNav ? 'rgba(10, 166, 83, 0.30)' : '#1a1a1a',
          border: showNav ? '1px solid rgba(10, 166, 83, 0.45)' : '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center',
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}>
          <button
            onClick={() => toggleNav(!showNav)}
            style={{
              background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px',
            }}
            title="Pages"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0AA653" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>

        <div
          style={{
            background: '#1a1a1a', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '8px', padding: '4px', display: 'flex', gap: '2px',
            alignItems: 'center', position: 'relative',
          }}
        >
          {/* Sliding indicator */}
          <div style={{
            position: 'absolute', top: '4px',
            left: isEnabled ? 'calc(4px + 32px + 2px)' : '4px',
            width: '32px', height: '32px',
            background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '6px', transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
          }} />

          {/* Preview Mode */}
          <button
            onClick={() => isEnabled && toggleDevMode()}
            style={{
              background: 'transparent', border: 'none', borderRadius: '6px', padding: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1, width: '32px', height: '32px',
            }}
            title="Preview Mode"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={!isEnabled ? '#0AA653' : 'rgba(255, 255, 255, 0.4)'}
              strokeWidth="1.5" style={{ transition: 'stroke 0.2s ease' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </button>

          {/* Dev Mode */}
          <button
            onClick={() => !isEnabled && toggleDevMode()}
            style={{
              background: 'transparent', border: 'none', borderRadius: '6px', padding: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1, width: '32px', height: '32px',
            }}
            title="Dev Mode (Cmd+Shift+D)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={isEnabled ? '#0AA653' : 'rgba(255, 255, 255, 0.4)'}
              strokeWidth="1.5"
              style={{
                transition: 'stroke 0.2s ease, filter 0.2s ease',
                filter: isEnabled ? 'drop-shadow(0 0 4px rgba(10, 166, 83, 0.8)) drop-shadow(0 0 8px rgba(10, 166, 83, 0.5)) drop-shadow(0 0 12px rgba(10, 166, 83, 0.3))' : 'none',
                animation: isEnabled ? 'iconGlow 2s ease-in-out infinite' : 'none',
              }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
