import React from 'react';
import { Navigation } from './Navigation';
import { Sidebar } from './Sidebar';
import { useDevMode } from '@dev-mode/DevModeProvider';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell - Main layout wrapper
 * 
 * WALRUS: When @do/walrus is available, consider using:
 * - Layout components if they exist
 * - Or keep this custom shell if Walrus doesn't have an equivalent
 */
export function AppShell({ children }: AppShellProps) {
  const { isEnabled: devModeEnabled } = useDevMode();
  
  // Calculate top margin: nav height (56px) + banner height if dev mode (40px)
  const mainTopMargin = devModeEnabled ? '96px' : '56px';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navigation />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main 
          className="flex-1 p-6 ml-64"
          style={{
            marginTop: mainTopMargin,
            transition: 'margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
