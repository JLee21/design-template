import React from 'react';
import styled from 'styled-components';
import { style, Heading, Text, Card, CardContent, Badge } from '@do/walrus';
import { withDevMode } from '../../../dev-mode/DevModeProvider';

const Wrapper = styled.div`
  background: ${style.colors.white};
  padding: ${style.vars.space['6']} ${style.vars.space['8']};
  min-height: 100vh;
`;

const HeadingStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['4']};
  max-width: 914px;
  margin-bottom: ${style.vars.space['6']};
`;

const ContentRow = styled.div`
  display: flex;
  gap: ${style.vars.space['8']};
  align-items: flex-start;
  margin-bottom: ${style.vars.space['6']};
`;

const TextStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['3']};
  width: 312px;
  flex-shrink: 0;
`;

const CardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['5']};
  flex: 1;
`;

const CardBody = styled.p`
  color: ${style.colors.grey.dark};
  font-size: ${style.vars.fontSize.base};
  line-height: 1.5;
  margin: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: ${style.vars.space['2']};
  align-items: center;
`;

const SAMPLE_TEXT = 'The quick brown Fox jumped over sammy.';
const CARD_TEXT =
  'Lorem ipsum dolor sit amet, consectetur elit adipiscing, sed do eiusm tem dolor.';

function ShowcaseBase() {
  return (
    <Wrapper>
      <HeadingStack>
        <Heading level="h1">{SAMPLE_TEXT}</Heading>
        <Heading level="h2">{SAMPLE_TEXT}</Heading>
        <Heading level="h3">{SAMPLE_TEXT}</Heading>
        <Heading level="h4">{SAMPLE_TEXT}</Heading>
        <Heading level="h5">{SAMPLE_TEXT}</Heading>
        <Heading level="h6">{SAMPLE_TEXT}</Heading>
      </HeadingStack>

      <ContentRow>
        <TextStack>
          <Text>{SAMPLE_TEXT}</Text>
          <strong>
            <Text>{SAMPLE_TEXT}</Text>
          </strong>
          <Text secondary>{SAMPLE_TEXT}</Text>
          <strong>
            <Text secondary>{SAMPLE_TEXT}</Text>
          </strong>
          <Text tertiary>{SAMPLE_TEXT}</Text>
        </TextStack>

        <CardColumn>
          <Card backgroundColor="White">
            <CardContent>
              <CardBody>{CARD_TEXT}</CardBody>
            </CardContent>
          </Card>

          <Card raiseOnHover backgroundColor="White">
            <CardContent>
              <CardBody>{CARD_TEXT}</CardBody>
            </CardContent>
          </Card>
        </CardColumn>
      </ContentRow>

      <BadgeRow>
        <Badge color="default">Badge</Badge>
        <Badge color="grey_dark">Badge</Badge>
        <Badge color="green">Badge</Badge>
        <Badge color="purple">Badge</Badge>
        <Badge>Badge</Badge>
      </BadgeRow>
    </Wrapper>
  );
}

export const Showcase = withDevMode(ShowcaseBase, {
  name: 'Showcase',
  status: 'new',
  location: 'src/handoff/new/Showcase.tsx',
  purpose:
    'Typography and primitives showcase displaying Heading, Text, Card, and Badge Walrus components',
  interactions: ['Card raise on hover'],
});

export default Showcase;
