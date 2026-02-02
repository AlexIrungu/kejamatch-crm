import { useState, useEffect } from 'react';
import { Calendar, Download, RefreshCw, TrendingUp } from 'lucide-react';
import analyticsService from '../../../services/analyticsService';
import ConversionFunnelChart from './ConversionFunnelChart';
import LeadSourceChart from './LeadSourceChart';
import AgentPerformanceChart from './AgentPerformanceChart';
import TimeTrendsChart from './TimeTrendsChart';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30'); // days
  const [period, setPeriod] = useState('daily');
  
  // Analytics data state
  const [funnelData, setFunnelData] = useState(null);
  const [sourceData, setSourceData] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [trendData, setTrendData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      // Fetch all analytics in parallel
      const [funnel, sources, agents, trends] = await Promise.all([
        analyticsService.getConversionFunnel(params),
        analyticsService.getLeadSources(params),
        analyticsService.getAgentPerformance(params),
        analyticsService.getTimeTrends({ ...params, period }),
      ]);

      setFunnelData(funnel.data);
      setSourceData(sources.data);
      setAgentData(agents.data);
      setTrendData(trends.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Show error notification here
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const handlePeriodChange = async (newPeriod) => {
    setPeriod(newPeriod);
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        period: newPeriod,
      };

      const trends = await analyticsService.getTimeTrends(params);
      setTrendData(trends.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  const exportAnalytics = () => {
    // Prepare data for export
    const exportData = {
      dateRange: {
        from: new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        to: new Date().toLocaleDateString(),
      },
      funnel: funnelData,
      sources: sourceData,
      agents: agentData,
      trends: trendData,
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kejamatch-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-blue-600" />
              Analytics Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive insights into your CRM performance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="60">Last 60 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 6 months</option>
                <option value="365">Last year</option>
              </select>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              onClick={exportAnalytics}
              disabled={loading || !funnelData}
              className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      {!loading && funnelData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold mt-2">{funnelData.summary.totalLeads}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Won Deals</p>
                <p className="text-3xl font-bold mt-2">{funnelData.summary.wonDeals}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold mt-2">{funnelData.summary.overallConversionRate}%</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Lost Deals</p>
                <p className="text-3xl font-bold mt-2">{funnelData.summary.lostDeals}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <ConversionFunnelChart data={funnelData} loading={loading} />

        {/* Lead Sources */}
        <LeadSourceChart data={sourceData} loading={loading} />
      </div>

      {/* Time Trends - Full Width */}
      <TimeTrendsChart 
        data={trendData} 
        loading={loading} 
        onPeriodChange={handlePeriodChange}
      />

      {/* Agent Performance - Full Width */}
      <AgentPerformanceChart data={agentData} loading={loading} />

      {/* Insights Section */}
      {!loading && funnelData && sourceData && agentData && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md p-6 border border-indigo-200">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">
            🎯 Key Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Conversion Insight */}
            {parseFloat(funnelData.summary.overallConversionRate) < 10 && (
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-900 mb-1">⚠️ Low Conversion Rate</p>
                <p className="text-xs text-gray-600">
                  Your conversion rate is {funnelData.summary.overallConversionRate}%. Consider
                  reviewing your qualification process and follow-up strategies.
                </p>
              </div>
            )}

            {/* Top Source Insight */}
            {sourceData.sources.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-900 mb-1">
                  ⭐ Best Performing Source
                </p>
                <p className="text-xs text-gray-600">
                  {sourceData.sources[0].source.replace(/_/g, ' ')} is your top source with{' '}
                  {sourceData.sources[0].conversionRate}% conversion rate.
                </p>
              </div>
            )}

            {/* Agent Performance Insight */}
            {agentData.agents.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-900 mb-1">🏆 Top Agent</p>
                <p className="text-xs text-gray-600">
                  {agentData.agents[0].agent.name} leads with{' '}
                  {agentData.agents[0].metrics.wonDeals} won deals and{' '}
                  {agentData.agents[0].metrics.conversionRate}% conversion rate.
                </p>
              </div>
            )}

            {/* Growth Insight */}
            {trendData && parseFloat(trendData.growth.leadsGrowth) > 20 && (
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-900 mb-1">📈 Strong Growth</p>
                <p className="text-xs text-gray-600">
                  Lead generation is up {trendData.growth.leadsGrowth}%! Keep up the momentum.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;