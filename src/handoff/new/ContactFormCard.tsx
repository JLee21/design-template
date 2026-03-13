import React from 'react';
import styled from 'styled-components';
import { style, Button, SelectMenu, LoadingState, HighFive } from '@do/walrus';
import { withDevMode } from '../../../dev-mode/DevModeProvider';

// ============================================================
// Production code
//
// Known issues applied:
// - TextInput requires Formik → custom inputs with Walrus tokens
// - WalrusGlobalStyle overrides input borders → && specificity boost
// - SelectMenu constrains width on medium+ → wrapper override
// ============================================================

const FIELD_BORDER = `${style.vars.borderWidth.thin} solid ${style.colors.grey.dark}`;
const FIELD_RADIUS = style.vars.borderRadius.base;
const FIELD_FOCUS_COLOR = style.colors.blue.dark;
const FIELD_PADDING = `${style.vars.space['2']} ${style.vars.space['3']}`;
const FIELD_FONT_SIZE = style.vars.fontSize.base;
const PLACEHOLDER_COLOR = style.colors.grey.dark;

const FormCard = styled.div`
  position: relative;
  width: 480px;
  max-width: 100%;
  background: ${style.colors.white};
  border: ${style.vars.borderWidth.thin} solid ${style.colors.grey.light};
  border-radius: ${FIELD_RADIUS};
  padding: ${style.vars.space['5']} ${style.vars.space['6']};
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['3']};
`;

const FormTitle = styled.h2`
  font-size: ${style.vars.fontSize.large};
  font-weight: ${style.vars.fontWeight.bolder};
  color: ${style.colors.grey.darkest};
  margin: 0 0 ${style.vars.space['1']};
`;

const FieldInput = styled.input`
  && {
    display: block;
    width: 100%;
    padding: ${FIELD_PADDING};
    font-size: ${FIELD_FONT_SIZE};
    color: ${style.colors.grey.darkest};
    border: ${FIELD_BORDER};
    border-radius: ${FIELD_RADIUS};
    background: ${style.colors.white};
    box-sizing: border-box;
  }

  &&::placeholder {
    color: ${PLACEHOLDER_COLOR};
  }

  &&:focus {
    outline: none;
    border-color: ${FIELD_FOCUS_COLOR};
  }
`;

const FieldTextArea = styled.textarea`
  && {
    display: block;
    width: 100%;
    min-height: 80px;
    padding: ${FIELD_PADDING};
    font-size: ${FIELD_FONT_SIZE};
    color: ${style.colors.grey.darkest};
    border: ${FIELD_BORDER};
    border-radius: ${FIELD_RADIUS};
    background: ${style.colors.white};
    resize: vertical;
    font-family: inherit;
    box-sizing: border-box;
  }

  &&::placeholder {
    color: ${PLACEHOLDER_COLOR};
  }

  &&:focus {
    outline: none;
    border-color: ${FIELD_FOCUS_COLOR};
  }
`;

const DropdownWrapper = styled.div`
  width: 100%;

  > div {
    width: 100%;
  }
`;

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${style.vars.space['8']} 0 ${style.vars.space['5']};
  min-height: 360px;
`;

const LoadingDetail = styled.p`
  font-size: ${style.vars.fontSize.small};
  font-weight: ${style.vars.fontWeight.base};
  color: ${style.colors.grey.dark};
  margin: ${style.vars.space['2']} 0 0;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${style.vars.space['3']};
  right: ${style.vars.space['3']};
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${style.colors.grey.dark};
  border-radius: 50%;
  padding: 0;
  transition: background ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic},
    color ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};

  &:hover {
    background: ${style.colors.grey.light};
    color: ${style.colors.grey.darkest};
  }
`;

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1l12 12M13 1L1 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ENVIRONMENT_ITEMS = [
  { label: 'Development', value: 'development' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'production' },
];

type FormState = 'form' | 'loading' | 'success';

interface ContactFormCardProps {
  onSubmit?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    environment: string;
    comments: string;
  }) => void;
}

function ContactFormCardBase({ onSubmit }: ContactFormCardProps) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [environment, setEnvironment] = React.useState<
    { label: string; value: string } | undefined
  >(undefined);
  const [comments, setComments] = React.useState('');
  const [formState, setFormState] = React.useState<FormState>('form');
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const doSubmit = () => {
    if (onSubmit) {
      onSubmit({
        firstName,
        lastName,
        email,
        environment: environment ? environment.value : '',
        comments,
      });
    }
    setFormState('loading');
    timerRef.current = window.setTimeout(() => {
      setFormState('success');
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSubmit();
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setEnvironment(undefined);
    setComments('');
    setFormState('form');
  };

  if (formState === 'loading') {
    return (
      <FormCard>
        <FeedbackContainer>
          <LoadingState />
          <LoadingDetail>Submitting...</LoadingDetail>
        </FeedbackContainer>
      </FormCard>
    );
  }

  if (formState === 'success') {
    return (
      <FormCard>
        <CloseButton onClick={handleReset} aria-label="Close">
          <CloseIcon />
        </CloseButton>
        <FeedbackContainer>
          <HighFive />
        </FeedbackContainer>
      </FormCard>
    );
  }

  return (
    <FormCard as="form" onSubmit={handleFormSubmit}>
      <FormTitle>This is a header</FormTitle>

      <FieldInput
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />

      <FieldInput
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />

      <FieldInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <DropdownWrapper>
        <SelectMenu
          items={ENVIRONMENT_ITEMS}
          selection={environment}
          setSelection={setEnvironment}
          placeholder="Choose your environment"
        />
      </DropdownWrapper>

      <FieldTextArea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Comments"
      />

      <Button variation="primary" fullWidth onClick={doSubmit}>
        Submit
      </Button>
    </FormCard>
  );
}

// ============================================================
// Dev-only: withDevMode wrapper (stripped when copying source)
// ============================================================

export const ContactFormCard = withDevMode(ContactFormCardBase, {
  name: 'ContactFormCard',
  status: 'new',
  location: 'src/handoff/new/ContactFormCard.tsx',
  purpose:
    'Contact form with inputs, Walrus SelectMenu dropdown, textarea, and submit with loading then HighFive success flow with X close to reset',
  interactions: [
    'Fill form fields',
    'Select environment from dropdown',
    'Submit form',
    'Loading state',
    'HighFive on success',
    'Click X to reset form',
  ],
});

export type { ContactFormCardProps };
