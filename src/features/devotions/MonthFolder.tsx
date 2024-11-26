// MonthFolder.tsx
import React from "react";
import { Devotion } from "@/types/devotionTypes";
import { motion } from "framer-motion";
import { Folder, FolderOpen } from "@phosphor-icons/react";
import { useGetDevotionsByMonthQuery } from "@/redux/api-slices/apiSlice";
import LoadingPage from "@/pages/user/LoadingPage";
import { skipToken } from "@reduxjs/toolkit/query";

interface MonthFolderProps {
  month: string;
  setSelectedDevotion: (devotion: Devotion) => void;
  isSelected: boolean;
  onSelect: () => void;
  isExpanded: boolean;
}

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

const MonthFolder: React.FC<MonthFolderProps> = ({
  month,
  devotions, // Initial devotions (current month)
  isSelected,
  onSelect,
  isExpanded,
}) => {
  // Fetch devotions for the month when expanded
  const {
    data: monthDevotions,
    isLoading,
    error,
  } = useGetDevotionsByMonthQuery(isExpanded ? month : skipToken);

  const handleSelect = (devotion: Devotion) => {
    setSelectedDevotion(devotion);
    onSelect();
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        isExpanded ? "col-span-full" : "col-span-1"
      }`}
    >
      <div
        className="cursor-pointer text-lg font-bold flex items-center"
        onClick={onSelect}
      >
        {isSelected ? (
          <FolderOpen className="mr-2 text-accent-5" size={40} />
        ) : (
          <Folder className="mr-2 text-accent-5" size={40} />
        )}
        {month}
      </div>
      {isSelected && (
        <>
          {isLoading && <LoadingPage />}
          {error && <div>Error loading devotions for {month}</div>}
          {!isLoading &&
          !error &&
          monthDevotions &&
          monthDevotions.length > 0 ? (
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              animate="show"
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 ${
                isExpanded ? "w-full" : "w-[90%]"
              } mx-auto pb-4 mt-2`}
            >
              {monthDevotions.map((devotion) => (
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
                  key={devotion._id}
                  className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl h-full border-accent-5 border text-center pb-4 font-nokia-bold"
                  onClick={() => handleSelect(devotion)}
                >
                  {/* Devotion Images */}
                  {devotion.image && (
                    <div className="h-full w-full">
                      <img
                        src={devotion.image}
                        alt="Devotion Image"
                        className="w-full object-contain rounded-t-xl bg-secondary-1"
                      />
                    </div>
                  )}

                  {/* Devotion title */}
                  <div className="w-[90%] mx-auto flex justify-between items-center">
                    <div className="w-[80%] flex flex-col items-start justify-start pt-2">
                      <h1 className="font-customBold text-lg text-left mt-2">
                        {devotion.title}
                      </h1>
                      <h2 className="font-customBold text-sm text-[#EA9215]">
                        {devotion.month} {devotion.day}
                      </h2>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="mt-2 text-sm text-gray-500">
              No devotions available for this month.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MonthFolder;
