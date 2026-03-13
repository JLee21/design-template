import { WalrusGlobalStyle } from '@do/walrus'
import React from 'react'
import ReactDOM from 'react-dom'
import { DevInspector, DevModeProvider } from '../dev-mode'
import App from './App'

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: { padding: '40px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }
      },
        React.createElement('h1', {
          style: { color: '#e6394a', fontSize: '20px', fontWeight: 700, margin: '0 0 12px' }
        }, 'Something went wrong'),
        React.createElement('p', {
          style: { color: '#5b6987', fontSize: '14px', margin: '0 0 16px', lineHeight: 1.5 }
        }, String(this.state.error)),
        React.createElement('pre', {
          style: { background: '#f5f7fa', padding: '16px', borderRadius: '6px', fontSize: '12px', color: '#031b4e', overflow: 'auto', maxHeight: '300px' }
        }, this.state.error.stack),
        React.createElement('button', {
          onClick: () => window.location.reload(),
          style: { marginTop: '16px', padding: '8px 16px', background: '#0069ff', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '14px', cursor: 'pointer' }
        }, 'Reload page')
      );
    }
    return this.props.children;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <DevModeProvider>
        <WalrusGlobalStyle />
        <App />
        <DevInspector />
      </DevModeProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
