import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAnalytics, getLeads } from '../services/api';
import StatCard from '../components/StatCard';
import { StatusBadge } from '../components/Badges';
import {
  Users, UserPlus, PhoneCall, TrendingUp, Clock, Star,
  ArrowRight, ArrowUpRight, Activity, Phone,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#f5b041', '#3b82f6', '#a855f7', '#22c55e', '#ef4444', '#f59e0b'];

const tooltipStyle = {
  background: 'rgba(10,10,12,0.96)',
  border: '1px solid rgba(245,176,65,0.3)',
  borderRadius: 10,
  color: '#fff',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  fontSize: 12,
  padding: '10px 14px',
  fontFamily: "'Inter', sans-serif",
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, lRes] = await Promise.all([
          getAnalytics(),
          getLeads({ limit: 6, sort: '-createdAt' }),
        ]);
        setAnalytics(aRes.data.analytics);
        setRecentLeads(lRes.data.leads);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = analytics ? [
    { label: 'Total Leads',    value: analytics.total,            icon: Users,     color: '#f5b041', subtitle: 'All time' },
    { label: 'New Leads',      value: analytics.newLeads,         icon: UserPlus,  color: '#3b82f6', subtitle: 'Awaiting contact' },
    { label: 'Contacted',      value: analytics.contacted,        icon: PhoneCall, color: '#f59e0b', subtitle: 'In progress' },
    { label: 'Converted',      value: analytics.converted,        icon: TrendingUp,color: '#22c55e', subtitle: `${analytics.conversionRate}% rate` },
    { label: 'Hot Leads',      value: analytics.interested,       icon: Star,      color: '#a855f7', subtitle: 'High interest' },
    { label: 'Follow-Ups Due', value: analytics.pendingFollowUps, icon: Clock,     color: '#ef4444', subtitle: 'Action required' },
  ] : [];

  const sourceData = analytics?.leadsBySource?.map(s => ({ name: s._id, value: s.count })) || [];
  const dailyData  = analytics?.dailyLeads?.map(d => ({ date: d._id.slice(5), leads: d.count })) || [];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Stat cards skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer" style={{ height: 150 }} />
          ))}
        </div>
        {/* Charts skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div className="shimmer" style={{ height: 280 }} />
          <div className="shimmer" style={{ height: 280 }} />
        </div>
        {/* Table skeleton */}
        <div className="shimmer" style={{ height: 300 }} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      {/* ── Greeting ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1
            className="font-poppins"
            style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}
          >
            {getGreeting()},{' '}
            <span className="gradient-text">{user?.username}</span>
            {' '}👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            Here's what's happening with your leads today
          </p>
        </div>
        <Link
          to="/leads/new"
          className="btn-primary"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 12,
            textDecoration: 'none',
          }}
        >
          <UserPlus size={15} strokeWidth={2.2} />
          <span>New Lead</span>
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </section>

      {/* ── Analytics Grid: Chart + Source ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-chart"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                className="icon-box"
                style={{ width: 36, height: 36, background: 'rgba(245,176,65,0.12)', border: '1px solid rgba(245,176,65,0.2)', borderRadius: 10 }}
              >
                <Activity size={16} color="var(--gold)" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Poppins', sans-serif" }}>
                  Lead Activity
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 7 days</p>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.72rem', fontWeight: 600,
                padding: '4px 10px', borderRadius: 6,
                background: 'rgba(34,197,94,0.1)',
                color: '#4ade80',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              ↑ Last 7 days
            </span>
          </div>

          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f5b041" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f5b041" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(245,176,65,0.2)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#f5b041"
                  strokeWidth={2.5}
                  fill="url(#goldGrad)"
                  dot={{ fill: '#f5b041', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#f8c571', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: 200 }}>
              <Activity size={28} color="var(--text-hint)" />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No data for the last 7 days</p>
            </div>
          )}
        </motion.div>

        {/* Donut Chart – Leads by Source */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="card-chart"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div
              className="icon-box"
              style={{ width: 36, height: 36, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 10 }}
            >
              <TrendingUp size={16} color="var(--purple)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Poppins', sans-serif" }}>
                Leads by Source
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead origins</p>
            </div>
          </div>

          {sourceData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    cx="50%" cy="50%"
                    outerRadius={62} innerRadius={38}
                    strokeWidth={0} paddingAngle={3}
                  >
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {sourceData.slice(0, 4).map((s, i) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                        {s.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', tabularNums: true }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ height: 200 }}>
              <p style={{ fontSize: '0.875rem' }}>No source data yet</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* ── Recent Leads Table ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              className="icon-box"
              style={{ width: 36, height: 36, background: 'rgba(245,176,65,0.1)', border: '1px solid rgba(245,176,65,0.2)', borderRadius: 10 }}
            >
              <Users size={16} color="var(--gold)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Poppins', sans-serif" }}>
                Recent Leads
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Latest {recentLeads.length} entries
              </p>
            </div>
          </div>
          <Link
            to="/leads"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.8rem', fontWeight: 600,
              color: 'var(--gold)',
              textDecoration: 'none',
              transition: 'gap 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.gap = '10px'; }}
            onMouseLeave={e => { e.currentTarget.style.gap = '6px'; }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Source', 'Status', 'Follow Up', 'Added On', 'Action'].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state" style={{ padding: '48px 24px' }}>
                      <Users size={32} color="var(--text-hint)" />
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No recent leads found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead, i) => (
                  <motion.tr
                    key={lead._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="table-row"
                  >
                    {/* Name */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          className="avatar"
                          style={{ width: 30, height: 30, fontSize: '0.7rem', flexShrink: 0 }}
                        >
                          {lead.name?.[0]?.toUpperCase()}
                        </div>
                        <Link
                          to={`/leads/${lead._id}`}
                          style={{
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                        >
                          {lead.name}
                        </Link>
                      </div>
                    </td>

                    {/* Source */}
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {lead.source}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 20px' }}>
                      <StatusBadge status={lead.status} />
                    </td>

                    {/* Follow Up */}
                    <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {lead.followUpDate
                        ? new Date(lead.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </td>

                    {/* Added On */}
                    <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Link
                          to={`/leads/${lead._id}`}
                          className="icon-box"
                          style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: 'rgba(245,176,65,0.08)',
                            color: 'var(--gold)',
                            border: '1px solid rgba(245,176,65,0.2)',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                          title="View"
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.16)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.08)'; }}
                        >
                          <ArrowUpRight size={13} />
                        </Link>
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="icon-box"
                            style={{
                              width: 30, height: 30, borderRadius: 8,
                              background: 'rgba(34,197,94,0.08)',
                              color: '#4ade80',
                              border: '1px solid rgba(34,197,94,0.2)',
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                            }}
                            title="Call"
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.16)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.08)'; }}
                          >
                            <Phone size={12} />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </motion.div>
  );
}
