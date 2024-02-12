import React from "react";
import { Link } from "react-router-dom";
import { useGetSSLsQuery } from "./../../services/SabbathSchoolApi"; // Ensure this path is correct

const SSLHome = () => {
  const { data: ssl, error, isLoading } = useGetSSLsQuery();

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ssl.map((item, index) => (
          <Link
            key={index}
            className="flex bg-white shadow-md rounded-md border border-accent-6 p-1 gap-2"
            to={item.id}
          >
            <img
              src={item.cover}
              alt={item.title}
              className="rounded-md h-42 w-1/2"
            />
            <div className="flex flex-col gap-1" style={{ maxHeight: "300px" }}>
              {" "}
              <p className="text-accent-6 text-sm">{item.human_date}</p>
              <h2 className="text-2xl text-secondary-6 mb-2 ">{item.title}</h2>
              <p className="text-secondary-5 text-sm overflow-hidden overflow-ellipsis">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SSLHome;
