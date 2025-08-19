import React from "react";
import { useGetAnalyticsQuery } from "@/redux/api-slices/apiSlice";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  UserPlus,
  UserMinus,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  color: "primary" | "success" | "warning" | "danger" | "info";
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  color,
  description 
}) => {
  const colorClasses = {
    primary: {
      bg: "bg-gradient-to-br from-accent-1 to-accent-3",
      border: "border-accent-6",
      icon: "text-accent-7",
      iconBg: "bg-accent-6/10"
    },
    success: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-400",
      icon: "text-green-700",
      iconBg: "bg-green-100"
    },
    warning: {
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      border: "border-yellow-400",
      icon: "text-yellow-700",
      iconBg: "bg-yellow-100"
    },
    danger: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-400",
      icon: "text-red-700",
      iconBg: "bg-red-100"
    },
    info: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-400",
      icon: "text-blue-700",
      iconBg: "bg-blue-100"
    }
  };

  const styles = colorClasses[color];

  return (
    <div className={`p-6 rounded-xl border-2 ${styles.bg} ${styles.border} shadow-lg hover:shadow-xl transition-all duration-300 font-nokia-bold`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className={`p-2 rounded-lg ${styles.iconBg} mr-3`}>
              <Icon size={20} className={styles.icon} />
            </div>
            <h3 className="text-base font-medium text-secondary-7">{title}</h3>
          </div>
          <p className="text-4xl font-bold text-secondary-9 mb-1">{value}</p>
          {description && (
            <p className="text-sm text-secondary-6 mb-3">{description}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center">
              {change >= 0 ? (
                <TrendingUp size={14} className="text-green-600 mr-1" />
              ) : (
                <TrendingDown size={14} className="text-red-600 mr-1" />
              )}
              <span className={`text-base font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-secondary-6 ml-1">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EnhancedAnalytics: React.FC = () => {
  const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery();

  if (isLoading) {
    return <DashboardSkeleton showStats={true} showCharts={true} showTables={false} />;
  }

  if (error) {
    console.error("Error fetching analytics data:", error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <h3 className="font-semibold mb-2">Error Loading Analytics</h3>
        <p>Unable to fetch analytics data. Please try again later.</p>
      </div>
    );
  }

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0";
    return Math.abs(value).toLocaleString();
  };

  // Calculate percentages and trends from real data
  const userGrowthRate = analyticsData?.newUsers && analyticsData?.totalUsers 
    ? ((analyticsData.newUsers / analyticsData.totalUsers) * 100).toFixed(1)
    : "0";

  const courseGrowthRate = analyticsData?.newCourses && analyticsData?.totalCourses
    ? ((analyticsData.newCourses / analyticsData.totalCourses) * 100).toFixed(1)
    : "0";

  const engagementRate = analyticsData?.accountsReached && analyticsData?.totalUsers
    ? ((analyticsData.accountsReached / analyticsData.totalUsers) * 100).toFixed(1)
    : "0";

  const retentionRate = analyticsData?.usersLeft && analyticsData?.totalUsers
    ? (100 - (analyticsData.usersLeft / analyticsData.totalUsers) * 100).toFixed(1)
    : "100";

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-6 to-accent-8 rounded-xl p-8 text-white font-nokia-bold">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">የትንተና ሪፖርት</h1>
            <p className="text-accent-1 text-xl">Comprehensive analytics and insights for your platform</p>
          </div>
          <BarChart3 size={48} className="text-accent-1" />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="አጠቃላይ ተጠቃሚዎች"
          value={formatNumber(analyticsData?.totalUsers)}
          change={parseFloat(userGrowthRate)}
          changeLabel="from last month"
          icon={Users}
          color="primary"
          description="Total registered users on the platform"
        />
        <MetricCard
          title="አዲስ ተጠቃሚዎች"
          value={formatNumber(analyticsData?.newUsers)}
          change={parseFloat(userGrowthRate)}
          changeLabel="of total users"
          icon={UserPlus}
          color="success"
          description="New user registrations this month"
        />
        <MetricCard
          title="አጠቃላይ ኮርሶች"
          value={formatNumber(analyticsData?.totalCourses)}
          change={parseFloat(courseGrowthRate)}
          changeLabel="course creation rate"
          icon={BookOpen}
          color="info"
          description="Total courses available on platform"
        />
        <MetricCard
          title="የወጡ ተጠቃሚዎች"
          value={formatNumber(analyticsData?.usersLeft)}
          change={analyticsData?.usersLeft && analyticsData?.totalUsers ? 
            -parseFloat(((analyticsData.usersLeft / analyticsData.totalUsers) * 100).toFixed(1)) : 0}
          changeLabel="of total users"
          icon={UserMinus}
          color="danger"
          description="Users who left in past 2 months"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="የተደረሱ መለያዎች"
          value={formatNumber(analyticsData?.accountsReached)}
          change={parseFloat(engagementRate)}
          changeLabel="engagement rate"
          icon={Target}
          color="warning"
          description="Accounts reached in the past month"
        />
        <MetricCard
          title="አዲስ ኮርሶች"
          value={formatNumber(analyticsData?.newCourses)}
          change={parseFloat(courseGrowthRate)}
          changeLabel="content growth"
          icon={Calendar}
          color="success"
          description="New courses added this month"
        />
        <MetricCard
          title="ተጠቃሚ ማቆያ ደረጃ"
          value={`${retentionRate}%`}
          change={parseFloat(retentionRate)}
          changeLabel="retention rate"
          icon={Activity}
          color="primary"
          description="User retention based on activity"
        />
      </div>

      {/* Detailed Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg font-nokia-bold">
          <div className="flex items-center mb-6">
            <Users size={24} className="text-accent-6 mr-3" />
            <h2 className="text-2xl font-bold text-secondary-8">User Analytics</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-accent-1 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-secondary-7 font-medium text-base">Total Users</span>
                <span className="text-3xl font-bold text-accent-7">{formatNumber(analyticsData?.totalUsers)}</span>
              </div>
              <div className="w-full bg-accent-2 rounded-full h-2">
                <div 
                  className="bg-accent-6 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: analyticsData?.totalUsers ? `${Math.min((analyticsData.totalUsers / 1000) * 100, 100)}%` : '0%' }}
                ></div>
              </div>
              <p className="text-xs text-secondary-6 mt-2">
                {analyticsData?.totalUsers ? `${((analyticsData.totalUsers / 1000) * 100).toFixed(1)}% of 1000 target` : 'No data'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">+{formatNumber(analyticsData?.newUsers)}</p>
                <p className="text-sm text-green-700">New Users</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">-{formatNumber(analyticsData?.usersLeft)}</p>
                <p className="text-sm text-red-700">Users Left (Inactive/Deleted)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Analytics */}
        <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg font-nokia-bold">
          <div className="flex items-center mb-6">
            <BookOpen size={24} className="text-accent-6 mr-3" />
            <h2 className="text-2xl font-bold text-secondary-8">Course Analytics</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-secondary-7 font-medium text-base">Total Courses</span>
                <span className="text-3xl font-bold text-blue-600">{formatNumber(analyticsData?.totalCourses)}</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: analyticsData?.totalCourses ? `${Math.min((analyticsData.totalCourses / 100) * 100, 100)}%` : '0%' }}
                ></div>
              </div>
              <p className="text-xs text-secondary-6 mt-2">
                {analyticsData?.totalCourses ? `${((analyticsData.totalCourses / 100) * 100).toFixed(1)}% of 100 target` : 'No course data'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-accent-1 rounded-lg">
                <p className="text-2xl font-bold text-accent-6">+{formatNumber(analyticsData?.newCourses)}</p>
                <p className="text-sm text-accent-7">New Courses</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{retentionRate}%</p>
                <p className="text-sm text-purple-700">Retention Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg font-nokia-bold">
        <div className="flex items-center mb-6">
          <PieChart size={24} className="text-accent-6 mr-3" />
          <h2 className="text-2xl font-bold text-secondary-8">Performance Indicators</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#F6D09A"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#EA9215"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - (parseFloat(engagementRate) / 100))}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-accent-6">{engagementRate}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-secondary-7">User Engagement</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#DBEAFE"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - 0.72)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">72%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-secondary-7">Content Quality</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#DCFCE7"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#16A34A"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - 0.91)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">91%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-secondary-7">System Uptime</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#FEF3C7"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - 0.67)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-yellow-600">67%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-secondary-7">Goal Achievement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
