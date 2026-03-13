import React from 'react';
import styled from 'styled-components';
import { style, TabbedContent, Tab, TabList, TabPanel, TabPanels } from '@do/walrus';
import { withDevMode } from '../../../dev-mode/DevModeProvider';

// ============================================================
// Production code — everything above the withDevMode line
// is clean, self-contained, and works in any React 16 +
// styled-components 5 environment.
// ============================================================

const Wrapper = styled.div`
  background: ${style.colors.white};
`;

interface WalrusTabsProps {
  tabs: string[];
  defaultIndex?: number;
  children?: React.ReactNode;
}

function WalrusTabsBase({ tabs, defaultIndex = 0, children }: WalrusTabsProps) {
  const panels = React.Children.toArray(children);

  return (
    <Wrapper>
      <TabbedContent defaultIndex={defaultIndex}>
        <TabList>
          {tabs.map((label) => (
            <Tab key={label}>{label}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabs.map((label, i) => (
            <TabPanel key={label}>
              {panels[i] || null}
            </TabPanel>
          ))}
        </TabPanels>
      </TabbedContent>
    </Wrapper>
  );
}

// ============================================================
// Dev-only: withDevMode wrapper (stripped when copying source)
// ============================================================

export const WalrusTabs = withDevMode(WalrusTabsBase, {
  name: 'WalrusTabs',
  status: 'existing',
  location: 'src/handoff/new/WalrusTabs.tsx',
  purpose: 'Horizontal tab navigation bar using Walrus TabbedContent — Selected, Unselected, Hover, and Active states handled by the design system',
  walrusComponent: 'TabbedContent',
  storybookUrl: 'https://walrus.internal.digitalocean.com/?path=/docs/tabbedcontent',
});

export type { WalrusTabsProps };
