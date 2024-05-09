import React, { useState, useEffect } from "react";
import { useGetAnalyticsQuery } from "@/redux/api-slices/apiSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DateRangePicker from "@/components/DateRangePicker";

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useGetAnalyticsQuery(dateRange);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching analytics data:", error);
    return <div>Error fetching analytics data.</div>;
  }

  const formatNumber = (value: number) => {
    const formattedValue = Math.abs(value).toLocaleString();
    return value >= 0 ? `+${formattedValue}` : `-${formattedValue}`;
  };

  const chartData = [
    { name: "New Users", value: analyticsData?.newUsers ?? 0 },
    { name: "New Courses", value: analyticsData?.newCourses ?? 0 },
    { name: "Accounts Reached", value: analyticsData?.accountsReached ?? 0 },
    { name: "Users Left", value: -(analyticsData?.usersLeft ?? 0) },
  ];

  return (
    <div className="bg-secondary-6 border border-accent-6 p-4 flex flex-col items-center mx-auto my-10 rounded-2xl font-nokia-bold text-primary-6 shadow-accent-2 justify-center shadow-2xl">
      <h1 className="text-3xl text-primary-6">Analytics Page</h1>
      <div className="flex justify-end w-full mb-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>
      <div className="grid grid-cols-2 gap-24 mt-6">
        {chartData.map((data, index) => (
          <div
            key={index}
            className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center"
          >
            <p className="text-6xl">{formatNumber(data.value)}</p>
            <p className="text-sm">{data.name}</p>
            {index === 2 && (
              <p className="text-accent-6 text-sm">In the past 1 month</p>
            )}
            {index === 3 && (
              <p className="text-red-500 text-sm">In the past 2 months</p>
            )}
          </div>
        ))}
      </div>
      <div className="w-full mt-8">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
