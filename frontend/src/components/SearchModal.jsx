import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { getLeads } from '../services/api';
import { StatusBadge } from './Badges';

const SearchModal = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [recent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crm_recent_searches') || '[]'); }
    catch { return []; }
  });
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await getLeads({ search: query, limit: 8 });
        setResults(res.data.leads || []);
        setSelected(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const saveRecent = useCallback((lead) => {
    const prev = JSON.parse(localStorage.getItem('crm_recent_searches') || '[]');
    const updated = [{ _id: lead._id, name: lead.name, email: lead.email }, ...prev.filter(r => r._id !== lead._id)].slice(0, 5);
    localStorage.setItem('crm_recent_searches', JSON.stringify(updated));
  }, []);

  const goToLead = useCallback((lead) => {
    saveRecent(lead);
    navigate(`/leads/${lead._id}`);
    onClose();
  }, [navigate, onClose, saveRecent]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const list = results.length ? results : [];
    const handleKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, list.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && list[selected]) { goToLead(list[selected]); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, results, selected, onClose, goToLead]);

  const displayList = query.trim() ? results : recent;
  const isRecentMode = !query.trim();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: -16, opacity: 0 }}
            animate={{ scale: 1,    y: 0,   opacity: 1 }}
            exit={{    scale: 0.94, y: -16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 560,
              background: '#111',
              border: '1px solid rgba(245,176,65,0.2)',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,176,65,0.05)',
            }}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {loading
                ? <Loader2 size={17} style={{ color: 'var(--gold)', flexShrink: 0 }} className="animate-spin" />
                : <Search size={17} style={{ color: query ? 'var(--gold)' : 'var(--text-hint)', flexShrink: 0 }} />
              }
              <input
                ref={inputRef}
                type="text"
                placeholder="Search leads by name, email or phone…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ color: 'var(--text-hint)', cursor: 'pointer', background: 'none', border: 'none', display: 'flex' }}>
                  <X size={15} />
                </button>
              )}
              <kbd style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-hint)', fontSize: '0.7rem', fontFamily: 'monospace', flexShrink: 0 }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {/* Section label */}
              {displayList.length > 0 && (
                <div style={{ padding: '10px 18px 6px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {isRecentMode ? 'Recent Searches' : `${results.length} result${results.length !== 1 ? 's' : ''}`}
                </div>
              )}

              {displayList.map((lead, i) => (
                <button
                  key={lead._id}
                  onClick={() => goToLead(lead)}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 18px',
                    background: selected === i ? 'rgba(245,176,65,0.08)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s',
                    borderLeft: selected === i ? '2px solid var(--gold)' : '2px solid transparent',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: selected === i ? 'rgba(245,176,65,0.15)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700,
                    color: selected === i ? 'var(--gold)' : 'var(--text-muted)',
                    border: `1px solid ${selected === i ? 'rgba(245,176,65,0.25)' : 'transparent'}`,
                  }}>
                    {lead.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{lead.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {lead.status && <StatusBadge status={lead.status} />}
                    {isRecentMode
                      ? <Clock size={13} style={{ color: 'var(--text-hint)' }} />
                      : <ArrowRight size={13} style={{ color: selected === i ? 'var(--gold)' : 'var(--text-hint)', opacity: selected === i ? 1 : 0, transition: 'opacity 0.15s' }} />
                    }
                  </div>
                </button>
              ))}

              {/* Empty state */}
              {!loading && query.trim() && results.length === 0 && (
                <div style={{ padding: '32px 18px', textAlign: 'center' }}>
                  <Users size={28} style={{ color: 'var(--text-hint)', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>No leads found for "<strong>{query}</strong>"</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-hint)', marginTop: 4 }}>Try a different name, email, or phone number</p>
                </div>
              )}

              {/* Initial empty (no query, no recent) */}
              {!query.trim() && recent.length === 0 && (
                <div style={{ padding: '32px 18px', textAlign: 'center' }}>
                  <Search size={28} style={{ color: 'var(--text-hint)', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Start typing to search leads</p>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div style={{ padding: '8px 18px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 16, alignItems: 'center' }}>
              {[['↑↓', 'Navigate'], ['↵', 'Open'], ['Esc', 'Close']].map(([key, label]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: 'var(--text-hint)' }}>
                  <kbd style={{ padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>{key}</kbd>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
