import React from 'react';
import styled from 'styled-components';
import { style, Tag } from '@do/walrus';
import { withDevMode } from '@dev-mode/DevModeProvider';

// ============================================================
// Production code
// ============================================================

const DropletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"
      fill="#CEE0FA"
      stroke="#003F99"
      strokeWidth="1.5"
    />
  </svg>
);

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${style.vars.space['2']};
  flex-wrap: wrap;
`;

const TagContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${style.vars.space['2']};
`;

const OverflowIndicator = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${style.vars.space['1']};
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.base};
  color: ${style.colors.grey.darkest};
  border-bottom: 1px dashed ${style.colors.grey.darkest};
  line-height: 1;

  &:hover {
    color: ${style.colors.primary.base};
    border-bottom-color: ${style.colors.primary.base};
  }
`;

interface DropletTagSetProps {
  tags?: string[];
  overflowCount?: number;
  onOverflowClick?: () => void;
}

function DropletTagSetBase({
  tags = ['Droplet-1', 'Droplet-2', 'Droplet-3'],
  overflowCount = 23,
  onOverflowClick,
}: DropletTagSetProps) {
  return (
    <TagRow>
      {tags.map((name) => (
        <Tag key={name}>
          <TagContent>
            <DropletIcon />
            {name}
          </TagContent>
        </Tag>
      ))}
      {overflowCount > 0 && (
        <OverflowIndicator onClick={onOverflowClick}>
          {overflowCount} More
        </OverflowIndicator>
      )}
    </TagRow>
  );
}

// ============================================================
// Dev-only: withDevMode wrapper (stripped when copying source)
// ============================================================

export const DropletTagSet = withDevMode(DropletTagSetBase, {
  name: 'DropletTagSet',
  status: 'new',
  location: 'src/handoff/new/DropletTagSet.tsx',
  purpose: 'Horizontal row of resource tags with droplet icons and overflow indicator',
});

export type { DropletTagSetProps };
