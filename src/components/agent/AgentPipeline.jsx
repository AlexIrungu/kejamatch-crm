import { useState, useEffect } from 'react';
import { Loader2, User, Phone, Mail } from 'lucide-react';
import agentService from '../../services/agentService';

const statusColumns = [
  { key: 'new', label: 'New', color: 'bg-blue-500' },
  { key: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
  { key: 'qualified', label: 'Qualified', color: 'bg-indigo-500' },
  { key: 'viewing', label: 'Viewing', color: 'bg-cyan-500' },
  { key: 'negotiating', label: 'Negotiating', color: 'bg-orange-500' },
  { key: 'won', label: 'Won', color: 'bg-green-500' },
  { key: 'lost', label: 'Lost', color: 'bg-gray-500' },
];

const AgentPipeline = ({ onViewLead }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await agentService.getMyLeads();
      setLeads(res.data || []);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLeadsByStatus = (status) => leads.filter((l) => l.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {statusColumns.map((col) => {
          const colLeads = getLeadsByStatus(col.key);
          return (
            <div key={col.key} className="w-72 flex-shrink-0">
              <div className={`${col.color} text-white px-4 py-2 rounded-t-lg flex items-center justify-between`}>
                <span className="font-medium">{col.label}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                  {colLeads.length}
                </span>
              </div>
              <div className="bg-gray-100 rounded-b-lg p-2 min-h-[200px] max-h-[500px] overflow-y-auto space-y-2">
                {colLeads.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No leads</p>
                ) : (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => onViewLead?.(lead)}
                      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {lead.name}
                        </p>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        {lead.phone && (
                          <div className="flex items-center gap-1 truncate">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                        )}
                      </div>
                      {lead.propertyInterests?.length > 0 && (
                        <p className="mt-2 text-xs text-primary truncate">
                          {lead.propertyInterests[0].propertyName}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentPipeline;
