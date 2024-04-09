import { Link } from "react-router-dom";
import { useGetSSLsQuery } from "./../../services/SabbathSchoolApi"; // Ensure this path is correct
import { motion } from "framer-motion";
import LoadingPage from "@/pages/user/LoadingPage";

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

  const sabbathSchoolLessons = ssl ?? [];

  if (error && "message" in error) return <div>Error: {error.message}</div>;

  if (isLoading) return <LoadingPage />;

  return (
    // <div className="">
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
          </Link>
        </motion.div>
      ))}
    </motion.div>
    // </div>
  );
};

export default SSLHome;
