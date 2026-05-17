import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAnalytics } from '../services/api';
import { BarChart3, TrendingUp, Users, Target, Zap, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';

const COLORS = ['#f5b041', '#3b82f6', '#a855f7', '#22c55e', '#ef4444', '#f59e0b', '#06b6d4'];

const STATUS_COLORS = {
  New:        '#3b82f6',
  Contacted:  '#f59e0b',
  Interested: '#a855f7',
  Converted:  '#22c55e',
  Closed:     '#ef4444',
};

const tooltipStyle = {
  background: 'rgba(10,10,12,0.97)',
  border: '1px solid rgba(245,176,65,0.3)',
  borderRadius: 10,
  color: '#fff',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  fontSize: 12,
  padding: '10px 14px',
  fontFamily: "'Inter', sans-serif",
};

const SectionTitle = ({ icon: Icon, title, subtitle, color = 'var(--gold)', bg = 'rgba(245,176,65,0.12)', border = 'rgba(245,176,65,0.2)' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div
      className="icon-box"
      style={{ width: 36, height: 36, background: bg, border: `1px solid ${border}`, borderRadius: 10 }}
    >
      <Icon size={16} color={color} strokeWidth={2} />
    </div>
    <div>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Poppins', sans-serif" }}>
        {title}
      </h3>
      {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
  </div>
);

const KpiCard = ({ label, value, icon: Icon, color, bg, border, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card"
    style={{ height: 120 }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </p>
      <div className="icon-box" style={{ width: 32, height: 32, background: bg, border: `1px solid ${border}`, borderRadius: 9 }}>
        <Icon size={14} color={color} strokeWidth={2} />
      </div>
    </div>
    <p className="stat-number gradient-text" style={{ fontSize: '2rem' }}>{value}</p>
  </motion.div>
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(res => setAnalytics(res.data.analytics))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 120 }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[...Array(2)].map((_, i) => <div key={i} className="shimmer" style={{ height: 280 }} />)}
        </div>
        <div className="shimmer" style={{ height: 260 }} />
        <div className="shimmer" style={{ height: 260 }} />
      </div>
    );
  }

  const statusData = [
    { name: 'New',        value: analytics.newLeads   },
    { name: 'Contacted',  value: analytics.contacted  },
    { name: 'Interested', value: analytics.interested },
    { name: 'Converted',  value: analytics.converted  },
    { name: 'Closed',     value: analytics.closed     },
  ].filter(d => d.value > 0);

  const sourceData  = analytics.leadsBySource.map(s => ({ name: s._id, value: s.count }));
  const inquiryData = analytics.leadsByInquiry.map(i => ({ name: i._id, count: i.count }));
  const dailyData   = analytics.dailyLeads.map(d => ({ date: d._id.slice(5), leads: d.count }));

  const kpis = [
    { label: 'Total Leads',       value: analytics.total,           icon: Users,     color: 'var(--gold)',    bg: 'rgba(245,176,65,0.1)',    border: 'rgba(245,176,65,0.25)' },
    { label: 'Conversion Rate',   value: `${analytics.conversionRate}%`, icon: Target, color: 'var(--success)', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
    { label: 'Converted Leads',   value: analytics.converted,       icon: TrendingUp,color: 'var(--info)',    bg: 'rgba(59,130,246,0.1)',    border: 'rgba(59,130,246,0.25)' },
    { label: 'Pending Follow-Ups',value: analytics.pendingFollowUps,icon: Zap,       color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)',     border: 'rgba(239,68,68,0.25)' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div>
        <h1 className="page-title">Analytics</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6 }}>
          Performance insights for your lead pipeline
        </p>
      </div>

      {/* KPI Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 0.07} />)}
      </section>

      {/* Charts Row 1 */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Status Donut */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-chart">
          <SectionTitle icon={Activity} title="Lead Status Breakdown" subtitle="Current pipeline distribution" />
          {statusData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <ResponsiveContainer width="55%" height={190}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={74} innerRadius={46} strokeWidth={0} paddingAngle={3}>
                    {statusData.map(d => <Cell key={d.name} fill={STATUS_COLORS[d.name]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {statusData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[d.name] }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ height: 200 }}><p>No status data</p></div>
          )}
        </motion.div>

        {/* Source Horizontal Bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="card-chart">
          <SectionTitle icon={BarChart3} title="Leads by Source" subtitle="Which channels bring leads" color="var(--purple)" bg="rgba(168,85,247,0.12)" border="rgba(168,85,247,0.2)" />
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sourceData} layout="vertical" barCategoryGap="25%">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#4b5563' }} axisLine={false} tickLine={false} width={115} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: 200 }}><p>No source data</p></div>
          )}
        </motion.div>
      </section>

      {/* Daily Trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="card-chart">
        <SectionTitle icon={TrendingUp} title="Lead Generation Trend" subtitle="Last 7 days" color="var(--success)" bg="rgba(34,197,94,0.12)" border="rgba(34,197,94,0.2)" />
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(34,197,94,0.2)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="leads" stroke="#22c55e" strokeWidth={2.5} fill="url(#trendGrad)"
                dot={{ fill: '#22c55e', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#4ade80', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ height: 220 }}><p>No trend data</p></div>
        )}
      </motion.div>

      {/* Inquiry Distribution */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }} className="card-chart">
        <SectionTitle icon={BarChart3} title="Inquiry Type Distribution" subtitle="What customers are asking about" color="var(--info)" bg="rgba(59,130,246,0.12)" border="rgba(59,130,246,0.2)" />
        {inquiryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={inquiryData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {inquiryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ height: 210 }}><p>No inquiry data</p></div>
        )}
      </motion.div>
    </motion.div>
  );
}
