import React from "react";
import { useGetAnalyticsQuery } from "@/redux/api-slices/apiSlice";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  PlusCircle,
  Settings,
  BarChart3,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  color = "blue" 
}) => {
  const colorClasses = {
    blue: "border-accent-6 bg-gradient-to-br from-accent-1 to-accent-2",
    green: "border-green-400 bg-gradient-to-br from-green-50 to-green-100",
    orange: "border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100",
    red: "border-red-400 bg-gradient-to-br from-red-50 to-red-100",
    purple: "border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100"
  };

  const iconColors = {
    blue: "text-accent-6",
    green: "text-green-600",
    orange: "text-orange-600",
    red: "text-red-600",
    purple: "text-purple-600"
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-nokia-bold`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-base font-medium text-secondary-7 mb-1">{title}</p>
          <p className="text-4xl font-bold text-secondary-8 mb-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-secondary-6">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-white/50 ${iconColors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center mt-3 pt-3 border-t border-white/30">
          {trend === "up" && <TrendingUp size={16} className="text-green-600 mr-1" />}
          {trend === "down" && <TrendingDown size={16} className="text-red-600 mr-1" />}
          <span className={`text-base font-medium ${
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-secondary-6"
          }`}>
            {trendValue}
          </span>
          <span className="text-sm text-secondary-6 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  color: "blue" | "green" | "orange" | "purple";
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, link, color }) => {
  const colorClasses = {
    blue: "bg-accent-6 hover:bg-accent-7",
    green: "bg-green-600 hover:bg-green-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    purple: "bg-purple-600 hover:bg-purple-700"
  };

  return (
    <Link to={link} className="block">
      <div className={`p-4 rounded-lg ${colorClasses[color]} text-white hover:shadow-lg transition-all duration-300 hover:scale-105 font-nokia-bold`}>
        <div className="flex items-center">
          <Icon size={20} className="mr-3" />
          <div>
            <h3 className="font-semibold text-base">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const DashboardOverview: React.FC = () => {
  const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery();

  if (isLoading) {
    return <DashboardSkeleton showStats={true} showCharts={true} showTables={true} />;
  }

  if (error) {
    console.error("Error fetching analytics data:", error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Error fetching analytics data. Please try again later.
      </div>
    );
  }

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0";
    return Math.abs(value).toLocaleString();
  };

  const quickActions = [
    {
      title: "Create Course",
      description: "Add new learning content",
      icon: PlusCircle,
      link: "/admin/courses/create",
      color: "blue" as const
    },
    {
      title: "Create Devotion", 
      description: "Add daily devotional",
      icon: Calendar,
      link: "/admin/devotion/create",
      color: "green" as const
    },
    {
      title: "Manage Users",
      description: "User administration",
      icon: Settings,
      link: "/admin/users/manage", 
      color: "orange" as const
    },
    {
      title: "View Analytics",
      description: "Detailed insights",
      icon: BarChart3,
      link: "/admin/analytics/dashboard",
      color: "purple" as const
    }
  ];

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-6 to-accent-8 rounded-xl p-8 text-white font-nokia-bold">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">እንኳን ወደ ዳሽቦርድ በደህና መጡ</h1>
            <p className="text-accent-1 text-xl">Overview of your platform activities and statistics</p>
          </div>
          <Activity size={48} className="text-accent-1" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="አጠቃላይ ተጠቃሚዎች"
          value={formatNumber(analyticsData?.totalUsers)}
          subtitle={`+${formatNumber(analyticsData?.newUsers)} new this month`}
          icon={Users}
          trend={analyticsData?.newUsers && analyticsData?.newUsers > 0 ? "up" : "neutral"}
          trendValue={`+${formatNumber(analyticsData?.newUsers)}`}
          color="blue"
        />
        <StatCard
          title="አጠቃላይ ኮርሶች"
          value={formatNumber(analyticsData?.totalCourses)}
          subtitle={`+${formatNumber(analyticsData?.newCourses)} new this month`}
          icon={BookOpen}
          trend={analyticsData?.newCourses && analyticsData?.newCourses > 0 ? "up" : "neutral"}
          trendValue={`+${formatNumber(analyticsData?.newCourses)}`}
          color="green"
        />
        <StatCard
          title="የተደረሱ መለያዎች"
          value={formatNumber(analyticsData?.accountsReached)}
          subtitle="In the past month"
          icon={TrendingUp}
          trend={analyticsData?.accountsReached && analyticsData?.totalUsers ? 
            (analyticsData.accountsReached / analyticsData.totalUsers > 0.5 ? "up" : "neutral") : "neutral"}
          trendValue={analyticsData?.accountsReached && analyticsData?.totalUsers ? 
            `${((analyticsData.accountsReached / analyticsData.totalUsers) * 100).toFixed(1)}%` : "0%"}
          color="orange"
        />
        <StatCard
          title="የወጡ ተጠቃሚዎች"
          value={formatNumber(analyticsData?.usersLeft)}
          subtitle="Inactive for 2+ months or deleted"
          icon={TrendingDown}
          trend={analyticsData?.usersLeft && analyticsData?.usersLeft > 0 ? "down" : "neutral"}
          trendValue={analyticsData?.usersLeft && analyticsData?.totalUsers ? 
            `-${((analyticsData.usersLeft / analyticsData.totalUsers) * 100).toFixed(1)}%` : "0%"}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg font-nokia-bold">
        <div className="flex items-center mb-6">
          <PlusCircle size={24} className="text-accent-6 mr-3" />
          <h2 className="text-2xl font-bold text-secondary-8">ፈጣን እርምጃዎች</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Summary */}
        <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg font-nokia-bold">
          <div className="flex items-center mb-4">
            <BarChart3 size={24} className="text-accent-6 mr-3" />
            <h3 className="text-xl font-bold text-secondary-8">Performance Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-accent-1">
              <span className="text-secondary-7">User Growth Rate</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-accent-2 rounded-full mr-3">
                  <div 
                    className="h-full bg-accent-6 rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${analyticsData?.totalUsers && analyticsData?.newUsers ? 
                        Math.min((analyticsData.newUsers / analyticsData.totalUsers * 100), 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-secondary-8">
                  {analyticsData?.totalUsers && analyticsData?.newUsers ? 
                    ((analyticsData.newUsers / analyticsData.totalUsers) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-accent-1">
              <span className="text-secondary-7">Course Library Growth</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-green-100 rounded-full mr-3">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${analyticsData?.totalCourses && analyticsData?.newCourses ? 
                        Math.min((analyticsData.newCourses / analyticsData.totalCourses * 100), 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-secondary-8">
                  {analyticsData?.totalCourses && analyticsData?.newCourses ? 
                    ((analyticsData.newCourses / analyticsData.totalCourses) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-secondary-7">Active Users (Monthly)</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-orange-100 rounded-full mr-3">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${analyticsData?.totalUsers && analyticsData?.accountsReached ? 
                        Math.min((analyticsData.accountsReached / analyticsData.totalUsers * 100), 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-secondary-8">
                  {analyticsData?.totalUsers && analyticsData?.accountsReached ? 
                    ((analyticsData.accountsReached / analyticsData.totalUsers) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg font-nokia-bold">
          <div className="flex items-center mb-4">
            <Activity size={24} className="text-accent-6 mr-3" />
            <h3 className="text-xl font-bold text-secondary-8">System Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-secondary-7">API Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-base text-green-600 font-medium">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-7">Database</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-base text-green-600 font-medium">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-7">File Storage</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-base text-yellow-600 font-medium">Degraded</span>
              </div>
            </div>
            <div className="pt-4 border-t border-accent-1">
              <Link to="/admin/analytics/dashboard" className="text-accent-6 hover:text-accent-7 text-base font-medium">
                View detailed analytics →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
