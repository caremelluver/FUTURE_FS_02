import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getLeads, deleteLead, updateLead } from '../services/api';
import { StatusBadge, PriorityBadge, SkeletonRow } from '../components/Badges';
import {
  Search, Plus, Trash2, Edit2, ChevronLeft, ChevronRight,
  Download, Eye, SlidersHorizontal, Users, Check, X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['', 'New', 'Contacted', 'Interested', 'Converted', 'Closed'];
const SOURCES  = ['', 'Website Contact Form', 'Instagram', 'Facebook', 'Walk-in', 'Catering Inquiry', 'Event Booking'];

const LeadsPage = () => {
  const [leads, setLeads]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [searchInput, setSearchInput]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [deleteModal, setDeleteModal]   = useState(null);
  const [quickEditId, setQuickEditId]   = useState(null);
  const [quickStatus, setQuickStatus]   = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeads({ search, status: statusFilter, source: sourceFilter, page, limit: 10, sort: '-createdAt' });
      setLeads(res.data.leads);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await deleteLead(deleteModal._id);
      toast.success(`Lead "${deleteModal.name}" deleted`);
      setDeleteModal(null);
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const handleQuickStatusSave = async () => {
    try {
      await updateLead(quickEditId, { status: quickStatus });
      toast.success('Status updated');
      setQuickEditId(null);
      fetchLeads();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const exportCSV = () => {
    if (!leads.length) return toast.error('No leads to export');
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Inquiry Type', 'Status', 'Priority', 'Created At'];
    const rows = leads.map(l => [l.name, l.email, l.phone, l.source, l.inquiryType, l.status, l.priority, new Date(l.createdAt).toLocaleDateString()]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'starcafe_leads.csv'; a.click();
    toast.success('Leads exported to CSV');
  };

  const hasFilters = statusFilter || sourceFilter || searchInput;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Loading…' : `${total} lead${total !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="btn-secondary flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          >
            <Download size={14} strokeWidth={2} />
            <span>Export CSV</span>
          </button>
          <Link to="/leads/new" className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl">
            <Plus size={15} strokeWidth={2.5} />
            <span>New Lead</span>
          </Link>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-hint)' }} />
            <input
              type="text"
              placeholder="Search name, email, phone…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-dark w-full pl-9 pr-4 py-2.5 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-hint)' }} />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="input-dark pl-8 pr-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer min-w-[145px]"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
              </select>
            </div>

            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
              className="input-dark px-3.5 py-2.5 rounded-xl text-sm appearance-none cursor-pointer min-w-[155px]"
            >
              {SOURCES.map(s => <option key={s} value={s}>{s || 'All Sources'}</option>)}
            </select>

            {hasFilters && (
              <button
                onClick={() => { setStatusFilter(''); setSourceFilter(''); setSearchInput(''); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                style={{ background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid rgba(229,92,92,0.2)' }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {['Customer', 'Source', 'Inquiry', 'Status', 'Priority', 'Date', 'Actions'].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase"
                    style={{ color: 'var(--text-hint)', letterSpacing: '0.07em' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state py-16">
                      <Users size={32} style={{ color: 'var(--text-hint)' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No leads found</p>
                      <p className="text-xs" style={{ color: 'var(--text-hint)' }}>
                        {hasFilters ? 'Try clearing your filters' : 'Add your first lead to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead, i) => (
                  <motion.tr
                    key={lead._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="table-row group"
                  >
                    {/* Customer */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="avatar w-7 h-7 flex-shrink-0"
                          style={{ fontSize: '0.65rem' }}
                        >
                          {lead.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <Link
                            to={`/leads/${lead._id}`}
                            className="font-semibold hover:underline"
                            style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}
                          >
                            {lead.name}
                          </Link>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{lead.email}</p>
                          {lead.phone && <p className="text-xs font-mono" style={{ color: 'var(--text-hint)' }}>{lead.phone}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Source */}
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs px-2.5 py-1 rounded-lg font-medium"
                        style={{ background: 'rgba(245,176,65,0.07)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      >
                        {lead.source}
                      </span>
                    </td>
                    {/* Inquiry */}
                    <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {lead.inquiryType}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      {quickEditId === lead._id ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={quickStatus}
                            onChange={e => setQuickStatus(e.target.value)}
                            className="input-dark text-xs px-2 py-1.5 rounded-lg"
                          >
                            {['New', 'Contacted', 'Interested', 'Converted', 'Closed'].map(s => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={handleQuickStatusSave}
                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                            style={{ background: 'var(--success-dim)', color: 'var(--success)' }}
                          >
                            <Check size={12} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => setQuickEditId(null)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                            style={{ background: 'var(--danger-dim)', color: 'var(--danger)' }}
                          >
                            <X size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => { setQuickEditId(lead._id); setQuickStatus(lead.status); }}>
                          <StatusBadge status={lead.status} />
                        </button>
                      )}
                    </td>
                    {/* Priority */}
                    <td className="px-5 py-3.5"><PriorityBadge priority={lead.priority} /></td>
                    {/* Date */}
                    <td className="px-5 py-3.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/leads/${lead._id}`}
                          className="icon-box w-7 h-7 rounded-lg transition-all"
                          style={{ background: 'rgba(201,151,62,0.08)', color: 'var(--gold)', border: '1px solid rgba(201,151,62,0.15)' }}
                          title="View"
                        >
                          <Eye size={13} />
                        </Link>
                        <Link
                          to={`/leads/${lead._id}/edit`}
                          className="icon-box w-7 h-7 rounded-lg transition-all"
                          style={{ background: 'rgba(91,158,245,0.08)', color: 'var(--info)', border: '1px solid rgba(91,158,245,0.15)' }}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal(lead)}
                          className="icon-box w-7 h-7 rounded-lg transition-all"
                          style={{ background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid rgba(229,92,92,0.2)' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Page <span style={{ color: 'var(--text-secondary)' }}>{page}</span> of {totalPages}
              {' · '}
              <span style={{ color: 'var(--gold)' }}>{total}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="icon-box w-8 h-8 rounded-lg disabled:opacity-30 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="icon-box w-8 h-8 rounded-lg disabled:opacity-30 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-sm"
              onClick={e => e.stopPropagation()}
              style={{
                background: '#151515',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--danger-dim)', border: '1px solid rgba(229,92,92,0.25)' }}
              >
                <Trash2 size={20} style={{ color: 'var(--danger)' }} />
              </div>
              <h3 className="font-bold text-lg text-center mb-1" style={{ color: 'var(--text-primary)' }}>
                Delete Lead
              </h3>
              <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>
                Are you sure you want to delete{' '}
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{deleteModal.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="btn-ghost flex-1 py-2.5 rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-danger flex-1 py-2.5 rounded-xl text-sm font-semibold"
                >
                  Delete Lead
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeadsPage;
