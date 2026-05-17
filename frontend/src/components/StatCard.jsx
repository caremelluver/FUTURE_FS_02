import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color, delay = 0, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    className="card"
    style={{ height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
  >
    {/* Top row: label + icon */}
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <p
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {label}
      </p>
      <div
        className="icon-box"
        style={{
          width: 40, height: 40,
          background: `${color}18`,
          border: `1px solid ${color}28`,
          borderRadius: 12,
          flexShrink: 0,
          transition: 'transform 0.3s ease',
        }}
      >
        <Icon size={18} style={{ color }} strokeWidth={1.8} />
      </div>
    </div>

    {/* Bottom: value + subtitle */}
    <div>
      <p className="stat-number" style={{ color: 'var(--text-primary)' }}>
        {value ?? '—'}
      </p>
      {subtitle && (
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: 4,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>

    {/* Bottom accent line */}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${color}00, ${color}60, ${color}00)`,
        borderRadius: '0 0 var(--r-2xl) var(--r-2xl)',
        opacity: 0.6,
      }}
    />
  </motion.div>
);

export default StatCard;
