import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ComponentType } from 'react';

let devModeIdCounter = 0;
function useStableId() {
  const [id] = useState(() => `devmode-${++devModeIdCounter}`);
  return id;
}

export interface ComponentMetadata {
  name: string;
  status: 'new' | 'modified' | 'existing' | 'one-off';
  location: string;
  purpose?: string;
  interactions?: string[];
  walrusComponent?: string;
  storybookUrl?: string;
  import?: string;
}

interface RegisteredComponent {
  id: string;
  metadata: ComponentMetadata;
  element: HTMLElement | null;
}

interface DevModeContextType {
  isEnabled: boolean;
  toggleDevMode: () => void;
  registeredComponents: Map<string, RegisteredComponent>;
  registerComponent: (id: string, metadata: ComponentMetadata, element: HTMLElement | null) => void;
  unregisterComponent: (id: string) => void;
  selectedComponent: RegisteredComponent | null;
  setSelectedComponent: (component: RegisteredComponent | null) => void;
}

const DevModeContext = createContext<DevModeContextType | null>(null);

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [registeredComponents] = useState(() => new Map<string, RegisteredComponent>());
  const [selectedComponent, setSelectedComponent] = useState<RegisteredComponent | null>(null);

  const toggleDevMode = useCallback(() => {
    setIsEnabled(prev => !prev);
    setSelectedComponent(null);
  }, []);

  const registerComponent = useCallback((id: string, metadata: ComponentMetadata, element: HTMLElement | null) => {
    registeredComponents.set(id, { id, metadata, element });
  }, [registeredComponents]);

  const unregisterComponent = useCallback((id: string) => {
    registeredComponents.delete(id);
  }, [registeredComponents]);

  // Keyboard shortcut: Cmd+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === 'd') {
        e.preventDefault();
        toggleDevMode();
      }
      if (e.key === 'Escape' && isEnabled) {
        setSelectedComponent(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDevMode, isEnabled]);

  return (
    <DevModeContext.Provider
      value={{
        isEnabled,
        toggleDevMode,
        registeredComponents,
        registerComponent,
        unregisterComponent,
        selectedComponent,
        setSelectedComponent,
      }}
    >
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
}

// HOC to wrap components with DevMode metadata
export function withDevMode<P extends object>(
  Component: ComponentType<P>,
  metadata: ComponentMetadata
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    const { isEnabled, registerComponent, unregisterComponent, setSelectedComponent } = useDevMode();
    const ref = React.useRef<HTMLDivElement>(null);
    const id = useStableId();

    useEffect(() => {
      registerComponent(id, metadata, ref.current);
      return () => unregisterComponent(id);
    }, [id, registerComponent, unregisterComponent]);

    const statusColors = {
      new: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      modified: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      existing: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      'one-off': { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    };

    const colors = statusColors[metadata.status];

    return (
      <div
        ref={ref}
        data-devmode-id={id}
        data-devmode-name={metadata.name}
        style={isEnabled ? {
          position: 'relative',
          outline: `2px solid ${colors.border}`,
          outlineOffset: '2px',
          cursor: 'pointer',
        } : undefined}
        onClick={isEnabled ? (e) => {
          e.stopPropagation();
          setSelectedComponent({ id, metadata, element: ref.current });
        } : undefined}
      >
        {isEnabled && (
          <div
            data-devmode-ignore
            style={{
              position: 'absolute',
              top: '-24px',
              left: '0',
              background: colors.border,
              color: 'white',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 500,
              zIndex: 1000,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {metadata.name} ({metadata.status})
          </div>
        )}
        <Component {...props} />
      </div>
    );
  };

  WrappedComponent.displayName = `withDevMode(${metadata.name})`;
  return WrappedComponent;
}
