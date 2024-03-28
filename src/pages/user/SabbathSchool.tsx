import { SetStateAction, useState } from "react";
import SSLHome from "@/features/sabbathSchool/SSLHome";
import CurrentSSL from "@/features/sabbathSchool/CurrentSSL";
import { MagnifyingGlass } from "@phosphor-icons/react";
import Footer from "@/components/Footer";

const SabbathSchool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchIconClick = () => {
    setShowInput(!showInput);
  };
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  return (
    <div className="flex flex-col min-h-screen absolute top-0 w-full">
      <div className="sabbath-img bg-cover  w-full py-14  md:py-20 lg:py-28  flex  justify-center items-center pointer-events-none">
        <div className=" z-10 text-primary-1 align-middle font-bold text-center">
          <div className=" text-2xl md:text-5xl">
            sabbath <span className="text-accent-6">School</span>
          </div>

          <div className="text-lg md:text-3xl tracking-widest text-accent-6">
            የሰንበት <span className="text-primary-1">ትምህርት</span>
          </div>
        </div>
      </div>
      <div className="container mt-12 mx-auto px-4 w-[90%] md:w-[80%]  font-nokia-bold text-secondary-6 flex-1">
        <CurrentSSL />
        <div className="my-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col w-full">
              <p>Explore quarterly lessons</p>
              <p className="text-lg md:text-2xl text-accent-6 leading-7 mb-2">
                Lessons of previous quarters
              </p>
            </div>
            <div>
              {/* Search bar */}
              <div className="flex justify-between items-center">
                {isSmallScreen ? (
                  <div className="flex items-center justify-end ">
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
                      className="text-xs text-secondary-6 border border-accent-6 w-auto outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
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
      <Footer />
    </div>
  );
};

export default SabbathSchool;
