import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPublicLead } from '../services/api';
import { Coffee, MapPin, Phone, Mail, Clock, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const INQUIRY_TYPES = ['Table Booking', 'Catering', 'Event', 'General Inquiry', 'Feedback', 'Other'];

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/login');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill in all required fields');
    setLoading(true);
    try {
      await createPublicLead({
        ...form,
        source: 'Website Contact Form',
        status: 'New',
        priority: 'Medium',
      });
      setSubmitted(true);
      toast.success('Message sent! We\'ll be in touch soon. ☕');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #2d1500 0%, #0f0500 60%)', position: 'relative' }}>

      {/* ── Back Button (fixed top-right) ── */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        onClick={handleBack}
        title="Go back"
        style={{
          position: 'fixed',
          top: 20,
          right: 24,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 16px',
          borderRadius: 12,
          background: 'rgba(245,176,65,0.1)',
          border: '1px solid rgba(245,176,65,0.3)',
          color: 'var(--gold)',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          fontFamily: "'Inter', sans-serif",
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(245,176,65,0.2)';
          e.currentTarget.style.borderColor = 'rgba(245,176,65,0.55)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(245,176,65,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(245,176,65,0.1)';
          e.currentTarget.style.borderColor = 'rgba(245,176,65,0.3)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
        }}
      >
        <ArrowLeft size={15} strokeWidth={2.2} />
        Back
      </motion.button>
      {/* Hero */}
      <div className="relative overflow-hidden py-20 text-center px-4">
        <div className="particles-bg">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="particle" style={{
              width: `${20 + i * 15}px`, height: `${20 + i * 15}px`,
              left: `${15 + i * 14}%`, top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 1.5}s`,
            }} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--coffee-warm))', boxShadow: '0 0 30px rgba(212,168,83,0.3)' }}>
            <Coffee size={28} color="#1a0a00" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold gradient-text mb-3">Starcafe</h1>
          <p className="text-lg" style={{ color: 'var(--coffee-cream)' }}>Where Every Cup Tells a Story</p>
          <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            Get in touch with us for table reservations, catering inquiries, and private event bookings
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-5">
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Visit Us</h2>
          
          {[
            { icon: MapPin, title: 'Location', lines: ['42, Connaught Place', 'New Delhi, 110001'] },
            { icon: Phone, title: 'Phone', lines: ['+91 98765 43210', '+91 98765 43211'] },
            { icon: Mail, title: 'Email', lines: ['hello@starcafe.in', 'events@starcafe.in'] },
            { icon: Clock, title: 'Hours', lines: ['Mon – Fri: 7am – 10pm', 'Sat – Sun: 8am – 11pm'] },
          ].map(({ icon: Icon, title, lines }) => (
            <div key={title} className="glass-card p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212,168,83,0.15)' }}>
                <Icon size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
                {lines.map(l => <p key={l} className="text-sm" style={{ color: 'var(--text-muted)' }}>{l}</p>)}
              </div>
            </div>
          ))}

          {/* Services */}
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Our Services</h3>
            <div className="grid grid-cols-2 gap-2">
              {['☕ Specialty Coffee', '🍽️ Table Dining', '🎂 Private Events', '🍱 Corporate Catering', '🎵 Live Events', '🎁 Gift Cards'].map(s => (
                <div key={s} className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(212,168,83,0.08)', color: 'var(--text-secondary)' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          {submitted ? (
            <div className="glass-card p-10 text-center h-full flex flex-col items-center justify-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <CheckCircle size={56} className="mx-auto mb-4" style={{ color: '#4ade80' }} />
              </motion.div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent! ☕</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Thank you! Our team will reach out within 24 hours.
              </p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', inquiryType: 'General Inquiry', message: '' }); }}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm">
                Send Another
              </button>
            </div>
          ) : (
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required
                      placeholder="Your name" className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+91 98765 43210" className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder="you@example.com" className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Inquiry Type</label>
                  <select name="inquiryType" value={form.inquiryType} onChange={handleChange}
                    className="input-dark w-full px-4 py-2.5 rounded-xl text-sm">
                    {INQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Tell us about your reservation, event, or inquiry..."
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                  {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
