import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { FaRegUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { Button } from "./ui/button";
import bgImage from "../assets/header-img.webp";
import { RootState } from "@/redux/store";

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  {/* State to control account modal  */ }
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  {/* State to control mobile menu bar  */ }
  const [showMenu, setShowMenu] = useState<boolean>(false);


  {/* State and Effect to control header by listening the scroll */ }
  const [show, handleShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        handleShow(true);
      } else handleShow(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  {/* Function to open the account modal */ }
  const handleAccountClick = () => {
    setShowAccountModal((prev) => !prev);
  };

  {/* Function to open the mobile menu */ }
  const handleMenuClick = () => {
    setShowMenu((prev) => !prev);
  };

  {/* Function to close the mobile menu */ }
  const closeMenu = () => {
    setShowMenu(false);
  };

  {/* Ref to listen the curser and close the account modal */ }
  const ref = useRef<HTMLLIElement>(null);
  useOnClickOutside(ref, showAccountModal, () => setShowAccountModal(false));

  return (
    <header className="relative max-w-screen mb-8">
      {/* Header Background Image */}
      <div className="absolute top-0 z-0 w-full h-16 shadow-xl">
        <img
          src={bgImage}
          className="w-full h-full  object-cover"
          alt="Background"
        />
      </div>
      {/* Header when the scroll is above 20  */}
      <div className="relative z-50 py-2">
        {show && (
          <div className="fixed top-0 z-0 w-full h-16  bg-white shadow-xl">
            {/* Header Background Image */}
            {/* <img
              src={bgImage}
              className="w-full h-full -mt-3 object-cover"
              alt="Background"
            /> */}
            {/* Navigation and Logo */}
            <div className="absolute top-[32%]  w-full md:top-[16%] ">
              <div className="  flex justify-between items-center  w-[90%] md:w-[95%] lg:w-[85%] mx-auto ">

                <div className=" z-30 h-full flex justify-center items-center  md:space-x-0   xl:space-x-1 cursor-pointer ">
                  <img src="src/assets/ezra-logo.svg" className="w-8 h-5 md:w-10 md:h-6 lg:w-10 lg:h-7  xl:w-12 xl:h-9 z-30 bg-secondary-6 object-contain" alt="" />
                  <NavLink to="/" onClick={closeMenu}>
                  <h3 className=" font-nokia-bold text-xs md:text-sm lg:text-lg xl:text-2xl ">
                    <strong>Ezra</strong> Seminary
                  </h3>
                  </NavLink>
                </div>
                {/* MenuBar */}
                <div className="md:hidden  flex">
                  <button
                    onClick={handleMenuClick}
                    className=" focus:outline-none "
                  >
                    {showMenu ? (
                      <FaTimes
                        size={20}
                        className="z-20 fixed top-[1.5rem] left-[90%] block text-primary-1"
                      />
                    ) : (
                      <FaBars size={20} className="text-secondary-6 fixed top-[1.5rem] left-[90%] block" />
                    )}
                  </button>
                </div>
                {/* Navigation */}
                <ul
                  className={`${showMenu
                    ? "flex flex-col justify-center items-end text-xl text-primary-1 font-nokia-bold h-auto bg-secondary-6 overflow-auto bg-opacity-80  w-full z-10 top-0 left-0 bottom-0 transform -translate-x-100 transition-transform ease-in-out duration-200 pr-8 space-y-2 fixed cursor-pointer"
                    : "hidden  cursor-pointer  md:flex md:items-center md:justify-end  md:text-xs gap-[0.4rem] lg:space-x-2 xl:text-lg xl:space-x-2  text-secondary-6 font-nokia-bold transition-all"
                    }`}
                >
                  <li className="  hover:text-accent-6">
                    <NavLink to="/" onClick={closeMenu}>
                      Home
                    </NavLink>
                  </li>
                  <li className="hover:text-accent-6">
                    <NavLink to="/courses" onClick={closeMenu}>
                      Courses
                    </NavLink>
                  </li>
                  <li className="hover:text-accent-6">
                    <NavLink to="/sabbathSchool" onClick={closeMenu}>
                      Sabbath School
                    </NavLink>
                  </li>
                  <li className="hover:text-accent-6">
                    <NavLink to="/devotion" onClick={closeMenu}>
                      Devotion
                    </NavLink>
                  </li>
                  <li className="hover:text-accent-6">
                    <NavLink to="/aboutUs" onClick={closeMenu}>
                      About Us
                    </NavLink>
                  </li>
                  <li className="hover:text-accent-6">
                    <NavLink to="/contactUs" onClick={closeMenu}>
                      Contact Us
                    </NavLink>
                  </li>
                  {user ? (
                    <li ref={ref} className="relative">
                      <div
                        className="flex items-center space-x-2 bg-accent-6 rounded-full py-1 px-2 lg:px-3 xl:px-4 xl:py-2 hover:bg-accent-7 cursor-pointer"
                        onClick={handleAccountClick}
                      >
                        <FaRegUserCircle />
                        <div className="text-xs  xl:text-lg font-medium text-white">
                          {user.firstName}
                        </div>
                      </div>
                      {showAccountModal && (
                        <div className="absolute top-[40px] right-0 bg-accent-6 shadow-lg rounded-md z-10">
                          <div className="px-4 py-2 border-b">
                            Logged in as: {user.email}
                          </div>
                          <div className="px-4 py-2 border-b">
                            Role: {user.role}
                          </div>
                          <div className="px-4 py-2 border-b">
                            <NavLink to="/profile">Profile Settings</NavLink>
                          </div>
                          {user.role === "Admin" && (
                            <div className="px-4 py-2 border-b">
                              <NavLink to="/admin">Dashboard</NavLink>
                            </div>
                          )}
                          <div className="px-4 py-2">
                            <LogoutButton />
                          </div>
                        </div>
                      )}
                    </li>
                  ) : (
                    <>
                      <li className="hover:text-gray-400">
                        <NavLink to="/logIn">Log In</NavLink>
                      </li>
                      <li className="hover:text-gray-400 text-base ">
                        <NavLink to="/signup">
                          <Button size="round" className=" bg-accent-6 rounded-full px-3 py-1 text-xs xl:px-5 xl:py-7  xl:text-lg  hover:bg-accent-7 cursor-pointer transition-all">Create Account</Button>
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )
        }
      </div>
      {/* Header when the scroll is below 20  */}
      <div className="relative z-30 py-2">
        <div className="absolute -top-1  w-full ">
          <div className=" flex justify-between items-center text-white font-nokia-bold w-[90%] md:w-[95%] lg:w-[85%] mx-auto">
            {/* Logo */}
            <div className="flex justify-center items-center  md:space-x-0   xl:space-x-1 cursor-pointer ">
              <img src="src/assets/ezra-logo.svg" className="w-8 h-5 md:w-10 md:h-6 lg:w-10 lg:h-7 xl:w-12 xl:h-9" alt="" />
              <NavLink to="/" onClick={closeMenu}>
                <h3 className="text-xs md:text-sm lg:text-lg xl:text-2xl">
                  <strong >Ezra</strong> Seminary
                </h3>
              </NavLink>
            </div>
            {/* Navigation and Logo */}
            <nav>
              {/* MenuBar */}
              <div className="md:hidden  flex">
                <button
                  onClick={handleMenuClick}
                  className="text-white focus:outline-none "
                >
                  {showMenu ? (
                    <FaTimes
                      size={20}
                      className="z-20 fixed top-[2.2rem] left-[90%]"
                    />
                  ) : (
                    <FaBars size={20} className=" z-20 top-[2.7rem] left-[90%] block" />
                  )}
                </button>
              </div>
              {/* Navigation */}
              <ul
                className={`${showMenu
                  ? "flex flex-col justify-center items-end text-xl font-nokia-bold h-auto bg-secondary-6 overflow-auto bg-opacity-80  w-full z-10 top-0 left-0 bottom-0 transform -translate-x-100 transition-transform ease-in-out duration-200 pr-8 space-y-2 fixed cursor-pointer"
                  : "hidden font-Lato-Regular  cursor-pointer  md:flex md:items-center md:justify-end md:text-xs gap-[0.4rem] lg:space-x-2 xl:text-lg xl:space-x-2  "
                  }`}
              >
                <li className="hover:text-accent-6">
                  <NavLink to="/" onClick={closeMenu}>
                    Home
                  </NavLink>
                </li>
                <li className="hover:text-accent-6">
                  <NavLink to="/courses" onClick={closeMenu}>
                    Courses
                  </NavLink>
                </li>
                <li className="hover:text-accent-6">
                  <NavLink to="/sabbathSchool" onClick={closeMenu}>
                    Sabbath School
                  </NavLink>
                </li>
                <li className="hover:text-accent-6">
                  <NavLink to="/devotion" onClick={closeMenu}>
                    Devotion
                  </NavLink>
                </li>
                <li className="hover:text-accent-6">
                  <NavLink to="/aboutUs" onClick={closeMenu}>
                    About Us
                  </NavLink>
                </li>
                <li className="hover:text-accent-6">
                  <NavLink to="/contactUs" onClick={closeMenu}>
                    Contact Us
                  </NavLink>
                </li>
                {user ? (
                  <li ref={ref} className="relative">
                    <div
                      className="flex items-center space-x-2 bg-accent-6 rounded-full px-2 py-1 text-xs1  hover:bg-accent-7 cursor-pointer"
                      onClick={handleAccountClick}
                    >
                      <FaRegUserCircle />
                      <div className="text-xs  xl:text-lg font-medium text-white">
                        {user.firstName}
                      </div>
                    </div>
                    {showAccountModal && (
                      <div className="absolute top-[40px] right-0 bg-accent-6 shadow-lg rounded-md z-10">
                        <div className="px-4 py-2 border-b">
                          Logged in as: {user.email}
                        </div>
                        <div className="px-4 py-2 border-b">
                          Role: {user.role}
                        </div>
                        <div className="px-4 py-2 border-b">
                          <NavLink to="/profile">Profile Settings</NavLink>
                        </div>
                        {user.role === "Admin" && (
                          <div className="px-4 py-2 border-b">
                            <NavLink to="/admin">Dashboard</NavLink>
                          </div>
                        )}
                        <div className="px-4 py-2">
                          <LogoutButton />
                        </div>
                      </div>
                    )}
                  </li>
                ) : (
                  <>
                    <li className="hover:text-gray-400">
                      <NavLink to="/logIn">Log In</NavLink>
                    </li>
                    <li className="hover:text-gray-400 text-base ">
                      <NavLink to="/signup">
                        <Button size="round" className=" bg-accent-6 rounded-full px-3 py-1 text-xs xl:px-5 xl:py-7  xl:text-lg  hover:bg-accent-7 cursor-pointer transition-all">Create Account</Button>
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;