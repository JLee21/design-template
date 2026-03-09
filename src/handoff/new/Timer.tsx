import React from 'react';
import styled from 'styled-components';
import { style, Button } from '@do/walrus';
import { withDevMode } from '@dev-mode/DevModeProvider';

// ============================================================
// Production code — everything above the withDevMode line
// is clean, self-contained, and works in any React 16 +
// styled-components 5 environment.
// ============================================================

const PRESETS = [
  { label: '1:00', seconds: 60 },
  { label: '10:00', seconds: 600 },
  { label: '60:00', seconds: 3600 },
];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${style.vars.space['6']};
  background: ${style.colors.white};
  border: ${style.vars.borderWidth.thin} solid ${style.colors.grey.light};
  border-radius: ${style.vars.borderRadius.large};
  box-shadow: ${style.vars.boxShadow.base};
  width: calc(${style.vars.space['10']} * 4.5);
`;

const RingContainer = styled.div`
  position: relative;
  width: calc(${style.vars.space['10']} * 2.5);
  height: calc(${style.vars.space['10']} * 2.5);
  margin-bottom: ${style.vars.space['5']};
`;

const RingSvg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const TrackCircle = styled.circle`
  fill: none;
  stroke: ${style.colors.grey.light};
  stroke-width: ${style.vars.borderRadius.base};
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: ${style.colors.primary.base};
  stroke-width: ${style.vars.borderRadius.base};
  stroke-linecap: round;
  transition: stroke-dashoffset ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};
`;

const TimeDisplay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TimeText = styled.span`
  font-size: calc(${style.vars.fontSize.large} * 1.6);
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  font-variant-numeric: tabular-nums;
`;

const TimeInput = styled.input`
  && {
    width: calc(${style.vars.space['10']} * 1.4);
    font-size: calc(${style.vars.fontSize.large} * 1.6);
    font-weight: ${style.vars.fontWeight.bold};
    color: ${style.colors.grey.darkest};
    font-variant-numeric: tabular-nums;
    text-align: center;
    background: transparent;
    border: none;
    border-bottom: ${style.vars.borderWidth.base} solid ${style.colors.primary.base};
    outline: none;
    padding: 0;
    caret-color: ${style.colors.primary.base};
  }
`;

const PresetsRow = styled.div`
  display: flex;
  gap: ${style.vars.space['3']};
  margin-bottom: ${style.vars.space['5']};
`;

const StartButtonWrapper = styled.div`
  width: calc(${style.vars.space['10']} * 2.5);
`;

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function parseTime(input: string): number | null {
  const trimmed = input.trim();

  const mmss = trimmed.match(/^(\d{1,3}):(\d{1,2})$/);
  if (mmss) {
    const mins = parseInt(mmss[1], 10);
    const secs = parseInt(mmss[2], 10);
    if (secs < 60) return mins * 60 + secs;
    return null;
  }

  const plain = trimmed.match(/^(\d+)$/);
  if (plain) {
    return parseInt(plain[1], 10) * 60;
  }

  return null;
}

interface TimerProps {
  defaultPreset?: number;
}

function TimerBase({ defaultPreset = 600 }: TimerProps) {
  const [totalSeconds, setTotalSeconds] = React.useState(defaultPreset);
  const [remaining, setRemaining] = React.useState(defaultPreset);
  const [running, setRunning] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const intervalRef = React.useRef<number | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const committedRef = React.useRef(false);

  React.useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const selectPreset = (seconds: number) => {
    if (running) return;
    setTotalSeconds(seconds);
    setRemaining(seconds);
  };

  const toggleRunning = () => {
    if (remaining === 0) {
      setRemaining(totalSeconds);
    }
    setRunning((prev) => !prev);
  };

  const startEditing = () => {
    if (running) return;
    committedRef.current = false;
    setEditValue(formatTime(remaining));
    setEditing(true);
  };

  const commitEdit = (andStart: boolean) => {
    if (committedRef.current) return;
    committedRef.current = true;
    const parsed = parseTime(editValue);
    if (parsed !== null && parsed > 0) {
      setTotalSeconds(parsed);
      setRemaining(parsed);
      if (andStart) {
        setRunning(true);
      }
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    committedRef.current = true;
    setEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(true);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Wrapper>
      <RingContainer>
        <RingSvg viewBox="0 0 176 176">
          <TrackCircle cx="88" cy="88" r={RADIUS} />
          <ProgressCircle
            cx="88"
            cy="88"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </RingSvg>
        <TimeDisplay onClick={startEditing}>
          {editing ? (
            <TimeInput
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={() => commitEdit(false)}
              placeholder="M:SS"
            />
          ) : (
            <TimeText>{formatTime(remaining)}</TimeText>
          )}
        </TimeDisplay>
      </RingContainer>

      <PresetsRow>
        {PRESETS.map((p) => (
          <Button
            key={p.seconds}
            variation="secondary"
            compact
            active={totalSeconds === p.seconds && !running}
            onClick={() => selectPreset(p.seconds)}
            disabled={running}
          >
            {p.label}
          </Button>
        ))}
      </PresetsRow>

      <StartButtonWrapper>
        <Button variation="secondary" fullWidth onClick={toggleRunning}>
          {running ? 'Stop' : 'Start'}
        </Button>
      </StartButtonWrapper>
    </Wrapper>
  );
}

// ============================================================
// Dev-only: withDevMode wrapper (stripped when copying source)
// ============================================================

export const Timer = withDevMode(TimerBase, {
  name: 'Timer',
  status: 'new',
  location: 'src/handoff/new/Timer.tsx',
  purpose: 'Circular countdown timer with progress ring, Walrus Button presets, and start/stop control',
  interactions: [
    'Click time to enter custom duration',
    'Press Enter to auto-start',
    'Select duration preset (Walrus Button compact active)',
    'Start/stop countdown',
    'Progress ring animation',
  ],
});

export type { TimerProps };
