import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useState } from 'react';

const TimeTrendsChart = ({ data, loading, onPeriodChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || !data.trends || data.trends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <p className="text-gray-500 text-center py-8">No trend data available</p>
      </div>
    );
  }

  const { trends, growth, period } = data;

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  // Calculate max value for scaling
  const maxValue = Math.max(...trends.map((t) => Math.max(t.totalLeads, t.qualified, t.won)));
  const chartHeight = 200;

  // Format date labels
  const formatDate = (dateStr) => {
    if (period === 'monthly') {
      const [year, month] = dateStr.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    if (period === 'weekly') {
      return dateStr;
    }
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Performance Trends</h3>
          <p className="text-sm text-gray-500 mt-1">Track metrics over time</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedPeriod === p
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Growth Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Lead Growth</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{growth.leadsGrowth}%</p>
            </div>
            <div
              className={`p-3 rounded-full ${
                parseFloat(growth.leadsGrowth) >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {parseFloat(growth.leadsGrowth) >= 0 ? (
                <TrendingUp className="w-6 h-6 text-white" />
              ) : (
                <TrendingDown className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Conversion Growth</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{growth.conversionGrowth}%</p>
            </div>
            <div
              className={`p-3 rounded-full ${
                parseFloat(growth.conversionGrowth) >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {parseFloat(growth.conversionGrowth) >= 0 ? (
                <TrendingUp className="w-6 h-6 text-white" />
              ) : (
                <TrendingDown className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: chartHeight + 40 }}>
        <svg width="100%" height={chartHeight + 40} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <g key={ratio}>
              <line
                x1="40"
                y1={chartHeight * (1 - ratio)}
                x2="100%"
                y2={chartHeight * (1 - ratio)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text x="5" y={chartHeight * (1 - ratio) + 5} className="text-xs fill-gray-500">
                {Math.round(maxValue * ratio)}
              </text>
            </g>
          ))}

          {/* Data points and lines */}
          {trends.map((point, index) => {
            const x = 50 + (index / (trends.length - 1)) * (100 - 10); // percentage
            const totalY = chartHeight * (1 - point.totalLeads / maxValue);
            const qualifiedY = chartHeight * (1 - point.qualified / maxValue);
            const wonY = chartHeight * (1 - point.won / maxValue);

            return (
              <g key={index}>
                {/* Lines connecting points */}
                {index > 0 && (
                  <>
                    {/* Total Leads Line */}
                    <line
                      x1={`${50 + ((index - 1) / (trends.length - 1)) * (100 - 10)}%`}
                      y1={chartHeight * (1 - trends[index - 1].totalLeads / maxValue)}
                      x2={`${x}%`}
                      y2={totalY}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    {/* Qualified Line */}
                    <line
                      x1={`${50 + ((index - 1) / (trends.length - 1)) * (100 - 10)}%`}
                      y1={chartHeight * (1 - trends[index - 1].qualified / maxValue)}
                      x2={`${x}%`}
                      y2={qualifiedY}
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    {/* Won Line */}
                    <line
                      x1={`${50 + ((index - 1) / (trends.length - 1)) * (100 - 10)}%`}
                      y1={chartHeight * (1 - trends[index - 1].won / maxValue)}
                      x2={`${x}%`}
                      y2={wonY}
                      stroke="#10b981"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  </>
                )}

                {/* Data points */}
                <circle cx={`${x}%`} cy={totalY} r="4" fill="#3b82f6" className="hover:r-6 transition-all" />
                <circle cx={`${x}%`} cy={qualifiedY} r="4" fill="#8b5cf6" className="hover:r-6 transition-all" />
                <circle cx={`${x}%`} cy={wonY} r="4" fill="#10b981" className="hover:r-6 transition-all" />

                {/* Date labels (show every nth label to avoid crowding) */}
                {(trends.length <= 10 || index % Math.ceil(trends.length / 10) === 0) && (
                  <text
                    x={`${x}%`}
                    y={chartHeight + 20}
                    className="text-xs fill-gray-500"
                    textAnchor="middle"
                    transform={`rotate(-45 ${x}% ${chartHeight + 20})`}
                  >
                    {formatDate(point.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Total Leads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm text-gray-600">Qualified</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Won</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {trends.reduce((sum, t) => sum + t.totalLeads, 0)}
          </p>
          <p className="text-xs text-gray-500">Total Leads</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {trends.reduce((sum, t) => sum + t.qualified, 0)}
          </p>
          <p className="text-xs text-gray-500">Qualified</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {trends.reduce((sum, t) => sum + t.won, 0)}
          </p>
          <p className="text-xs text-gray-500">Won</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {trends.reduce((sum, t) => sum + t.lost, 0)}
          </p>
          <p className="text-xs text-gray-500">Lost</p>
        </div>
      </div>
    </div>
  );
};

export default TimeTrendsChart;