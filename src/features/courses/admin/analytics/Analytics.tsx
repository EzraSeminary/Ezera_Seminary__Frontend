import React, { useEffect, useState } from "react";
import axios from "axios";

// interface User {
//   id: number;
//   name: string;
// }

// interface Course {
//   id: number;
//   name: string;
// }

interface AnalyticsData {
  newUsers: number;
  totalUsers: number;
  newCourses: number;
  totalCourses: number;
  accountsReached: number;
  usersLeft: number;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    newUsers: 0,
    totalUsers: 0,
    newCourses: 0,
    totalCourses: 0,
    accountsReached: 0,
    usersLeft: 0,
  });

  useEffect(() => {
    // Adjust the endpoint according to your API
    axios
      .get<AnalyticsData>("/api/analytics")
      .then((response) => setAnalyticsData(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="bg-secondary-6 border border-accent-6 p-4 flex flex-col items-center mx-auto my-10 rounded-2xl font-nokia-bold text-primary-6 shadow-accent-2 justify-center shadow-2xl">
      <h1 className="text-3xl text-primary-6">Analytics Page</h1>
      <div className="grid grid-cols-2 gap-24 mt-6">
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">{analyticsData.newUsers}+</p>
          <p className="text-sm">New users</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">
            {analyticsData.totalUsers} Total user accounts
          </p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">{analyticsData.newCourses}+</p>
          <p className="text-sm">New courses</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">
            {analyticsData.totalCourses} Total courses available
          </p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">{analyticsData.accountsReached}</p>
          <p className="text-sm">Accounts reached</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">In the past 1 month</p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-red-600 rounded-lg text-center">
          <p className="text-6xl">-{analyticsData.usersLeft}</p>
          <p className="text-sm">Users left</p>
          <hr className="border-red-500 my-4" />
          <p className="text-red-500 text-sm">In the past 2 months</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
