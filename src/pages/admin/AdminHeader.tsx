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
    <header className="flex justify-between items-center p-6 bg-gradient-to-r from-secondary-6 to-secondary-7 text-white my-8 rounded-2xl shadow-2xl font-nokia-bold border border-secondary-5">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
          <img src={logo} alt="Logo" className="h-8" />
        </div>
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold text-accent-1">Ezra Seminary</h1>
          <p className="text-base text-accent-2 opacity-75">Admin Dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-accent-1 text-base font-medium">
            {time.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-accent-2 text-sm opacity-75">Current Date</p>
        </div>
        <div className="px-4 py-3 bg-gradient-to-r from-accent-6 to-accent-7 rounded-xl shadow-lg border border-accent-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold text-xl tabular-nums">
              {time.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
