import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaRegUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useOnClickOutside } from "./useOnClickOutside";
import { Button } from "./ui/button";
import bgImage from "../assets/header-img.svg";

const Header = () => {
  const { user } = useAuthContext();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleAccountClick = () => {
    setShowAccountModal((prev) => !prev);
  };

  const handleMenuClick = () => {
    setShowMenu((prev) => !prev);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const ref = useRef();
  useOnClickOutside(ref, showAccountModal, () => setShowAccountModal(false));

  return (
    <header className="relative max-w-screen">
      <div className="absolute top-0 z-0 w-full h-full">
        {/* Background Image */}
        <img
          src={bgImage}
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>
      <div className="relative z-10">
        {/* Navigation and Logo */}
        <div className="flex justify-between py-6 items-center text-white font-nokia-bold w-[90%] md:w-[80%] mx-auto">
          <div className="flex justify-center items-center space-x-3 cursor-pointer ">
            <img src="src/assets/ezra-logo.svg" alt="" />
            <NavLink to="/" onClick={closeMenu}>
              <h3>
                <strong className="text-2xl">Ezra</strong> Seminary
              </h3>
            </NavLink>
          </div>
          <nav>
            <div className="md:hidden">
              <button
                onClick={handleMenuClick}
                className="text-white focus:outline-none "
              >
                {showMenu ? (
                  <FaTimes
                    size={24}
                    className="z-20 fixed top-[4%] left-[91%]"
                  />
                ) : (
                  <FaBars size={24} className=" fixed top-[4%] left-[91%]" />
                )}
              </button>
            </div>
            <ul
              className={`font-Lato-Regular justify-center items-end tracking-wide space-x-4 cursor-pointer  md:flex ${
                showMenu
                  ? "flex flex-col text-2xl font-nokia-bold h-screen bg-secondary-6 overflow-auto bg-opacity-80  w-full z-10 top-0 left-0 bottom-0 transform -translate-x-100 transition-transform ease-in-out duration-200 pr-8 space-y-3 md:flex fixed"
                  : "hidden text-sm md:flex justify-center items-center"
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
                    className="flex items-center space-x-2 bg-accent-6 rounded-full p-3 hover:bg-accent-7 cursor-pointer"
                    onClick={handleAccountClick}
                  >
                    <FaRegUserCircle />
                    <div className="text-sm font-medium text-white">
                      {user.firstName}
                      <div className="text-xs text-white-400">{user.role}</div>
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
