import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trendValue}
              </span>
              <span className="text-gray-500 text-sm ml-1">vs last period</span>
            </div>
          )}
        </div>
        
        <div className={`${bgColorClasses[color]} p-4 rounded-lg`}>
          <Icon className={`w-8 h-8 ${colorClasses[color].replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;