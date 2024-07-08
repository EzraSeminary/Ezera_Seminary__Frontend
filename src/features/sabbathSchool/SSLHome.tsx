import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetSSLsQuery } from "./../../services/SabbathSchoolApi"; // Ensure this path is correct
import { motion } from "framer-motion";
import LoadingPage from "@/pages/user/LoadingPage";
import axios from "axios";
import { YoutubeLogo } from "@phosphor-icons/react";

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const gridSquareVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const SSLHome = () => {
  const { data: ssl, error, isLoading } = useGetSSLsQuery({});
  const [videoLinks, setVideoLinks] = useState({});

  useEffect(() => {
    const fetchVideoLinks = async () => {
      if (ssl) {
        const links = {};
        for (const item of ssl) {
          const [year, quarter] = item.id.split("-");
          try {
            const response = await axios.get(`/sslLinks/${year}/${quarter}/1`);
            links[item.id] = response.data.videoUrl;
          } catch (error) {
            console.error("Error fetching video link:", error);
          }
        }
        setVideoLinks(links);
      }
    };

    fetchVideoLinks();
  }, [ssl]);

  const sabbathSchoolLessons = ssl ?? [];

  if (error && "message" in error) return <div>Error: {error.message}</div>;

  if (isLoading) return <LoadingPage />;

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12"
    >
      {sabbathSchoolLessons.map((item, index) => (
        <motion.div
          key={index}
          variants={gridSquareVariants}
          whileHover={{
            scale: 1.03,
          }}
          transition={{
            bounceDamping: 10,
            bounceStiffness: 600,
          }}
        >
          <Link
            className="flex bg-white shadow-2xl rounded-md border border-accent-6 p-1 gap-2 h-48 md:h-52 lg:h-60"
            to={(item as { id?: string }).id ?? ""}
          >
            <img
              src={(item as { cover: string; title: string }).cover}
              alt={(item as { title: string }).title}
              className="rounded-md  w-1/2 object-fit"
            />
            <div
              className="flex flex-col py-2 h-full space-y-1"
              style={{ maxHeight: "300px" }}
            >
              <p className="text-accent-6 text-sm xl:text-lg">
                {(item as { human_date: string }).human_date}
              </p>
              <h2 className="text-xl md:text-xl xl:text-2xl text-secondary-6  ">
                {(item as { title: string }).title}
              </h2>
              <p className="text-secondary-5 text-xs xl:text-sm overflow-hidden overflow-ellipsis text-justify px-1">
                {(item as { description: string }).description}
              </p>
            </div>
            {videoLinks[item.id] && (
              <a
                href={videoLinks[item.id]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-max leading-snug md:leading-none md:w-auto px-2 xl:text-lg border border-accent-6 text-accent-6 text-xs flex rounded-full items-center gap-2 hover:border-accent-7 hover:text-accent-7">
                  Watch on YouTube{" "}
                  <YoutubeLogo weight="fill" className="text-lg md:text-xl" />
                </button>
              </a>
            )}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SSLHome;
