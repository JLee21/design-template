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
  border: 1px solid ${style.colors.grey.light};
  border-radius: ${style.vars.borderRadius.large};
  box-shadow: ${style.vars.boxShadow.base};
  width: 320px;
`;

const RingContainer = styled.div`
  position: relative;
  width: 176px;
  height: 176px;
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
  stroke-width: 3;
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: ${style.colors.primary.base};
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
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
  font-size: 32px;
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-variant-numeric: tabular-nums;
`;

const TimeInput = styled.input`
  width: 100px;
  font-size: 32px;
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-variant-numeric: tabular-nums;
  text-align: center;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${style.colors.primary.base};
  outline: none;
  padding: 0;
  caret-color: ${style.colors.primary.base};
`;

const PresetsRow = styled.div`
  display: flex;
  gap: ${style.vars.space['4']};
  margin-bottom: ${style.vars.space['5']};
`;

const PresetButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${style.vars.space['1']} ${style.vars.space['2']};
  font-size: ${style.vars.fontSize.small};
  font-weight: ${(props) => (props.isActive ? style.vars.fontWeight.bold : style.vars.fontWeight.base)};
  color: ${(props) => (props.isActive ? style.colors.primary.base : style.colors.grey.dark)};
  border-bottom: 2px solid ${(props) => (props.isActive ? style.colors.primary.base : 'transparent')};
  transition: color ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic},
    border-color ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};

  &:hover {
    color: ${style.colors.primary.base};
  }
`;

const StartButtonWrapper = styled.div`
  width: 176px;
`;

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
    const num = parseInt(plain[1], 10);
    return num * 60;
  }

  return null;
}

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
          <PresetButton
            key={p.seconds}
            isActive={totalSeconds === p.seconds && !running}
            onClick={() => selectPreset(p.seconds)}
            disabled={running}
          >
            {p.label}
          </PresetButton>
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
  purpose: 'Circular countdown timer with progress ring, duration presets, and start/stop control',
  interactions: ['Click time to enter custom duration', 'Press Enter to auto-start', 'Select duration preset', 'Start/stop countdown', 'Progress ring animation'],
});

export type { TimerProps };
