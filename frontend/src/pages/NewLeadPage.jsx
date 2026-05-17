import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createLead } from '../services/api';
import toast from 'react-hot-toast';
import { UserPlus, ArrowLeft } from 'lucide-react';

const SOURCES = ['Website Contact Form', 'Instagram', 'Facebook', 'Walk-in', 'Catering Inquiry', 'Event Booking'];
const INQUIRY_TYPES = ['Table Booking', 'Catering', 'Event', 'General Inquiry', 'Feedback', 'Other'];
const STATUSES = ['New', 'Contacted', 'Interested', 'Converted', 'Closed'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const NewLeadPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: 'Website Contact Form',
    inquiryType: 'General Inquiry', message: '', status: 'New',
    priority: 'Medium', followUpDate: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error('Name and email are required');
    setLoading(true);
    try {
      await createLead(form);
      toast.success('Lead created successfully!');
      navigate('/leads');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, required }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input type={type} name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder} required={required}
        className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" />
    </div>
  );

  const Select = ({ label, name, options }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <select name={name} value={form[name]} onChange={handleChange}
        className="input-dark w-full px-4 py-2.5 rounded-xl text-sm">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
      <button onClick={() => navigate('/leads')} className="flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={16} /> Back to Leads
      </button>

      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--coffee-warm))' }}>
            <UserPlus size={18} color="#1a0a00" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create New Lead</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add a customer lead to CRM</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Customer Name" name="name" placeholder="John Doe" required />
            <Field label="Email Address" name="email" type="email" placeholder="john@example.com" required />
            <Field label="Phone Number" name="phone" placeholder="+91 9876543210" />
            <Select label="Lead Source" name="source" options={SOURCES} />
            <Select label="Inquiry Type" name="inquiryType" options={INQUIRY_TYPES} />
            <Select label="Status" name="status" options={STATUSES} />
            <Select label="Priority" name="priority" options={PRIORITIES} />
            <Field label="Follow-Up Date" name="followUpDate" type="date" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={4}
              placeholder="Customer's inquiry or message..."
              className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/leads')}
              className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 rounded-xl text-sm">
              {loading ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default NewLeadPage;
