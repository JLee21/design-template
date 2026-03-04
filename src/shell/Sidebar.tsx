import React from 'react';
import { useDevMode } from '@dev-mode/DevModeProvider';

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: '📊', active: true },
  { label: 'Droplets', icon: '💧' },
  { label: 'Kubernetes', icon: '☸️' },
  { label: 'Databases', icon: '🗄️' },
  { label: 'Spaces', icon: '📦' },
  { label: 'Apps', icon: '🚀' },
  { label: 'Functions', icon: '⚡' },
];

/**
 * Sidebar - Left navigation sidebar
 * 
 * WALRUS: Replace with Walrus SideNav component when available
 * Check: https://walrus.internal.digitalocean.com for SideNav
 */
export function Sidebar() {
  const { isEnabled: devModeEnabled } = useDevMode();
  const topOffset = devModeEnabled ? '96px' : '56px'; // 40px banner + 56px nav = 96px
  
  return (
    <aside 
      className="fixed left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto"
      style={{ 
        top: topOffset,
        transition: 'top 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="p-4">
        <div className="mb-6">
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option>My Project</option>
            <option>Another Project</option>
          </select>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active
                  ? 'bg-[#0069ff] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
