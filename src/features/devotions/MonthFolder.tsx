import React from "react";
import { Devotion } from "@/redux/types";
import { motion } from "framer-motion";
import { Folder, FolderOpen } from "@phosphor-icons/react";

interface MonthFolderProps {
  month: string;
  devotions: Devotion[];
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
  devotions = [], // Provide a default value for devotions
  setSelectedDevotion,
  isSelected,
  onSelect,
  isExpanded,
}) => {
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
          <FolderOpen className="mr-2 text-yellow-500" size={40} />
        ) : (
          <Folder className="mr-2 text-yellow-500" size={40} />
        )}
        {month}
      </div>
      {isSelected && (
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          animate="show"
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 ${
            isExpanded ? "w-full" : "w-[90%]"
          } mx-auto pb-4 mt-2`}
        >
          {devotions.map((devotion, index: number) => (
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
              className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl h-full border-accent-5 border text-center pb-4 font-nokia-bold"
              onClick={() => {
                setSelectedDevotion(devotion);
              }}
            >
              {/* Devotion Images */}
              <div className="h-full w-full">
                <img
                  src={
                    typeof devotion.image === "string"
                      ? devotion.image
                      : undefined
                  }
                  alt="Devotion Image"
                  className="w-full object-contain rounded-t-xl bg-secondary-1"
                />
              </div>

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
      )}
    </div>
  );
};

export default MonthFolder;
