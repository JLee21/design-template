import React from 'react';
import styled from 'styled-components';
import { style, Badge, Button, LoadingState, HighFive } from '@do/walrus';
import { withDevMode } from '../../../dev-mode/DevModeProvider';

// ============================================================
// Production code — everything above the withDevMode line
// is clean, self-contained, and works in any React 16 +
// styled-components 5 environment.
// ============================================================

// --- Inline SVG Icons ---

const FailoverIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="3.5" stroke="#003F99" strokeWidth="1.2" fill="#CEE0FA" />
    <circle cx="16" cy="8" r="3.5" stroke="#003F99" strokeWidth="1.2" fill="#CEE0FA" />
    <circle cx="8" cy="16" r="3.5" stroke="#003F99" strokeWidth="1.2" fill="#CEE0FA" />
    <circle cx="16" cy="16" r="3.5" stroke="#003F99" strokeWidth="1.2" fill="#CEE0FA" />
    <path d="M11.5 10L12.5 14" stroke="#003F99" strokeWidth="1" strokeLinecap="round" />
    <path d="M10 11.5L14 12.5" stroke="#003F99" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="6" rx="8" ry="3" fill="#CEE0FA" stroke="#003F99" strokeWidth="1" />
    <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="#003F99" strokeWidth="1" />
    <ellipse cx="12" cy="12" rx="8" ry="3" fill="#CEE0FA" stroke="#003F99" strokeWidth="1" />
    <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#003F99" strokeWidth="1" />
    <ellipse cx="12" cy="18" rx="8" ry="3" fill="#CEE0FA" stroke="#003F99" strokeWidth="1" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="#CEE0FA" stroke="#003F99" strokeWidth="1" />
    <rect x="6" y="8" width="4" height="3" rx="0.5" fill="#003F99" />
    <rect x="6" y="13" width="4" height="3" rx="0.5" fill="#003F99" />
    <circle cx="16" cy="16" r="1" fill="#003F99" />
  </svg>
);

// --- One-off: Header Row ---

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${style.vars.space['3']};
`;

const HeaderText = styled.h2`
  font-size: 24px;
  font-weight: ${style.vars.fontWeight.base};
  color: ${style.colors.grey.darkest};
  margin: 0;
  white-space: nowrap;
`;


// --- New Component: DatabaseSummaryCard ---

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['8']};
  align-items: flex-start;
`;

const Card = styled.div`
  width: 420px;
  background: ${style.colors.white};
  border: 1px solid #8390AF;
  border-radius: ${style.vars.borderRadius.base};
  padding: ${style.vars.space['5']};
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['5']};
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: ${style.vars.fontWeight.bold};
  color: #000000;
  margin: 0;
`;

const ItemRow = styled.div<{ $dashed?: boolean }>`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding-bottom: ${style.vars.space['5']};
  border-bottom: 1px ${(p) => (p.$dashed ? 'dashed' : 'solid')} #8390AF;
`;

const ItemIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div`
  font-size: 16px;
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  line-height: 1.5;
`;

const ItemDetail = styled.div`
  font-size: 14px;
  color: #8390AF;
  line-height: 1.5;
`;

const DetailLabel = styled.span`
  font-weight: ${style.vars.fontWeight.bold};
`;

const DetailValue = styled.span`
  font-weight: ${style.vars.fontWeight.base};
`;

const ItemPrice = styled.div`
  font-size: 16px;
  font-weight: ${style.vars.fontWeight.base};
  color: #8390AF;
  flex-shrink: 0;
  white-space: nowrap;
  line-height: 1.5;
`;

const CostRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const CostLabel = styled.span`
  font-size: 16px;
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
`;

const CostValues = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CostPrimary = styled.div`
  font-size: 18px;
  color: ${style.colors.grey.darkest};
  line-height: 1.5;
`;

const CostBold = styled.span`
  font-weight: ${style.vars.fontWeight.bold};
`;

const CostNormal = styled.span`
  font-weight: ${style.vars.fontWeight.base};
`;

const CostSecondary = styled.div`
  font-size: 14px;
  font-weight: ${style.vars.fontWeight.base};
  color: ${style.colors.grey.dark};
  line-height: 1.5;
`;

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${style.vars.space['6']} 0;
  min-height: 280px;
`;

const SuccessMessage = styled.p`
  font-size: ${style.vars.fontSize.large};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  margin: ${style.vars.space['4']} 0 0;
  text-align: center;
`;

const SuccessDetail = styled.p`
  font-size: ${style.vars.fontSize.small};
  font-weight: ${style.vars.fontWeight.base};
  color: ${style.colors.grey.dark};
  margin: ${style.vars.space['2']} 0 0;
  text-align: center;
`;

type CardState = 'idle' | 'loading' | 'success';

interface DatabaseSummaryCardProps {
  onCreateClick?: () => void;
}

function DatabaseSummaryCardBase({ onCreateClick }: DatabaseSummaryCardProps) {
  const [cardState, setCardState] = React.useState<CardState>('idle');
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCreate = () => {
    if (onCreateClick) onCreateClick();
    setCardState('loading');
    timerRef.current = window.setTimeout(() => {
      setCardState('success');
    }, 2000);
  };

  const handleReset = () => {
    setCardState('idle');
  };

  return (
    <PageLayout>
      <HeaderRow>
        <FailoverIcon />
        <HeaderText>This is a header</HeaderText>
        <Badge color="green">New</Badge>
      </HeaderRow>

      <Card>
        {cardState === 'idle' && (
          <>
            <CardTitle>Summary</CardTitle>

            <ItemRow $dashed>
              <ItemIconWrapper>
                <DatabaseIcon />
              </ItemIconWrapper>
              <ItemContent>
                <ItemName>Compute</ItemName>
                <ItemDetail>
                  <DetailLabel>Type: </DetailLabel>
                  <DetailValue>Basic</DetailValue>
                </ItemDetail>
                <ItemDetail>
                  <DetailLabel>vCPU</DetailLabel>
                  <DetailValue>: 1 - Shared CPU</DetailValue>
                </ItemDetail>
                <ItemDetail>
                  <DetailLabel>RAM:</DetailLabel>
                  <DetailValue> 1 GB</DetailValue>
                </ItemDetail>
                <ItemDetail>
                  <DetailLabel>Connection limit</DetailLabel>
                  <DetailValue>: 47</DetailValue>
                </ItemDetail>
              </ItemContent>
              <ItemPrice>$13.50/mo</ItemPrice>
            </ItemRow>

            <ItemRow>
              <ItemIconWrapper>
                <VolumeIcon />
              </ItemIconWrapper>
              <ItemContent>
                <ItemName>Storage</ItemName>
                <ItemDetail>
                  <DetailLabel>SSD: </DetailLabel>
                  <DetailValue>20 GB</DetailValue>
                </ItemDetail>
              </ItemContent>
              <ItemPrice>$1.50/mo</ItemPrice>
            </ItemRow>

            <CostRow>
              <CostLabel>Monthly cost</CostLabel>
              <CostValues>
                <CostPrimary>
                  <CostBold> $15.00</CostBold>
                  <CostNormal> / month</CostNormal>
                </CostPrimary>
                <CostSecondary>$0.054 / hour</CostSecondary>
              </CostValues>
            </CostRow>

            <Button variation="primary" fullWidth onClick={handleCreate}>
              Create Managed Database
            </Button>
          </>
        )}

        {cardState === 'loading' && (
          <FeedbackContainer>
            <LoadingState />
            <SuccessDetail>Creating your database...</SuccessDetail>
          </FeedbackContainer>
        )}

        {cardState === 'success' && (
          <FeedbackContainer>
            <HighFive />
            <SuccessMessage>Database created!</SuccessMessage>
            <SuccessDetail>Your managed database is ready to use.</SuccessDetail>
            <div style={{ marginTop: 24 }}>
              <Button variation="secondary" onClick={handleReset}>
                Back to summary
              </Button>
            </div>
          </FeedbackContainer>
        )}
      </Card>
    </PageLayout>
  );
}

// ============================================================
// Dev-only: withDevMode wrapper (stripped when copying source)
// ============================================================

export const DatabaseSummaryCard = withDevMode(DatabaseSummaryCardBase, {
  name: 'DatabaseSummaryCard',
  status: 'new',
  location: 'src/handoff/new/DatabaseSummaryCard.tsx',
  purpose: 'Itemized cost summary card for Create Managed Database flow with compute/storage line items and monthly total',
  interactions: ['Click Create Managed Database button', 'Loading state with spinner', 'HighFive celebration on success', 'Back to summary reset'],
});

export type { DatabaseSummaryCardProps };
