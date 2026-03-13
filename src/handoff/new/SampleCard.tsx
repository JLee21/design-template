import React from 'react';
import styled from 'styled-components';
import { style, Button } from '@do/walrus';
import { withDevMode } from '../../../dev-mode/DevModeProvider';

interface SampleCardProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

const CardWrapper = styled.div`
  background: ${style.colors.white};
  border: 1px solid ${style.colors.grey.light};
  border-radius: ${style.vars.borderRadius.large};
  padding: ${style.vars.space['4']};
  box-shadow: ${style.vars.boxShadow.base};
  transition: box-shadow ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};

  &:hover {
    box-shadow: ${style.vars.boxShadow.raised};
  }
`;

const CardTitle = styled.h3`
  color: ${style.colors.grey.darkest};
  font-size: ${style.vars.fontSize.large};
  font-weight: ${style.vars.fontWeight.bold};
  margin: 0 0 ${style.vars.space['2']};
`;

const CardDescription = styled.p`
  color: ${style.colors.grey.dark};
  font-size: ${style.vars.fontSize.small};
  line-height: 1.5;
  margin: 0 0 ${style.vars.space['3']};
`;

function SampleCardBase({
  title,
  description,
  onAction,
  actionLabel = 'Learn More',
}: SampleCardProps) {
  return (
    <CardWrapper>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      {onAction && (
        <Button variation="secondary" compact onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </CardWrapper>
  );
}

export const SampleCard = withDevMode(SampleCardBase, {
  name: 'SampleCard',
  status: 'new',
  location: 'src/handoff/new/SampleCard.tsx',
  purpose: 'Demonstration card component showing Design Bridge workflow',
  interactions: ['Click action button', 'Hover states'],
});

export type { SampleCardProps };
