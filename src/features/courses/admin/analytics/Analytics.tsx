import React from "react";
import { useGetAnalyticsQuery } from "@/redux/api-slices/apiSlice";
import LoadingPage from "@/pages/user/LoadingPage";

const Analytics: React.FC = () => {
  const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery();

  console.log(analyticsData);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    console.error("Error fetching analytics data:", error);
    return <div>Error fetching analytics data.</div>;
  }

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return "0";
    }

    const formattedValue = Math.abs(value).toLocaleString();
    return value >= 0 ? `+${formattedValue}` : `-${formattedValue}`;
  };

  return (
    <div className="bg-secondary-6 border border-accent-6 p-4 flex flex-col items-center mx-auto my-10 rounded-2xl font-nokia-bold text-primary-6 shadow-accent-2 justify-center shadow-2xl">
      <h1 className="text-3xl text-primary-6">Analytics Page</h1>
      <div className="grid grid-cols-2 gap-24 mt-6">
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">
            {formatNumber(analyticsData?.newUsers ?? 0)}
          </p>
          <p className="text-sm">New users</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">
            {analyticsData?.totalUsers} Active user accounts
          </p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">
            {formatNumber(analyticsData?.newCourses ?? 0)}
          </p>
          <p className="text-sm">New courses</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">
            {analyticsData?.totalCourses} Total courses available
          </p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">
            {formatNumber(analyticsData?.accountsReached ?? 0)}
          </p>
          <p className="text-sm">Accounts reached</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">Active users in the past 1 month</p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-red-600 rounded-lg text-center">
          <p className="text-6xl">
            {formatNumber(-(analyticsData?.usersLeft ?? 0))}
          </p>
          <p className="text-sm">Users left</p>
          <hr className="border-red-500 my-4" />
          <p className="text-red-500 text-sm">
            Inactive for 2+ months or deleted
          </p>
        </div>
      </div>
      
      {/* Additional Analytics Info */}
      <div className="mt-8 p-6 border border-accent-6 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-4">User Engagement Metrics</h2>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {analyticsData?.dailyActiveUsers ?? 0}
            </p>
            <p className="text-sm text-accent-6">Daily Active Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {analyticsData?.weeklyActiveUsers ?? 0}
            </p>
            <p className="text-sm text-accent-6">Weekly Active Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {analyticsData?.userEngagementRate?.toFixed(1) ?? 0}%
            </p>
            <p className="text-sm text-accent-6">Engagement Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
