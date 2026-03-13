import React from 'react';
import styled from 'styled-components';

class ErrorBoundary extends React.Component<
  { name: string; children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorBox>
          <strong>{this.props.name}</strong>: {this.state.error}
        </ErrorBox>
      );
    }
    return this.props.children;
  }
}

const Page = styled.div`
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 32px;
`;

const Section = styled.div`
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const SectionHeader = styled.div<{ $status: 'works' | 'partial' | 'broken' | 'pending' }>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(p) =>
    p.$status === 'works' ? '#f0fdf4' :
    p.$status === 'partial' ? '#fffbeb' :
    p.$status === 'broken' ? '#fef2f2' :
    '#f9fafb'};
  border-bottom: 1px solid #e5e7eb;
`;

const ComponentName = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  background: ${(p) =>
    p.$status === 'works' ? '#dcfce7' :
    p.$status === 'partial' ? '#fef3c7' :
    p.$status === 'broken' ? '#fee2e2' :
    '#f3f4f6'};
  color: ${(p) =>
    p.$status === 'works' ? '#166534' :
    p.$status === 'partial' ? '#92400e' :
    p.$status === 'broken' ? '#991b1b' :
    '#374151'};
`;

const SectionBody = styled.div`
  padding: 16px;
  background: white;
`;

const ErrorBox = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
`;

const Note = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 8px 0 0;
  font-style: italic;
`;

import {
  Accordion, AccordionItem,
  ActionItem,
  Alert,
  Avatar,
  Badge,
  Button,
  Card, CardContent, CardFooterRow, CardHeader,
  ClickToCopy,
  Code,
  CollapsibleContent,
  Divider,
  DropdownArrow,
  DropdownMenu,
  FlexboxGrid,
  HighFive,
  InlineButton,
  Link,
  LoadingState,
  Modal,
  NotificationsBadge,
  ProgressBar,
  SpinnerButton,
  style,
  Switch,
  Tab, TabbedContent,
  TabList, TabPanel, TabPanels,
  Tag,
  Text,
  Tooltip,
  TruncateText,
  UnstyledButton,
  VisuallyHidden
} from '@do/walrus';

function ComponentTest({ name, children, status = 'pending', note }: {
  name: string;
  children: React.ReactNode;
  status?: 'works' | 'partial' | 'broken' | 'pending';
  note?: string;
}) {
  return (
    <Section>
      <SectionHeader $status={status}>
        <ComponentName>{name}</ComponentName>
        <StatusBadge $status={status}>{status}</StatusBadge>
      </SectionHeader>
      <SectionBody>
        <ErrorBoundary name={name}>
          {children}
        </ErrorBoundary>
        {note && <Note>{note}</Note>}
      </SectionBody>
    </Section>
  );
}

export default function Audit() {
  const [switchVal, setSwitchVal] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  return (
    <Page>
      <Title>Walrus Component Audit</Title>
      <Subtitle>Testing @do/walrus v83.1.5 exports</Subtitle>

      <h2>Buttons &amp; Actions</h2>

      <ComponentTest name="Button" status="works">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variation="primary">Primary</Button>
          <Button variation="secondary">Secondary</Button>
          <Button variation="tertiary">Tertiary</Button>
          <Button variation="success">Success</Button>
          <Button variation="danger">Danger</Button>
          <Button variation="danger-secondary">Danger Secondary</Button>
          <Button variation="primary" compact>Compact</Button>
          <Button variation="primary" disabled>Disabled</Button>
          <Button variation="primary" fullWidth>Full Width</Button>
        </div>
      </ComponentTest>

      <ComponentTest name="SpinnerButton" status="works">
        <SpinnerButton variation="primary">Submit</SpinnerButton>
      </ComponentTest>

      <ComponentTest name="InlineButton" status="works">
        <InlineButton onClick={() => {}}>Inline Button</InlineButton>
      </ComponentTest>

      <ComponentTest name="UnstyledButton" status="works">
        <UnstyledButton onClick={() => {}}>Unstyled Button</UnstyledButton>
      </ComponentTest>

      <h2>Form Controls</h2>

      <ComponentTest name="Switch" status="works">
        <Switch
          name="audit-switch"
          label="Toggle me"
          checked={switchVal}
          onChange={() => setSwitchVal(!switchVal)}
        />
      </ComponentTest>

      <h2>Layout</h2>

      <ComponentTest name="Card" status="works">
        <Card>
          <CardHeader>Card Header</CardHeader>
          <CardContent>Card content goes here</CardContent>
          <CardFooterRow>
            <Button variation="primary" compact>Action</Button>
          </CardFooterRow>
        </Card>
      </ComponentTest>

      <ComponentTest name="Accordion" status="works">
        <Accordion id="audit-accordion" defaultExpandedIndex={0}>
          <AccordionItem title="Section One">
            Content for section one.
          </AccordionItem>
          <AccordionItem title="Section Two">
            Content for section two.
          </AccordionItem>
        </Accordion>
      </ComponentTest>

      <ComponentTest name="CollapsibleContent" status="works">
        <CollapsibleContent name="audit-collapse" label="Show more">
          <div style={{ padding: '16px', background: '#f3f4f6', marginTop: '8px', borderRadius: '4px' }}>
            This content is collapsible.
          </div>
        </CollapsibleContent>
      </ComponentTest>

      <ComponentTest name="Modal" status="works" note="Click button to test">
        <div>
          <Button variation="secondary" compact onClick={() => setShowModal(true)}>Open Modal</Button>
          {showModal && (
            <Modal onClose={() => setShowModal(false)} title="Test Modal">
              <div style={{ padding: '16px' }}>Modal content here.</div>
            </Modal>
          )}
        </div>
      </ComponentTest>

      <ComponentTest name="FlexboxGrid" status="works">
        <FlexboxGrid>
          <div style={{ flex: 1, padding: '8px', background: '#dbeafe', textAlign: 'center' }}>Col 1</div>
          <div style={{ flex: 1, padding: '8px', background: '#e0e7ff', textAlign: 'center' }}>Col 2</div>
          <div style={{ flex: 1, padding: '8px', background: '#dbeafe', textAlign: 'center' }}>Col 3</div>
        </FlexboxGrid>
      </ComponentTest>

      <h2>Navigation</h2>

      <ComponentTest name="Link" status="works">
        <Link to="#">Sample Link</Link>
      </ComponentTest>

      <ComponentTest name="TabbedContent" status="works">
        <TabbedContent>
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content for Tab 1</TabPanel>
            <TabPanel>Content for Tab 2</TabPanel>
            <TabPanel>Content for Tab 3</TabPanel>
          </TabPanels>
        </TabbedContent>
      </ComponentTest>

      <ComponentTest name="DropdownMenu" status="works">
        <DropdownMenu>
          <ActionItem onClick={() => {}}>Edit</ActionItem>
          <ActionItem onClick={() => {}}>Duplicate</ActionItem>
          <Divider />
          <ActionItem onClick={() => {}}>Delete</ActionItem>
        </DropdownMenu>
      </ComponentTest>

      <h2>Feedback &amp; Status</h2>

      <ComponentTest name="Alert" status="works">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Alert type="success">Success alert message</Alert>
          <Alert type="warning">Warning alert message</Alert>
          <Alert type="error">Error alert message</Alert>
          <Alert type="info">Info alert message</Alert>
        </div>
      </ComponentTest>

      <ComponentTest name="Badge" status="works">
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge color="green">Active</Badge>
          <Badge color="default">Info</Badge>
          <Badge color="grey_dark">Warning</Badge>
          <Badge color="purple">Misc</Badge>
          <Badge>Inactive</Badge>
        </div>
      </ComponentTest>

      <ComponentTest name="Tooltip" status="works">
        <Tooltip content="This is a tooltip">
          <span style={{ textDecoration: 'underline', cursor: 'help' }}>Hover me for tooltip</span>
        </Tooltip>
      </ComponentTest>

      <ComponentTest name="ProgressBar" status="works">
        <ProgressBar
          label="Upload progress"
          valueNow={65}
          valueText="65%"
        />
      </ComponentTest>

      <ComponentTest name="LoadingState" status="works">
        <div style={{ height: '100px', position: 'relative' }}>
          <LoadingState />
        </div>
      </ComponentTest>

      <ComponentTest name="NotificationsBadge" status="works">
        <NotificationsBadge count={5} />
      </ComponentTest>

      <h2>Display</h2>

      <ComponentTest name="Text" status="works">
        <Text>This is a Text component</Text>
      </ComponentTest>

      <ComponentTest name="Avatar" status="works">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Avatar src="" />
        </div>
      </ComponentTest>

      <ComponentTest name="Tag" status="works">
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tag>Default Tag</Tag>
        </div>
      </ComponentTest>

      <ComponentTest name="Code" status="works">
        <Code>{'const x = 42;'}</Code>
      </ComponentTest>

      <ComponentTest name="TruncateText" status="works">
        <div style={{ width: '200px' }}>
          <TruncateText>This is a very long text that should be truncated at some point</TruncateText>
        </div>
      </ComponentTest>

      <ComponentTest name="ClickToCopy" status="works">
        <ClickToCopy copy="Hello, world!">Click to copy this</ClickToCopy>
      </ComponentTest>

      <ComponentTest name="HighFive" status="works" note="Celebration animation component">
        <HighFive />
      </ComponentTest>

      <h2>Utilities</h2>

      <ComponentTest name="VisuallyHidden" status="works">
        <div>
          <span>Visible text</span>
          <VisuallyHidden>This text is visually hidden but accessible</VisuallyHidden>
        </div>
      </ComponentTest>

      <ComponentTest name="DropdownArrow" status="works">
        <DropdownArrow />
      </ComponentTest>

      <ComponentTest name="style (design tokens)" status="works">
        <div>
          <div style={{ color: style.colors.primary?.base }}>Primary color: {style.colors.primary?.base}</div>
          <div style={{ fontSize: style.vars.fontSize.base }}>Base font size: {style.vars.fontSize.base}</div>
          <div>Space 4: {style.vars.space['4']}</div>
          <div>Border radius: {style.vars.borderRadius.base}</div>
        </div>
      </ComponentTest>

      <div style={{ height: '80px' }} />
    </Page>
  );
}
