import React from "react";
import { useGetAnalyticsQuery, useGetPerformanceAnalyticsQuery } from "@/redux/api-slices/apiSlice";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Clock, 
  Target,
  Award,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";

interface PerformanceMetricProps {
  title: string;
  value: string | number;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: React.ElementType;
  color: "green" | "red" | "blue" | "orange" | "purple";
}

const PerformanceMetric: React.FC<PerformanceMetricProps> = ({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  color
}) => {
  const colorClasses = {
    green: "from-green-400 to-green-600",
    red: "from-red-400 to-red-600", 
    blue: "from-blue-400 to-blue-600",
    orange: "from-orange-400 to-orange-600",
    purple: "from-purple-400 to-purple-600"
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-accent-2 hover:shadow-xl transition-all duration-300 font-nokia-bold">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center">
          {trend === "up" && <TrendingUp size={16} className="text-green-600 mr-1" />}
          {trend === "down" && <TrendingDown size={16} className="text-red-600 mr-1" />}
          <span className={`text-base font-medium ${
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
          }`}>
            {trendValue}
          </span>
        </div>
      </div>
      <h3 className="text-gray-600 text-base font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const PerformanceDashboard: React.FC = () => {
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useGetAnalyticsQuery();
  const { data: performanceData, isLoading: performanceLoading, error: performanceError } = useGetPerformanceAnalyticsQuery();
  
  const isLoading = analyticsLoading || performanceLoading;
  const error = analyticsError || performanceError;

  if (isLoading) {
    return <DashboardSkeleton showStats={true} showCharts={false} showTables={true} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <h3 className="font-semibold mb-2">Error Loading Performance Data</h3>
        <p>Unable to fetch performance analytics. Please try again later.</p>
      </div>
    );
  }

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0";
    return Math.abs(value).toLocaleString();
  };

  return (
    <div className="space-y-8 py-6">
            {/* Header */}
      <div className="bg-gradient-to-r from-accent-6 to-accent-8 rounded-xl p-8 text-white font-nokia-bold">
        <div className="flex items-center justify-between">
    <div>
            <h1 className="text-4xl font-bold mb-2">የአፈጻጸም ዳሽቦርድ</h1>
            <p className="text-accent-1 text-xl">Comprehensive performance metrics and trends</p>
          </div>
          <BarChart3 size={48} className="text-accent-1" />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PerformanceMetric
          title="User Engagement Rate"
          value={`${analyticsData?.userEngagementRate?.toFixed(1) || '0'}%`}
          trend={analyticsData?.userEngagementRate && analyticsData?.userEngagementRate > 50 ? "up" : "down"}
          trendValue={`${analyticsData?.userEngagementRate?.toFixed(1) || '0'}%`}
          icon={Users}
          color="blue"
        />
        <PerformanceMetric
          title="Course Completion Rate"
          value={`${analyticsData?.courseCompletionRate?.toFixed(1) || '0'}%`}
          trend={analyticsData?.courseCompletionRate && analyticsData?.courseCompletionRate > 60 ? "up" : "down"}
          trendValue={`${analyticsData?.courseCompletionRate?.toFixed(1) || '0'}%`}
          icon={BookOpen}
          color="green"
        />
        <PerformanceMetric
          title="Average Session Time"
          value={`${analyticsData?.averageSessionTime || '0'}m`}
          trend={analyticsData?.averageSessionTime && analyticsData?.averageSessionTime > 20 ? "up" : "down"}
          trendValue={`${analyticsData?.averageSessionTime || '0'}m`}
          icon={Clock}
          color="orange"
        />
        <PerformanceMetric
          title="Daily Active Users"
          value={analyticsData?.dailyActiveUsers?.toString() || '0'}
          trend={analyticsData?.dailyActiveUsers && analyticsData?.weeklyActiveUsers && 
            (analyticsData.dailyActiveUsers / analyticsData.weeklyActiveUsers) > 0.3 ? "up" : "down"}
          trendValue={`${analyticsData?.dailyActiveUsers || '0'} today`}
          icon={Target}
          color="purple"
        />
      </div>

      {/* Detailed Performance Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Performance */}
        <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <Users size={24} className="text-accent-6 mr-3" />
                        <h2 className="text-2xl font-bold text-secondary-8">Top Performing Users</h2>
          </div>
          <div className="space-y-4">
            {(performanceData?.topUsers || []).slice(0, 5).map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent-1 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-6 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
        <div>
                    <p className="font-semibold text-secondary-8 text-base">{user.name}</p>
                    <p className="text-sm text-secondary-6">{user.courses} courses completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-accent-6">{user.score}%</p>
                  <p className="text-sm text-secondary-6">avg score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <BookOpen size={24} className="text-accent-6 mr-3" />
            <h2 className="text-2xl font-bold text-secondary-8">Top Performing Courses</h2>
          </div>
          <div className="space-y-4">
            {(performanceData?.topCourses || []).slice(0, 5).map((course, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-secondary-8 text-base">{course.title}</p>
                    <p className="text-sm text-secondary-6">{course.students} students enrolled</p>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{course.completion}%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${course.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Trends */}
      <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <LineChart size={24} className="text-accent-6 mr-3" />
          <h2 className="text-2xl font-bold text-secondary-8">Learning Trends & Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Award size={32} className="text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-600">{analyticsData?.newDevotions || 0}</p>
            <p className="text-base text-green-700">New Devotions</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Activity size={32} className="text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-600">{analyticsData?.weeklyActiveUsers || 0}</p>
            <p className="text-base text-purple-700">Weekly Active Users</p>
            <p className="text-sm text-gray-500 mt-1">This week</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Calendar size={32} className="text-orange-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-orange-600">{analyticsData?.totalDevotions || 0}</p>
            <p className="text-base text-orange-700">Total Devotions</p>
            <p className="text-sm text-gray-500 mt-1">Available</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-accent-1">
          <h3 className="text-xl font-semibold text-secondary-8 mb-4">Weekly Performance Summary</h3>
          <div className="grid grid-cols-7 gap-2">
            {(performanceData?.weeklyActivity || []).slice(-7).map((dayData, index) => {
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const date = new Date(dayData.date);
              const dayName = dayNames[date.getDay()];
              
              return (
                <div key={dayData.date} className="text-center">
                  <div className="bg-accent-1 rounded-lg p-2 mb-2" style={{ height: '80px' }}>
                    <div 
                      className="bg-accent-6 rounded w-full transition-all duration-1000"
                      style={{ height: `${dayData.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-secondary-6">{dayName}</p>
                  <p className="text-xs font-semibold text-secondary-8">{dayData.activeUsers}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
