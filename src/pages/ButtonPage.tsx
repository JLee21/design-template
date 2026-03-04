import React, { useState } from 'react';
import styled from 'styled-components';
import { style, Button, SpinnerButton } from '@do/walrus';

const Page = styled.div`
  padding: ${style.vars.space['6']};
  max-width: 640px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${style.colors.grey.darkest};
  font-size: ${style.vars.fontSize.large};
  font-weight: ${style.vars.fontWeight.bolder};
  margin: 0 0 ${style.vars.space['4']};
`;

const Subtitle = styled.p`
  color: ${style.colors.grey.dark};
  font-size: ${style.vars.fontSize.base};
  margin: 0 0 ${style.vars.space['5']};
  line-height: 1.5;
`;

const Spacer = styled.div`
  height: ${style.vars.space['6']};
`;

export default function ButtonPage() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Page>
      <Title>Button from Walrus</Title>
      <Subtitle>This page uses the Button component from @do/walrus.</Subtitle>
      <Button variation="primary">Primary</Button>

      <Spacer />

      <Title>SpinnerButton from Walrus</Title>
      <Subtitle>Click the button to see the loading state. Resets after 2 seconds.</Subtitle>
      <SpinnerButton variation="primary" isLoading={loading} onClick={handleClick}>
        {loading ? 'Saving...' : 'Save Changes'}
      </SpinnerButton>
    </Page>
  );
}
