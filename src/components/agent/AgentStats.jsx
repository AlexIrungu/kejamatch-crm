import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import StatsCard from '../admin/StatsCard';

const AgentStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="My Leads"
        value={stats?.totalLeads || 0}
        icon={Users}
        color="blue"
      />
      <StatsCard
        title="Active"
        value={stats?.activeLeads || 0}
        icon={Clock}
        color="orange"
      />
      <StatsCard
        title="Converted"
        value={stats?.convertedLeads || 0}
        icon={CheckCircle}
        color="green"
      />
      <StatsCard
        title="This Week"
        value={stats?.weekLeads || 0}
        icon={TrendingUp}
        color="purple"
      />
    </div>
  );
};

export default AgentStats;