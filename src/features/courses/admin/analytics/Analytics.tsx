import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
}

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
    <div className="border border-secondary-3 p-4 flex flex-col items-center mx-auto my-10 rounded-2xl font-nokia-bold text-secondary-6">
      <h1 className="text-2xl">Analytics Page</h1>
      <div className='flex flex-row gap-8'>
      <div className="mt-4 gap-2 p-4 border border-accent-6 rounded-lg">
        <h2 className="text-lg font-semibold">Users</h2>
      </div>
      <div className="mt-4 gap-2 p-4">
        <h2 className="text-lg font-semibold">Courses</h2>
      </div>
      </div>
    </div>
  );
}

export default Analytics;