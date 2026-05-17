import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Coffee, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@starcafe.com', password: 'admin123' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! ☕');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 25% 50%, #1a0e04 0%, #0b0b0c 60%)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute', inset: 0, opacity: 0.02, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(245,176,65,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,176,65,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,176,65,0.06) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#151515',
          border: '1px solid rgba(245,176,65,0.15)',
          borderRadius: 24,
          padding: 48,
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(245,176,65,0.05)',
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: 'absolute', top: 0, left: 48, right: 48, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(245,176,65,0.5), transparent)',
          }}
        />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 14 }}
            style={{
              width: 80, height: 80,
              borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #f5b041, #c47a15)',
              boxShadow: '0 0 40px rgba(245,176,65,0.35)',
              overflow: 'hidden',
            }}
          >
            <img src="/logo.png" alt="Starcafe Logo" style={{ width: 72, height: 72, objectFit: 'cover' }} />
          </motion.div>

          <h1
            className="font-poppins gradient-text"
            style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 6 }}
          >
            Starcafe CRM
          </h1>
          <p
            style={{
              fontSize: '0.75rem', fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}
          >
            Admin Dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-hint)' }}
              />
              <input
                type="email"
                id="login-email"
                name="email"
                autoComplete="username"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-dark"
                placeholder="admin@starcafe.com"
                style={{ width: '100%', height: 50, borderRadius: 12, paddingLeft: 42, paddingRight: 16 }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-hint)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-dark"
                placeholder="••••••••"
                style={{ width: '100%', height: 50, borderRadius: 12, paddingLeft: 42, paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 4,
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%', height: 52, borderRadius: 12,
              fontSize: '0.95rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              marginTop: 6,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 18, height: 18, border: '2px solid rgba(26,13,0,0.4)',
                    borderTopColor: '#1a0d00', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 24, padding: '14px 18px', borderRadius: 12,
            background: 'rgba(245,176,65,0.06)',
            border: '1px solid rgba(245,176,65,0.15)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <Sparkles size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
              Demo Credentials
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              admin@starcafe.com · admin123
            </p>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginPage;
