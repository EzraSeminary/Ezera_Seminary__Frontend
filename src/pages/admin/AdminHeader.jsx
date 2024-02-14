import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png"; // replace with your logo path

const AdminHeader = () => {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<header className="flex justify-between items-center p-4 bg-blue-500 text-white">
			<img src={logo} alt="Logo" className="h-10" />
			<div>
				<span>{time.toLocaleDateString()}</span>
				<span className="ml-4">{time.toLocaleTimeString()}</span>
			</div>
		</header>
	);
};

export default AdminHeader;
