import { useState } from "react";
import SSLHome from "@/features/SabbathSchoolComponent/SSLHome";
import CurrentSSL from "@/features/SabbathSchoolComponent/CurrentSSL";
import { MagnifyingGlass } from "@phosphor-icons/react";

const SabbathSchool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchIconClick = () => {
    setShowInput(!showInput);
  };
  const isSmallScreen = window.matchMedia("(max-width: 426px)").matches;
  return (
    <div className="container mx-auto px-4 w-[90%] md:w-[80%] py-12 font-nokia-bold text-secondary-6">
      <CurrentSSL />
      <div className="my-8">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p>Explore quarterly lessons</p>
            <p className="text-2xl text-accent-6 leading-7 mb-2">
              Lessons of previous quarters
            </p>
          </div>
          <div>
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
                      className="text-xs text-secondary-6 border border-accent-6 w-[70%] outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
                    />
                  )}
                  <span
                    className="cursor-pointer border  rounded-r-lg px-2 py-[0.4rem] -ml-1 bg-accent-5 text-white block"
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
                    className="text-xs text-secondary-6 border border-accent-6 w-64 outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
                  />
                  <span
                    className=" self-center cursor-pointer border  rounded-r-lg px-3 py-[0.54rem] -ml-1 bg-accent-5 text-white"
                    onClick={handleSearchIconClick}
                  >
                    <MagnifyingGlass size={20} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border border-b-accent-6 " />
      </div>
      <SSLHome />
    </div>
  );
};

export default SabbathSchool;
