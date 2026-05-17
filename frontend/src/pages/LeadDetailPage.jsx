import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLead, updateLead, addNote, deleteNote } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { ArrowLeft, Edit2, Save, X, Plus, Trash2, Phone, Mail, Clock, MessageSquare, User } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['New', 'Contacted', 'Interested', 'Converted', 'Closed'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const SOURCES = ['Website Contact Form', 'Instagram', 'Facebook', 'Walk-in', 'Catering Inquiry', 'Event Booking'];
const INQUIRY_TYPES = ['Table Booking', 'Catering', 'Event', 'General Inquiry', 'Feedback', 'Other'];

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  const fetchLead = async () => {
    try {
      const res = await getLead(id);
      setLead(res.data.lead);
      setEditForm({
        name: res.data.lead.name, email: res.data.lead.email,
        phone: res.data.lead.phone || '', status: res.data.lead.status,
        priority: res.data.lead.priority, source: res.data.lead.source,
        inquiryType: res.data.lead.inquiryType, message: res.data.lead.message || '',
        followUpDate: res.data.lead.followUpDate ? res.data.lead.followUpDate.slice(0, 10) : '',
      });
    } catch {
      toast.error('Lead not found');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateLead(id, editForm);
      setLead(res.data.lead);
      setEditing(false);
      toast.success('Lead updated successfully');
    } catch {
      toast.error('Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await addNote(id, { content: newNote });
      setLead(res.data.lead);
      setNewNote('');
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await deleteNote(id, noteId);
      setLead(res.data.lead);
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="glass-card p-6 h-32 shimmer" />)}
      </div>
    );
  }

  if (!lead) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => navigate('/leads')} className="flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Leads
        </button>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)' }}>
                <X size={15} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
                <Save size={15} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ background: 'rgba(212,168,83,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,168,83,0.2)' }}>
              <Edit2 size={15} /> Edit Lead
            </button>
          )}
        </div>
      </div>

      {/* Lead Info Card */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, var(--gold), var(--coffee-warm))', color: '#1a0a00' }}>
              {lead.name[0].toUpperCase()}
            </div>
            <div>
              {editing ? (
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-dark px-3 py-1.5 rounded-lg text-lg font-bold w-full" />
              ) : (
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{lead.name}</h2>
              )}
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Created {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {editing ? (
              <>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="input-dark px-3 py-1.5 rounded-lg text-sm">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={editForm.priority} onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                  className="input-dark px-3 py-1.5 rounded-lg text-sm">
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </>
            ) : (
              <>
                <StatusBadge status={lead.status} />
                <PriorityBadge priority={lead.priority} />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Contact</h3>
            <div className="flex items-center gap-3">
              <Mail size={15} style={{ color: 'var(--gold)' }} />
              {editing ? (
                <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="input-dark px-3 py-1.5 rounded-lg text-sm flex-1" />
              ) : (
                <a href={`mailto:${lead.email}`} className="text-sm hover:underline" style={{ color: 'var(--text-secondary)' }}>{lead.email}</a>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Phone size={15} style={{ color: 'var(--gold)' }} />
              {editing ? (
                <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="input-dark px-3 py-1.5 rounded-lg text-sm flex-1" placeholder="Phone number" />
              ) : (
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lead.phone || '—'}</span>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Lead Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Source</p>
                {editing ? (
                  <select value={editForm.source} onChange={e => setEditForm({ ...editForm, source: e.target.value })}
                    className="input-dark px-2 py-1 rounded-lg text-xs w-full">
                    {SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>{lead.source}</p>
                )}
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Inquiry Type</p>
                {editing ? (
                  <select value={editForm.inquiryType} onChange={e => setEditForm({ ...editForm, inquiryType: e.target.value })}
                    className="input-dark px-2 py-1 rounded-lg text-xs w-full">
                    {INQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>{lead.inquiryType}</p>
                )}
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Follow-Up</p>
                {editing ? (
                  <input type="date" value={editForm.followUpDate} onChange={e => setEditForm({ ...editForm, followUpDate: e.target.value })}
                    className="input-dark px-2 py-1 rounded-lg text-xs w-full" />
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString('en-IN') : '—'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {(lead.message || editing) && (
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Message</p>
            {editing ? (
              <textarea value={editForm.message} onChange={e => setEditForm({ ...editForm, message: e.target.value })} rows={3}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lead.message || '—'}</p>
            )}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} style={{ color: 'var(--gold)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notes & Activity</h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,168,83,0.15)', color: 'var(--gold)' }}>
            {lead.notes.length}
          </span>
        </div>

        {/* Add Note */}
        <div className="flex gap-3 mb-5">
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            rows={2}
            placeholder="Add an internal note..."
            className="input-dark flex-1 px-4 py-3 rounded-xl text-sm resize-none"
            onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleAddNote()}
          />
          <button onClick={handleAddNote} disabled={addingNote || !newNote.trim()}
            className="btn-primary px-4 rounded-xl disabled:opacity-40 flex items-center gap-1 text-sm">
            <Plus size={16} /> {addingNote ? '...' : 'Add'}
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {lead.notes.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>No notes yet. Add your first note above.</p>
          ) : (
            [...lead.notes].reverse().map((note) => (
              <motion.div key={note._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(61,31,0,0.3)', border: '1px solid var(--border-subtle)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: 'rgba(212,168,83,0.2)', color: 'var(--gold)' }}>
                  <User size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>{note.createdBy}</span>
                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={11} /> {new Date(note.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{note.content}</p>
                </div>
                <button onClick={() => handleDeleteNote(note._id)} className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LeadDetailPage;
