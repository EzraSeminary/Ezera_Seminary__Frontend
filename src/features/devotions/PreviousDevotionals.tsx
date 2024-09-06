import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Devotion } from "@/redux/types";

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const gridSquareVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const PreviousDevotionals = ({
  previousDevotions,
  setSelectedDevotion,
}: {
  previousDevotions: Devotion[];
  setSelectedDevotion: (devotion: Devotion) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [devotionsPerPage] = useState(12);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset the current page when the search term changes
  };

  const handleSearchIconClick = () => {
    setShowInput(!showInput);
  };

  const filteredData = (previousDevotions ?? []).filter((devotion) => {
    return devotion.month.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const isSmallScreen = window.matchMedia("(max-width: 429px)").matches;
  const isMediumScreen = window.matchMedia("(max-width: 1023px)").matches;

  const indexOfLastDevotion = currentPage * devotionsPerPage;
  const indexOfFirstDevotion = indexOfLastDevotion - devotionsPerPage;
  const currentDevotions = filteredData.slice(
    indexOfFirstDevotion,
    indexOfLastDevotion
  );

  const totalPages = Math.ceil(filteredData.length / devotionsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col h-auto space-y-6 w-[100%] mx-auto ">
      {/* Container of title and seacrch bar*/}

      <div className="flex justify-between items-end w-[94%] mx-auto">
        {/* Title of the page */}
        <div className="w-full tracking-wide">
          <h1 className="text-secondary-6 text-xl font-nokia-bold md:text-3xl ">
            Previous Devotionals
          </h1>
          <h3 className="text-accent-6 text-xs font-Lato-Regular md:text-sm ">
            Explore Programs and Devotionals
          </h3>
          <h2 className="hidden md:block text-secondary-6 text-sm font-Lato-Regular md:text-sm ">
            Our Most Popular Devotionals
          </h2>
        </div>
        {/* Search bar */}
        <div className="flex justify-between items-center">
          {isSmallScreen ? (
            <div className="flex items-center justify-end">
              {showInput && (
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="text-xs text-secondary-6 border border-accent-6 w-[50%] outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
                />
              )}
              <span
                className="cursor-pointer border  rounded-r-lg px-1 py-[0.4rem] -ml-1 bg-accent-6 text-white block"
                onClick={handleSearchIconClick}
              >
                <MagnifyingGlass size={20} />
              </span>
            </div>
          ) : (
            <div className="flex  ">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="text-xs text-secondary-6 border border-accent-6 w-auto outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
              />
              <span
                className=" self-center cursor-pointer border  rounded-r-lg px-1 py-[0.54rem] -ml-1 bg-accent-6 text-white"
                onClick={handleSearchIconClick}
              >
                <MagnifyingGlass size={20} />
              </span>
            </div>
          )}
        </div>
      </div>
      <hr className="border-accent-5 border-1 w-[100%] pb-3 md:w-[30%] md:ml-5 lg:ml-9 " />

      {/* cards */}
      {isSmallScreen ? (
        <div className=" grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 lg:gap-3 w-[90%]  mx-auto pb-4">
          {currentDevotions.map((devotion, index: number) => (
            <div
              key={index}
              className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border text-center pb-4 font-nokia-bold"
            >
              {/* devotion Images */}
              <div className="h-full w-full">
                <img
                  src={
                    typeof devotion.image === "string"
                      ? devotion.image
                      : undefined
                  }
                  alt="Devotion Image"
                  className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-t-xl bg-secondary-1"
                  onClick={() => {
                    setSelectedDevotion(devotion);
                  }}
                />
              </div>
              {/* devotion title and button */}
              <div className="w-[90%] mx-auto flex justify-between items-center ">
                <div className="w-[80%] flex flex-col items-start justify-start pt-2">
                  <h1 className="font-customBold text-lg text-left mt-2">
                    {devotion.title}
                  </h1>

                  <h2 className="font-customBold text-sm text-[#EA9215]">
                    {/* {devotion.chapter} */}
                    {devotion.month} {devotion.day}
                  </h2>
                </div>
                <div className="w-[20%]">
                  <Button
                    type="button"
                    className="text-[#fff] bg-accent-6 text-xs font-nokia-bold w-[100%] border-2  rounded-full  px-2 hover: hover:bg-accent-7"
                    size="devotion"
                    onClick={() => {
                      setSelectedDevotion(devotion);
                    }}
                  >
                    ክፈት
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isMediumScreen ? (
        <div className=" grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 lg:gap-3 w-[90%]  mx-auto pb-4">
          {currentDevotions.map((devotion, index: number) => (
            <div
              key={index}
              className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border text-center pb-4 font-nokia-bold"
            >
              {/* devotion Images */}
              <div className="h-full w-full">
                <img
                  src={
                    typeof devotion.image === "string"
                      ? devotion.image
                      : undefined
                  }
                  alt="Devotion Image"
                  className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-t-xl bg-secondary-1"
                  onClick={() => {
                    setSelectedDevotion(devotion);
                  }}
                />
              </div>
              {/* devotion title and button */}
              <div className="w-[90%] mx-auto flex justify-between items-center ">
                <div className="w-[80%] flex flex-col items-start justify-start pt-2">
                  <h1 className="font-customBold text-lg text-left mt-2">
                    {devotion.title}
                  </h1>

                  <h2 className="font-customBold text-sm text-[#EA9215]">
                    {/* {devotion.chapter} */}
                    {devotion.month} {devotion.day}
                  </h2>
                </div>
                <div className="w-[20%]">
                  <Button
                    type="button"
                    className="text-[#fff] bg-accent-6 text-xs font-nokia-bold w-[100%] border-2  rounded-full  px-2 hover: hover:bg-accent-7"
                    size="devotion"
                    onClick={() => {
                      setSelectedDevotion(devotion);
                    }}
                  >
                    ክፈት
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          animate="show"
          className=" grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 lg:gap-5 w-[90%]  mx-auto pb-4"
        >
          {currentDevotions.map((devotion, index: number) => (
            <motion.div
              variants={gridSquareVariants}
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                bounceDamping: 10,
                bounceStiffness: 600,
              }}
              key={index}
              className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border text-center pb-4 font-nokia-bold"
            >
              {/* devotion Images */}
              <div className="h-full w-full">
                <img
                  src={
                    typeof devotion.image === "string"
                      ? devotion.image
                      : undefined
                  }
                  alt="Devotion Image"
                  className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-t-xl bg-secondary-1"
                  onClick={() => {
                    setSelectedDevotion(devotion);
                  }}
                />
              </div>
              {/* devotion title and button */}
              <div className="w-[90%] mx-auto flex justify-between items-center ">
                <div className="w-[80%] flex flex-col items-start justify-start pt-2">
                  <h1 className="font-customBold text-lg text-left mt-2">
                    {devotion.title}
                  </h1>

                  <h2 className="font-customBold text-sm text-[#EA9215]">
                    {/* {devotion.chapter} */}
                    {devotion.month} {devotion.day}
                  </h2>
                </div>
                <div className="w-[20%]">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      // backgroundColor:  "#C77C12",
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                      bounceDamping: 10,
                      bounceStiffness: 600,
                    }}
                    type="button"
                    className="text-[#fff] bg-accent-6 text-xs font-nokia-bold w-[100%] border-2  rounded-full  px-2 hover: hover:bg-accent-7"
                    // size="devotion"
                    onClick={() => {
                      setSelectedDevotion(devotion);
                    }}
                  >
                    ክፈት
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination controls */}
      <div className="flex  justify-center items-center gap-1 md:gap-4 my-4">
        <button
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-accent-6"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={`px-4 py-2 rounded-md hidden sm:flex ${
                currentPage === pageNumber
                  ? "bg-accent-6 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}
        <button
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-accent-6"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

PreviousDevotionals.propTypes = {
  previousDevotions: PropTypes.array.isRequired,
  setSelectedDevotion: PropTypes.func.isRequired,
};

export default PreviousDevotionals;
