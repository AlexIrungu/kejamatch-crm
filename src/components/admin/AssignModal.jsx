import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import adminService from '../../services/adminService';

const AssignModal = ({ lead, isOpen, onClose, onSuccess }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  const fetchAgents = async () => {
    try {
      const response = await adminService.getAllUsers();
      const agentsList = response.data.filter(
        (user) => user.role === 'agent' || user.role === 'admin'
      );
      setAgents(agentsList);
    } catch (err) {
      setError('Failed to load agents');
      console.error('Error fetching agents:', err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      setError('Please select an agent');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await adminService.assignLead(lead.id, selectedAgent);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign lead');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Assign Lead</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAssign} className="p-6">
          {/* Lead Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{lead.name}</h4>
            <p className="text-sm text-gray-600">{lead.email}</p>
            {lead.phone && <p className="text-sm text-gray-600">{lead.phone}</p>}
          </div>

          {/* Agent Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Agent
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                required
              >
                <option value="">Choose an agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.email}) - {agent.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Assigning...' : 'Assign Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignModal;