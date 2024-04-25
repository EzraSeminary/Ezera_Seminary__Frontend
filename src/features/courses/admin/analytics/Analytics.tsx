// import React, { useEffect } from "react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AnalyticsData {
  newUsers: number;
  totalUsers: number;
  newCourses: number;
  totalCourses: number;
  accountsReached: number;
  usersLeft: number;
}

const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ezra-seminary.mybese.tech",
    prepareHeaders: (headers) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user ? user.token : "";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => "/analytics",
    }),
  }),
});

const { useGetAnalyticsQuery } = analyticsApi;

const Analytics: React.FC = () => {
  const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching analytics data:", error);
    return <div>Error fetching analytics data.</div>;
  }

  return (
    <div className="bg-secondary-6 border border-accent-6 p-4 flex flex-col items-center mx-auto my-10 rounded-2xl font-nokia-bold text-primary-6 shadow-accent-2 justify-center shadow-2xl">
      <h1 className="text-3xl text-primary-6">Analytics Page</h1>
      <div className="grid grid-cols-2 gap-24 mt-6">
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">{analyticsData?.newUsers}+</p>
          <p className="text-sm">New users</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">
            {analyticsData?.totalUsers} Total user accounts
          </p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">{analyticsData?.newCourses}+</p>
          <p className="text-sm">New courses</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">
            {analyticsData?.totalCourses} Total courses available
          </p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">{analyticsData?.accountsReached}</p>
          <p className="text-sm">Accounts reached</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">In the past 1 month</p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-red-600 rounded-lg text-center">
          <p className="text-6xl">-{analyticsData?.usersLeft}</p>
          <p className="text-sm">Users left</p>
          <hr className="border-red-500 my-4" />
          <p className="text-red-500 text-sm">In the past 2 months</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
