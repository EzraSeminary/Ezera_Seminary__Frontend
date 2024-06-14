// import { useEffect, useState } from "react";
// import { useGetAnalyticsQuery } from "@/redux/api-slices/apiSlice";
// import { AnalyticsData } from "@/redux/types";
// import { Line, Bar, Pie } from "react-chartjs-2";
// import "chart.js/auto";

const PerformanceDashboard: React.FC = () => {
//   const { data: analyticsData, isLoading, isError } = useGetAnalyticsQuery();
//   const [chartData, setChartData] = useState<AnalyticsData | null>(null);

//   useEffect(() => {
//     if (analyticsData) {
//       setChartData(analyticsData);
//     }
//   }, [analyticsData]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError || !chartData) {
//     return <div>Error fetching analytics data</div>;
//   }

//   // Prepare chart data
//   const courseCompletionData = {
//     labels: chartData.highestPerformingCourses.map((course) => course.title),
//     datasets: [
//       {
//         label: "Course Completions",
//         data: chartData.highestPerformingCourses.map(
//           (course) => course.completions
//         ),
//         backgroundColor: "rgba(75,192,192,0.2)",
//         borderColor: "rgba(75,192,192,1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const userPerformanceData = {
//     labels: chartData.highestPerformingUsers.map(
//       (user) => `${user.firstName} ${user.lastName}`
//     ),
//     datasets: [
//       {
//         label: "User Performance",
//         data: chartData.highestPerformingUsers.map((user) => user.avgScore),
//         backgroundColor: "rgba(255,99,132,0.2)",
//         borderColor: "rgba(255,99,132,1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const overallAnalyticsData = {
//     labels: [
//       "Courses Assigned",
//       "Course Completions",
//       "Avg Completion Rate",
//       "Avg Time to Complete",
//     ],
//     datasets: [
//       {
//         label: "Overall Analytics",
//         data: [
//           chartData.coursesAssigned,
//           chartData.courseCompletions,
//           chartData.avgCompletionRate,
//           // Convert avgTimeToComplete to a number (e.g., 6h2m8s to 6.034)
//           parseFloat(
//             chartData.avgTimeToComplete.split("h").join(".").split("m").join("")
//           ) || 0,
//         ],
//         backgroundColor: "rgba(153, 102, 255, 0.2)",
//         borderColor: "rgba(153, 102, 255, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

  return (
    <div>
      <h2>Performance Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3>Highest Performing Courses</h3>
          {/* <Bar data={courseCompletionData} /> */}
        </div>
        <div>
          <h3>Highest Performing Users</h3>
          {/* <Bar data={userPerformanceData} /> */}
        </div>
        <div>
          <h3>Overall Analytics</h3>
          {/* <Pie data={overallAnalyticsData} /> */}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
