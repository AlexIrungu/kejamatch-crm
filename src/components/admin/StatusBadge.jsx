const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: {
      label: 'New',
      className: 'bg-blue-100 text-blue-800',
    },
    contacted: {
      label: 'Contacted',
      className: 'bg-purple-100 text-purple-800',
    },
    qualified: {
      label: 'Qualified',
      className: 'bg-indigo-100 text-indigo-800',
    },
    negotiation: {
      label: 'Negotiation',
      className: 'bg-yellow-100 text-yellow-800',
    },
    won: {
      label: 'Won',
      className: 'bg-green-100 text-green-800',
    },
    lost: {
      label: 'Lost',
      className: 'bg-red-100 text-red-800',
    },
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;