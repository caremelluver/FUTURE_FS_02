import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import SearchModal from './components/SearchModal';
import NotificationPanel from './components/NotificationPanel';

import LoginPage     from './pages/LoginPage';
import Dashboard     from './pages/Dashboard';
import LeadsPage     from './pages/LeadsPage';
import NewLeadPage   from './pages/NewLeadPage';
import LeadDetailPage from './pages/LeadDetailPage';
import FollowUpsPage from './pages/FollowUpsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ContactPage   from './pages/ContactPage';
import SettingsPage  from './pages/SettingsPage';

import {
  LayoutDashboard, Users, Bell, BarChart3, Settings, Globe, Search, Command,
} from 'lucide-react';

const PAGE_META = {
  '/dashboard': { title: 'Dashboard',    icon: LayoutDashboard },
  '/leads':     { title: 'Leads',        icon: Users },
  '/leads/new': { title: 'New Lead',     icon: Users },
  '/followups': { title: 'Follow-Ups',   icon: Bell },
  '/analytics': { title: 'Analytics',    icon: BarChart3 },
  '/contact':   { title: 'Contact Form', icon: Globe },
  '/settings':  { title: 'Settings',     icon: Settings },
};

const SIDEBAR_W   = 260;
const SIDEBAR_MINI = 72;

/* ─── Top Header ─── */
const TopHeader = ({ searchOpen, setSearchOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const meta = PAGE_META[location.pathname] || { title: 'Dashboard', icon: LayoutDashboard };
  const Icon = meta.icon;

  return (
    <header
      className="app-header"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {/* Left: Page context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          className="icon-box"
          style={{
            width: 40, height: 40,
            background: 'rgba(245,176,65,0.1)',
            border: '1px solid rgba(245,176,65,0.2)',
            borderRadius: 12,
          }}
        >
          <Icon size={18} color="var(--gold)" strokeWidth={2} />
        </div>
        <div>
          <h2
            className="font-poppins"
            style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}
          >
            {meta.title}
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Starcafe CRM · Lead Management
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Search trigger button */}
        <button
          id="global-search-trigger"
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,176,65,0.4)'; e.currentTarget.style.background = 'rgba(245,176,65,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        >
          <Search size={12} />
          <span>Search</span>
          <kbd
            style={{
              display: 'flex', alignItems: 'center', gap: 2,
              padding: '2px 6px', borderRadius: 5,
              background: 'rgba(255,255,255,0.06)',
              fontSize: '0.7rem', fontFamily: 'monospace',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Command size={9} />K
          </kbd>
        </button>

        {/* Notification Panel */}
        <NotificationPanel />

        {/* User Avatar */}
        <div
          className="avatar"
          style={{
            width: 36, height: 36,
            fontSize: '0.8rem', fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 0 0 2px rgba(245,176,65,0.3)',
          }}
          title={user?.username}
        >
          {user?.username?.[0]?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
};

/* ─── App Layout ─── */
const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sidebarWidth = collapsed ? SIDEBAR_MINI : SIDEBAR_W;

  // Global Ctrl+K / Cmd+K shortcut
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(o => !o);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Subtle ambient particles */}
      <div className="particles-bg" aria-hidden="true">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width:  `${120 + i * 80}px`,
              height: `${120 + i * 80}px`,
              left:   `${10 + i * 30}%`,
              top:    `${15 + (i % 2) * 45}%`,
              animationDelay:    `${i * 3}s`,
              animationDuration: `${14 + i * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Fixed Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Global Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          minHeight: '100vh',
          paddingLeft: sidebarWidth,
          transition: 'padding-left 0.3s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <TopHeader searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

        {/* Page Content */}
        <main style={{ padding: '28px 32px', minHeight: 'calc(100vh - var(--header-h))' }}>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

/* ─── App ─── */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(15,10,4,0.97)',
              color: '#fff',
              border: '1px solid rgba(245,176,65,0.25)',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: 'rgba(15,10,4,0.97)' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: 'rgba(15,10,4,0.97)' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/leads"     element={<ProtectedRoute><AppLayout><LeadsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/leads/new" element={<ProtectedRoute><AppLayout><NewLeadPage /></AppLayout></ProtectedRoute>} />
          <Route path="/leads/:id"      element={<ProtectedRoute><AppLayout><LeadDetailPage /></AppLayout></ProtectedRoute>} />
          <Route path="/leads/:id/edit" element={<ProtectedRoute><AppLayout><LeadDetailPage /></AppLayout></ProtectedRoute>} />
          <Route path="/followups"  element={<ProtectedRoute><AppLayout><FollowUpsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/analytics"  element={<ProtectedRoute><AppLayout><AnalyticsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/settings"   element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
