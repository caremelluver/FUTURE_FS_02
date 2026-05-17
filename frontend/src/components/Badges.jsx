/* Status badges with dot indicator */
const statusConfig = {
  New:        { cls: 'status-new',        label: 'New' },
  Contacted:  { cls: 'status-contacted',  label: 'Contacted' },
  Interested: { cls: 'status-interested', label: 'Interested' },
  Converted:  { cls: 'status-converted',  label: 'Converted' },
  Closed:     { cls: 'status-closed',     label: 'Closed' },
};

const priorityConfig = {
  Low:    { cls: 'priority-low',    label: 'Low' },
  Medium: { cls: 'priority-medium', label: 'Medium' },
  High:   { cls: 'priority-high',   label: 'High' },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {};
  return (
    <span className={`badge ${config.cls || ''}`}>
      {config.label || status || '—'}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || {};
  return (
    <span className={`badge ${config.cls || ''}`}>
      {config.label || priority || '—'}
    </span>
  );
};

export const SkeletonRow = () => (
  <tr>
    {[120, 160, 110, 80, 70, 75, 60].map((w, i) => (
      <td key={i} className="px-4 py-3.5">
        <div
          className="h-3.5 rounded-full shimmer"
          style={{ width: `${w}px`, opacity: 0.6 }}
        />
        {i === 0 && (
          <div className="h-3 rounded-full shimmer mt-1.5" style={{ width: '100px', opacity: 0.4 }} />
        )}
      </td>
    ))}
  </tr>
);

export default StatusBadge;
