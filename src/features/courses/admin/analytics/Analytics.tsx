// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// interface User {
//   id: number;
//   name: string;
// }

// interface Course {
//   id: number;
//   name: string;
// }

const Analytics: React.FC = () => {
  //   const [users, setUsers] = useState<User[]>([]);
  //   const [courses, setCourses] = useState<Course[]>([]);

  //   useEffect(() => {
  //     // Adjust the endpoints according to your API
  //     axios.get<User[]>('/api/users')
  //       .then(response => setUsers(response.data))
  //       .catch(error => console.error(error));

  //     axios.get<Course[]>('/api/courses')
  //       .then(response => setCourses(response.data))
  //       .catch(error => console.error(error));
  //   }, []);

  return (
    <div className="border border-accent-6 p-4 flex flex-col items-center mx-auto my-10 rounded-2xl font-nokia-bold text-secondary-6 shadow-lg shadow-accent-2 justify-center">
      <h1 className="text-3xl">Analytics Page</h1>
      <div className="grid grid-cols-2 gap-24">
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">24+</p>
          <p className="text-sm">New users</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">350 Total user accounts</p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">5+</p>
          <p className="text-sm">New courses</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">15 Total courses available</p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-accent-6 rounded-lg text-center">
          <p className="text-6xl">250</p>
          <p className="text-sm">Accounts reached</p>
          <hr className="border-accent-5 my-4" />
          <p className="text-accent-6 text-sm">In the past 1 month</p>
        </div>
        <div className="col-span-1 mt-4 gap-12 w-10% p-6 border border-red-500 rounded-lg text-center">
          <p className="text-6xl">-5</p>
          <p className="text-sm">Users left</p>
          <hr className="border-red-500 my-4" />
          <p className="text-red-500 text-sm">In the past 2 months</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
