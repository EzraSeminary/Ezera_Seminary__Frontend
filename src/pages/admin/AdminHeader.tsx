import { useEffect, useState } from "react";
import logo from "@/assets/MainLogo.png"; // replace with your logo path

const AdminHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-secondary-6 text-accent-6 my-8 rounded-lg font-nokia-bold">
      <img src={logo} alt="Logo" className="h-10" />
      <div>
        <span className="w-48 h-12 mr-4 px-4 py-2 bg-primary-1 rounded-md ">
          {time.toLocaleTimeString()}
        </span>
        <span>
          {time.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </header>
  );
};

export default AdminHeader;
