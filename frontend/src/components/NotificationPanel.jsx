import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, Clock, Users, CheckCircle, X, RefreshCw } from 'lucide-react';
import { getLeads } from '../services/api';

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Fetch follow-ups + recent leads in parallel
      const [followRes, recentRes] = await Promise.all([
        getLeads({ limit: 100, sort: 'followUpDate' }),
        getLeads({ limit: 5, sort: '-createdAt' }),
      ]);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

      const allLeads = followRes.data.leads || [];
      const pending = allLeads.filter(l => l.followUpDate && !l.followUpCompleted);

      const overdue  = pending.filter(l => new Date(l.followUpDate) < today);
      const todayDue = pending.filter(l => {
        const d = new Date(l.followUpDate);
        return d >= today && d < tomorrow;
      });

      const recentLeads = (recentRes.data.leads || []).slice(0, 3);

      const items = [
        ...overdue.slice(0, 3).map(l => ({
          id: `overdue-${l._id}`,
          type: 'overdue',
          icon: AlertTriangle,
          color: '#f87171',
          bg: 'rgba(248,113,113,0.1)',
          title: `Overdue: ${l.name}`,
          subtitle: `Follow-up was due ${new Date(l.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
          leadId: l._id,
          time: new Date(l.followUpDate),
        })),
        ...todayDue.slice(0, 3).map(l => ({
          id: `today-${l._id}`,
          type: 'today',
          icon: Clock,
          color: '#fbbf24',
          bg: 'rgba(251,191,36,0.1)',
          title: `Due Today: ${l.name}`,
          subtitle: `Scheduled follow-up · ${l.inquiryType || 'General'}`,
          leadId: l._id,
          time: new Date(l.followUpDate),
        })),
        ...recentLeads.map(l => ({
          id: `new-${l._id}`,
          type: 'new_lead',
          icon: Users,
          color: '#60a5fa',
          bg: 'rgba(96,165,250,0.1)',
          title: `New Lead: ${l.name}`,
          subtitle: `Added via ${l.source || 'Unknown'} · ${l.status}`,
          leadId: l._id,
          time: new Date(l.createdAt),
        })),
      ].sort((a, b) => {
        // Overdue first, then by date
        const priority = { overdue: 0, today: 1, new_lead: 2 };
        return priority[a.type] - priority[b.type] || b.time - a.time;
      });

      setNotifications(items);
      setUnreadCount(overdue.length + todayDue.length);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and every 2 minutes
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 120_000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleNotifClick = (notif) => {
    navigate(`/leads/${notif.leadId}`);
    setOpen(false);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0)  return `${days}d ago`;
    if (hrs > 0)   return `${hrs}h ago`;
    if (mins > 0)  return `${mins}m ago`;
    return 'Just now';
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        id="notification-bell"
        onClick={() => { setOpen(o => !o); }}
        style={{
          width: 38, height: 38,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 10,
          background: open ? 'rgba(245,176,65,0.1)' : 'rgba(255,255,255,0.04)',
          border: open ? '1px solid rgba(245,176,65,0.3)' : '1px solid var(--border)',
          color: open ? 'var(--gold)' : 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -3, right: -3,
            minWidth: 16, height: 16, borderRadius: 8,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            fontSize: '0.6rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px',
            boxShadow: '0 0 8px rgba(245,158,11,0.6)',
            border: '1.5px solid #111',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{    opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: 340,
              background: '#111',
              border: '1px solid rgba(245,176,65,0.15)',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              zIndex: 300,
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(245,176,65,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={14} style={{ color: 'var(--gold)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span style={{
                    padding: '1px 8px', borderRadius: 20,
                    background: 'rgba(245,176,65,0.15)',
                    color: 'var(--gold)',
                    fontSize: '0.7rem', fontWeight: 700,
                    border: '1px solid rgba(245,176,65,0.2)',
                  }}>
                    {unreadCount} urgent
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); fetchNotifications(); }}
                  title="Refresh"
                  style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-hint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-hint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={11} />
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {loading && notifications.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <RefreshCw size={24} style={{ color: 'var(--text-hint)', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading notifications…</p>
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <CheckCircle size={28} style={{ color: 'var(--gold)', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>All caught up!</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>No overdue or pending follow-ups</p>
                </div>
              ) : (
                notifications.map((notif, i) => {
                  const Icon = notif.icon;
                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: i < notifications.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                        background: notif.bg,
                        border: `1px solid ${notif.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: 1,
                      }}>
                        <Icon size={14} style={{ color: notif.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {notif.title}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {notif.subtitle}
                        </p>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-hint)', flexShrink: 0, marginTop: 2 }}>
                        {timeAgo(notif.time)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => { navigate('/followups'); setOpen(false); }}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  borderRadius: 8,
                  background: 'rgba(245,176,65,0.06)',
                  border: '1px solid rgba(245,176,65,0.15)',
                  color: 'var(--gold)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.06)'; }}
              >
                View All Follow-Ups →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
