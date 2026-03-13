import React from 'react';
import { useDevMode } from '../../dev-mode/DevModeProvider';

/**
 * Navigation - Top navigation bar
 * 
 * WALRUS: Replace with Walrus navigation component when available
 * Check: https://walrus.internal.digitalocean.com for Nav/Header components
 */
export function Navigation() {
  const { isEnabled: devModeEnabled } = useDevMode();
  
  return (
    <nav 
      className="fixed left-0 right-0 h-14 bg-[#031b4e] text-white flex items-center px-4 z-50"
      style={{ 
        top: devModeEnabled ? '40px' : '0',
        transition: 'top 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#0069ff] rounded flex items-center justify-center font-bold">
          DO
        </div>
        <span className="font-semibold">DigitalOcean</span>
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Right side - placeholder for user menu, etc */}
      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-300 hover:text-white transition-colors">
          Docs
        </button>
        <button className="text-sm text-gray-300 hover:text-white transition-colors">
          Support
        </button>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
          JD
        </div>
      </div>
    </nav>
  );
}
