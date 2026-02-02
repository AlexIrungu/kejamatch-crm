import { TrendingDown, TrendingUp } from 'lucide-react';

const ConversionFunnelChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.stages) {
    return null;
  }

  const { stages, summary } = data;

  // Calculate the maximum width for scaling
  const maxCount = Math.max(...stages.map((s) => s.count));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Conversion Funnel</h3>
          <p className="text-sm text-gray-500 mt-1">Track leads through the sales pipeline</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-600">{summary.overallConversionRate}%</p>
          <p className="text-sm text-gray-500">Overall Conversion</p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const widthPercentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const isLastStage = index === stages.length - 1;

          // Color scheme for different stages
          const getStageColor = (stageName) => {
            const colors = {
              'Total Leads': 'bg-blue-500',
              'Contacted': 'bg-purple-500',
              'Qualified': 'bg-indigo-500',
              'Viewing': 'bg-yellow-500',
              'Negotiating': 'bg-orange-500',
              'Won': 'bg-green-500',
            };
            return colors[stageName] || 'bg-gray-500';
          };

          return (
            <div key={stage.name} className="relative">
              {/* Stage Bar */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div
                    className={`${getStageColor(stage.name)} rounded-lg transition-all duration-500 hover:opacity-90`}
                    style={{
                      width: `${widthPercentage}%`,
                      minWidth: '20%',
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 text-white">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{stage.name}</span>
                        {!isLastStage && stage.dropoff > 0 && (
                          <span className="flex items-center text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {stage.dropoff} dropped
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">{stage.count}</span>
                        {index > 0 && (
                          <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                            {stage.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              {!isLastStage && (
                <div className="flex justify-center my-1">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-400"
                  >
                    <path
                      d="M12 4L12 20M12 20L6 14M12 20L18 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{summary.totalLeads}</p>
          <p className="text-sm text-gray-500">Total Leads</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{summary.wonDeals}</p>
          <p className="text-sm text-gray-500">Won Deals</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{summary.lostDeals}</p>
          <p className="text-sm text-gray-500">Lost Deals</p>
        </div>
      </div>

      {/* Insights */}
      {summary.averageDropoffRate > 50 && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <TrendingDown className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>High Drop-off Alert:</strong> {summary.averageDropoffRate}% of leads are
                dropping off. Consider reviewing your follow-up process.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionFunnelChart;