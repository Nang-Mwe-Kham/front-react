import React from 'react';
import { 
  Users, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Server, 
  RefreshCw 
} from 'lucide-react';

export default function Navbar({ 
  theme, 
  onToggleTheme, 
  totalCount, 
  onSearchFocus, 
  apiConnected,
  isRefreshing,
  onRefreshData
}) {
  return (
    <header className="navbar-container glass-panel">
      <div className="navbar-left">
        <div className="brand-logo">
          <div className="logo-icon-wrap">
            <Users size={22} className="logo-icon" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              UserHub
              <span className="brand-badge">NEXT.JS API</span>
            </div>
            <span className="brand-subtitle">Directory & Access Management</span>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <div className="nav-global-search" onClick={onSearchFocus}>
          <Search size={16} className="search-icon-nav" />
          <span className="nav-search-placeholder">Quick search directory...</span>
          <span className="nav-search-badge">⌘K</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Next.js API Status Badge */}
        <div 
          className={`api-status-pill ${apiConnected ? 'is-connected' : 'is-fallback'}`}
          title={apiConnected ? 'Connected to Next.js Backend (/api/users)' : 'Local Storage Fallback Mode'}
        >
          <span className="api-dot"></span>
          <Server size={13} className="api-server-icon" />
          <span className="api-status-text">
            {apiConnected ? 'Next.js API' : 'Local Mode'}
          </span>
        </div>

        <button 
          id="refresh-data-btn"
          className={`btn-ghost icon-circle ${isRefreshing ? 'animate-spin' : ''}`}
          onClick={onRefreshData}
          title="Sync with Next.js Backend"
          aria-label="Refresh data"
        >
          <RefreshCw size={17} />
        </button>

        <div className="system-status-indicator">
          <span className="pulse-dot"></span>
          <span className="status-label">{totalCount} Active</span>
        </div>

        <button 
          id="theme-toggle-btn"
          className="btn-ghost icon-circle" 
          onClick={onToggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={19} className="theme-icon sun-icon" /> : <Moon size={19} className="theme-icon moon-icon" />}
        </button>

        <div className="admin-profile-pill">
          <div className="admin-avatar">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Admin Profile" 
            />
            <span className="avatar-online-dot"></span>
          </div>
          <div className="admin-info">
            <span className="admin-name">Dev Admin</span>
            <span className="admin-role">Superuser</span>
          </div>
        </div>
      </div>
    </header>
  );
}
