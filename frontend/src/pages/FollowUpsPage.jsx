import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLeads, updateLead } from '../services/api';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { PriorityBadge } from '../components/Badges';
import toast from 'react-hot-toast';

const FollowUpsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, overdue, today, upcoming

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const res = await getLeads({ limit: 100, sort: 'followUpDate' });
      const withFollowUps = res.data.leads.filter(l => l.followUpDate && !l.followUpCompleted);
      setLeads(withFollowUps);
    } catch {
      toast.error('Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (lead) => {
    try {
      await updateLead(lead._id, { followUpCompleted: true });
      toast.success('Follow-up marked complete!');
      fetchFollowUps();
    } catch {
      toast.error('Failed to update');
    }
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);

  const categorize = (lead) => {
    const due = new Date(lead.followUpDate);
    if (due < today) return 'overdue';
    if (due >= today && due < tomorrow) return 'today';
    if (due >= tomorrow && due <= nextWeek) return 'upcoming';
    return 'future';
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => categorize(l) === filter);

  const counts = {
    all: leads.length,
    overdue: leads.filter(l => categorize(l) === 'overdue').length,
    today: leads.filter(l => categorize(l) === 'today').length,
    upcoming: leads.filter(l => categorize(l) === 'upcoming').length,
  };

  const tabStyle = (t) => filter === t
    ? { background: 'rgba(245,176,65,0.12)', color: 'var(--gold)', border: '1px solid rgba(245,176,65,0.3)' }
    : { color: 'var(--text-muted)', border: '1px solid transparent' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Follow-Ups</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage pending follow-up tasks</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All', icon: Bell },
          { key: 'overdue', label: 'Overdue', icon: AlertTriangle },
          { key: 'today', label: 'Today', icon: Clock },
          { key: 'upcoming', label: 'Upcoming', icon: CheckCircle },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setFilter(key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={tabStyle(key)}>
            <Icon size={15} />
            {label}
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Follow-up list */}
      <div className="space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="card" style={{ height: 80, padding: 16 }} />)
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle size={40} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>All caught up!</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>No follow-ups in this category</p>
          </div>
        ) : (
          filtered.map((lead) => {
            const cat = categorize(lead);
            const dueDate = new Date(lead.followUpDate);
            const catColors = {
              overdue: '#f87171',
              today: '#fbbf24',
              upcoming: '#60a5fa',
              future: 'var(--text-muted)',
            };
            const catLabels = {
              overdue: '⚠️ Overdue',
              today: '📅 Today',
              upcoming: '📆 Upcoming',
              future: '🗓️ Future',
            };
            return (
              <motion.div key={lead._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ background: `${catColors[cat]}20`, color: catColors[cat], border: `1px solid ${catColors[cat]}30` }}>
                    {lead.name[0].toUpperCase()}
                  </div>
                  <div>
                    <Link to={`/leads/${lead._id}`} className="font-semibold text-sm hover:underline" style={{ color: 'var(--text-primary)' }}>
                      {lead.name}
                    </Link>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{lead.email}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-medium" style={{ color: catColors[cat] }}>{catLabels[cat]}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <PriorityBadge priority={lead.priority} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{lead.inquiryType}</span>
                  <button onClick={() => markComplete(lead)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
                    <CheckCircle size={13} /> Mark Done
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default FollowUpsPage;
