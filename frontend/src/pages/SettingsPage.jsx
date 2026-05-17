import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';
import { Settings, User, Lock, Shield, Bell, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({ email: true, followUp: true, newLead: false });
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '', role: 'admin' });
  const [creating, setCreating] = useState(false);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) return toast.error('All fields required');
    setCreating(true);
    try {
      await register(newAdmin);
      toast.success('Admin user created successfully!');
      setNewAdmin({ username: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const tabs = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'admin', label: 'Admin Users', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'appearance', label: 'Appearance', icon: Sun },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage your CRM preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={activeTab === key
              ? { background: 'rgba(212,168,83,0.15)', color: 'var(--gold)', border: '1px solid rgba(212,168,83,0.3)' }
              : { color: 'var(--text-muted)' }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="glass-card p-6 space-y-5">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Account Information</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: 'linear-gradient(135deg, var(--gold), var(--coffee-warm))', color: '#1a0a00' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{user?.username}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block capitalize"
                style={{ background: 'rgba(212,168,83,0.15)', color: 'var(--gold)' }}>{user?.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Username</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user?.username}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Email</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Role</p>
              <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Users Tab */}
      {activeTab === 'admin' && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={18} style={{ color: 'var(--gold)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Create Admin User</h3>
          </div>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Username</label>
                <input value={newAdmin.username} onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" placeholder="john_admin" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" placeholder="john@starcafe.com" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Role</label>
                <select value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="input-dark w-full px-4 py-2.5 rounded-xl text-sm">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={creating} className="btn-primary px-6 py-2.5 rounded-xl text-sm">
              {creating ? 'Creating...' : 'Create Admin User'}
            </button>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h3>
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Get email alerts for new leads' },
            { key: 'followUp', label: 'Follow-Up Reminders', desc: 'Daily reminders for pending follow-ups' },
            { key: 'newLead', label: 'New Lead Alerts', desc: 'Real-time alerts when a new lead is created' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(61,31,0,0.3)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
              <button onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                className="w-12 h-6 rounded-full relative transition-all duration-300"
                style={{ background: notifications[key] ? 'var(--gold)' : 'rgba(255,255,255,0.1)' }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300"
                  style={{ left: notifications[key] ? '26px' : '2px' }} />
              </button>
            </div>
          ))}
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            * Email notifications are simulated in this demo
          </p>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</h3>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(61,31,0,0.3)' }}>
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={18} style={{ color: 'var(--gold)' }} /> : <Sun size={18} style={{ color: 'var(--gold)' }} />}
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {darkMode ? 'Currently using premium dark theme' : 'Switch to light theme'}
                </p>
              </div>
            </div>
            <button onClick={() => { setDarkMode(!darkMode); toast('Theme switching coming soon!', { icon: '🎨' }); }}
              className="w-12 h-6 rounded-full relative transition-all duration-300"
              style={{ background: darkMode ? 'var(--gold)' : 'rgba(255,255,255,0.1)' }}>
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300"
                style={{ left: darkMode ? '26px' : '2px' }} />
            </button>
          </div>

          <div className="p-4 rounded-xl" style={{ background: 'rgba(61,31,0,0.3)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Color Theme</p>
            <div className="flex gap-2">
              {['#d4a853', '#60a5fa', '#4ade80', '#a78bfa', '#f87171'].map(c => (
                <button key={c} onClick={() => toast('Custom themes coming soon!', { icon: '🎨' })}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ background: c, borderColor: c === '#d4a853' ? 'white' : 'transparent' }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SettingsPage;
