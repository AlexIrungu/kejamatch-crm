import { Trophy, TrendingUp, Clock, Target, Phone, Mail, FileText } from 'lucide-react';

const AgentPerformanceChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.agents || data.agents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Agent Performance</h3>
        <p className="text-gray-500 text-center py-8">No agent performance data available</p>
      </div>
    );
  }

  const { agents, teamSummary } = data;

  // Get top performer
  const topPerformer = agents.reduce((prev, current) =>
    current.metrics.wonDeals > prev.metrics.wonDeals ? current : prev
  );

  // Get highest conversion rate
  const bestConverter = agents.reduce((prev, current) =>
    current.metrics.conversionRate > prev.metrics.conversionRate ? current : prev
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Agent Performance</h3>
          <p className="text-sm text-gray-500 mt-1">Compare agent metrics and achievements</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{teamSummary.teamConversionRate}%</p>
          <p className="text-xs text-gray-500">Team Average</p>
        </div>
      </div>

      {/* Team Summary Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{teamSummary.totalLeads}</p>
          <p className="text-xs text-gray-500">Total Leads</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-600">{teamSummary.wonDeals}</p>
          <p className="text-xs text-gray-500">Won Deals</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-red-600">{teamSummary.lostDeals}</p>
          <p className="text-xs text-gray-500">Lost Deals</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600">{teamSummary.teamAverageDaysToClose}</p>
          <p className="text-xs text-gray-500">Avg Days to Close</p>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="space-y-4">
        {agents.map((agentData, index) => {
          const { agent, metrics, activities } = agentData;
          const isTopPerformer = agent.id === topPerformer.agent.id;
          const isBestConverter = agent.id === bestConverter.agent.id;

          return (
            <div
              key={agent.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                isTopPerformer ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
              }`}
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    {isTopPerformer && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                        <Trophy className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{agent.name}</p>
                      {isTopPerformer && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full">
                          Top Performer
                        </span>
                      )}
                      {isBestConverter && !isTopPerformer && (
                        <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full">
                          Best Converter
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{agent.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{metrics.wonDeals}</p>
                  <p className="text-xs text-gray-500">Won Deals</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="bg-white rounded p-2 border border-gray-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-blue-500" />
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <p className="font-bold text-gray-900">{metrics.totalLeads}</p>
                </div>

                <div className="bg-white rounded p-2 border border-gray-100">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <p className="text-xs text-gray-500">Conv. Rate</p>
                  </div>
                  <p className="font-bold text-green-600">{metrics.conversionRate}%</p>
                </div>

                <div className="bg-white rounded p-2 border border-gray-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <p className="text-xs text-gray-500">Days</p>
                  </div>
                  <p className="font-bold text-gray-900">{metrics.averageDaysToClose}</p>
                </div>

                <div className="bg-white rounded p-2 border border-gray-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-purple-500" />
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <p className="font-bold text-purple-600">{metrics.activeDeals}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Performance Score</span>
                  <span className="text-xs font-medium text-gray-700">
                    {metrics.wonDeals}/{metrics.totalLeads}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${
                      metrics.conversionRate >= teamSummary.teamConversionRate
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    } h-full rounded-full transition-all duration-500`}
                    style={{
                      width: `${metrics.totalLeads > 0 ? (metrics.wonDeals / metrics.totalLeads) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{activities.calls} calls</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{activities.emails} emails</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{activities.notes} notes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>{activities.viewings} viewings</span>
                </div>
              </div>

              {/* Performance Indicator */}
              {metrics.conversionRate < teamSummary.teamConversionRate && (
                <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  ⚠️ Below team average - Consider additional training or support
                </div>
              )}
              {metrics.conversionRate >= teamSummary.teamConversionRate * 1.2 && (
                <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  ⭐ Exceeding expectations - Great work!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Team Insights</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>
            • <strong>{topPerformer.agent.name}</strong> is your top performer with{' '}
            {topPerformer.metrics.wonDeals} won deals
          </li>
          <li>
            • <strong>{bestConverter.agent.name}</strong> has the highest conversion rate at{' '}
            {bestConverter.metrics.conversionRate}%
          </li>
          <li>
            • Team average close time: <strong>{teamSummary.teamAverageDaysToClose} days</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AgentPerformanceChart;