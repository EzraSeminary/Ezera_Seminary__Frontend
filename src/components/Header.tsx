import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaRegUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { Button } from "./ui/button";
import bgImage from "../assets/header-img.webp";

const Header: React.FC = () => {
  const { user } = useAuthContext();
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleAccountClick = () => {
    setShowAccountModal((prev) => !prev);
  };

  const handleMenuClick = () => {
    setShowMenu((prev) => !prev);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const ref = useRef<HTMLLIElement>(null);
  useOnClickOutside(ref, showAccountModal, () => setShowAccountModal(false));

  return (
    <header className="relative max-w-screen h-32">
      <div className="absolute top-0 z-0 w-full h-full">
        {/* Background Image */}
        <img
          src={bgImage}
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>
      <div className="relative z-10 py-6">
        {/* Navigation and Logo */}
        <div className="flex justify-between py-3 items-center text-white font-nokia-bold w-[90%]  lg:w-[80%] mx-auto">
          <div className="flex justify-center items-center  md:space-x-0   xl:space-x-1 cursor-pointer ">
            <img src="src/assets/ezra-logo.svg" className="w-8 h-5 md:w-10 md:h-6 lg:w-10 lg:h-7 " alt="" />
            <NavLink to="/" onClick={closeMenu}>
              <h3 className="text-xs md:text-sm lg:text-lg xl:text-xl">
                <strong >Ezra</strong> Seminary
              </h3>
            </NavLink>
          </div>
          <nav>
            <div className="md:hidden  ">
              <button
                onClick={handleMenuClick}
                className="text-white focus:outline-none "
              >
                {showMenu ? (
                  <FaTimes
                    size={20}
                    className="z-20 fixed top-[6%] left-[90%]"
                  />
                ) : (
                  <FaBars size={20} className=" fixed top-[6%] left-[90%]" />
                )}
              </button>
            </div>
            <ul
              className={`font-Lato-Regular justify-center items-end   h-auto tracking-wide space-x-4 cursor-pointer  md:flex md:items-center md:justify-between md:text-xs md:space-x-3  md:space-y-0 xl:text-lg xl:space-x-4  ${
                showMenu
                  ? "flex flex-col text-2xl font-nokia-bold h-auto bg-secondary-6 overflow-auto bg-opacity-80  w-full z-10 top-0 left-0 bottom-0 transform -translate-x-100 transition-transform ease-in-out duration-200 pr-8 space-y-3 md:flex fixed"
                  : "hidden"
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
                    className="flex items-center space-x-2 bg-accent-6 rounded-full py-1 px-2 lg:px-3 xl:px-4 xl:py-2 hover:bg-accent-7 cursor-pointer"
                    onClick={handleAccountClick}
                  >
                    <FaRegUserCircle />
                    <div className="text-xs  xl:text-lg font-medium text-white">
                      {user.firstName}
                      <div className="text-xs  xl:text-lg text-white-400">{user.role}</div>
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
                      <Button size="round">Create Account</Button>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
