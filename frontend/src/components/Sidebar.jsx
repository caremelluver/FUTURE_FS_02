import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Bell, BarChart3, Settings,
  LogOut, Coffee, ChevronLeft, ChevronRight, Globe, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads',     icon: Users,            label: 'Leads' },
  { to: '/followups', icon: Bell,             label: 'Follow-Ups', badge: true },
  { to: '/analytics', icon: BarChart3,        label: 'Analytics' },
  { to: '/contact',   icon: Globe,            label: 'Contact Form' },
  { to: '/settings',  icon: Settings,         label: 'Settings' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="sidebar h-screen fixed left-0 top-0 z-40 flex flex-col"
      style={{ overflow: 'hidden' }}
    >
      {/* ── Brand ── */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{ height: 'var(--header-h)', borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
          style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #f5b041, #c47a15)',
            boxShadow: '0 0 16px rgba(245,176,65,0.3)',
          }}
        >
          <img src="/logo.png" alt="Starcafe Logo" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 10 }} />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <p
                className="font-poppins font-bold gradient-text"
                style={{ fontSize: '1.1rem', lineHeight: 1.2 }}
              >
                Starcafe
              </p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', fontWeight: 600 }}>
                CRM SYSTEM
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-4 overflow-y-auto" style={{ padding: '16px 8px' }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'var(--text-hint)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0 12px',
                marginBottom: 8,
              }}
            >
              Navigation
            </motion.p>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <div
                  className={isActive ? 'nav-active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: isActive ? '0 12px 12px 0' : 12,
                    marginLeft: isActive ? 0 : 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(245,176,65,0.13), rgba(245,176,65,0.04))'
                      : 'transparent',
                    borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <div
                    className="icon-box flex-shrink-0"
                    style={{
                      width: 32, height: 32,
                      background: isActive ? 'rgba(245,176,65,0.15)' : 'rgba(255,255,255,0.04)',
                      borderRadius: 10,
                      border: `1px solid ${isActive ? 'rgba(245,176,65,0.3)' : 'transparent'}`,
                    }}
                  >
                    <Icon
                      size={15}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      color={isActive ? 'var(--gold)' : 'currentColor'}
                    />
                  </div>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <span>{label}</span>
                        {badge && (
                          <span
                            style={{
                              width: 7, height: 7, borderRadius: '50%',
                              background: '#f59e0b',
                            }}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Divider ── */}
      <div className="divider" style={{ margin: '0 16px' }} />

      {/* ── Footer ── */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* User */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                background: 'rgba(245,176,65,0.06)',
                border: '1px solid var(--border)',
                marginBottom: 4,
              }}
            >
              <div className="avatar flex-shrink-0" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.username}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user?.role}
                </p>
              </div>
              <Sparkles size={13} color="var(--gold)" style={{ flexShrink: 0 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 12,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--danger)',
            width: '100%',
            transition: 'background 0.2s ease',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-dim)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <div
            className="icon-box flex-shrink-0"
            style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.1)', borderRadius: 10 }}
          >
            <LogOut size={15} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          right: -12,
          top: 84,
          width: 24, height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5b041, #c47a15)',
          color: '#1a0d00',
          border: '2px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(245,176,65,0.4)',
          zIndex: 50,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {collapsed
          ? <ChevronRight size={11} strokeWidth={2.5} />
          : <ChevronLeft  size={11} strokeWidth={2.5} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
