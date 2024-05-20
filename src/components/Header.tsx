import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { UserCircle, XCircle, List } from "@phosphor-icons/react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
// import { Button } from "./ui/button";
import bgImage from "../assets/header-img.webp";
import { RootState } from "@/redux/store";
import LogoImage from "@/assets/Logo Ion.png";
import DarkLogoImage from "@/assets/Dark Logo Ion.png";

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  {
    /* State to control account modal  */
  }
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  {
    /* State to control mobile menu bar  */
  }
  const [showMenu, setShowMenu] = useState<boolean>(false);

  {
    /* State and Effect to control header by listening the scroll */
  }
  const [show, handleShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        handleShow(true);
      } else handleShow(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  {
    /* Function to open the account modal */
  }
  const handleAccountClick = () => {
    setShowAccountModal((prev) => !prev);
  };

  {
    /* Function to open the mobile menu */
  }
  const handleMenuClick = () => {
    setShowMenu((prev) => !prev);
  };

  {
    /* Function to close the mobile menu */
  }
  const closeMenu = () => {
    setShowMenu(false);
  };

  {
    /* Ref to listen the curser and close the account modal */
  }
  const ref = useRef<HTMLLIElement>(null);
  useOnClickOutside(ref, showAccountModal, () => setShowAccountModal(false));

  return (
    <header className="relative max-w-screen mb-8 font-nokia-bold">
      {/* Header Background Image */}
      <div className="absolute top-0 z-0 w-full h-16  lg:h-[4.2rem] xl:h-[4.8rem] shadow-xl">
        <img
          src={bgImage}
          className="w-full h-full  object-cover"
          alt="Background"
        />
      </div>
      {/* Header when the scroll is above 20  */}
      <div className="relative z-50 py-2">
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="fixed top-0  z-0 w-full h-16 lg:h-[4.5rem] xl:h-[5.5rem]   bg-white shadow-xl"
          >
            {/* Header Background Image */}
            {/* <img
              src={bgImage}
              className="w-full h-full -mt-3 object-cover"
              alt="Background"
            /> */}
            {/* Navigation and Logo */}
            <div className="absolute top-[34%]  w-full md:top-[28%] lg:top-[26.3%]">
              <div className="  flex justify-between items-center  w-[90%] md:w-[90%] lg:w-[85%] mx-auto ">
                <div className="flex justify-center items-center gap-2 md:space-x-0   xl:space-x-1 cursor-pointer ">
                  <img
                    src={DarkLogoImage}
                    className="w-4  md:w-5  lg:w-6  xl:w-7 "
                    alt=""
                  />
                  <NavLink to="/" onClick={closeMenu}>
                    <h3 className="text-xs md:text-sm lg:text-lg xl:text-2xl tracking-wide font-nokia-bold text-secondary-6">
                      <strong>Ezra</strong> Seminary
                    </h3>
                  </NavLink>
                </div>
                {/* MenuBar */}
                <div className="md:hidden flex">
                  <button
                    onClick={handleMenuClick}
                    className=" focus:outline-none "
                  >
                    {showMenu ? (
                      <XCircle
                        size={20}
                        className="z-20 fixed top-[1.4rem] left-[90%] block text-primary-1"
                      />
                    ) : (
                      <List
                        size={20}
                        className="text-secondary-6 fixed top-[1.4rem] left-[90%] block"
                      />
                    )}
                  </button>
                </div>
                {/* Navigation */}
                <ul
                  className={`${
                    showMenu
                      ? "flex flex-col justify-center items-end text-xl text-primary-1 font-nokia-bold h-auto bg-secondary-6 overflow-auto bg-opacity-80  w-full z-10 top-0 left-0 bottom-0 transform -translate-x-100 transition-transform ease-in-out duration-200 pr-8 space-y-2 fixed cursor-pointer"
                      : "hidden  cursor-pointer  md:flex md:items-center md:justify-end  md:text-xs lg:text-sm xl:text-xl gap-[0.4rem] lg:space-x-2  xl:space-x-2  text-secondary-6 transition-all"
                  }`}
                >
                  <li>
                    <NavLink
                      to="/"
                      onClick={closeMenu}
                      className={({ isActive }: { isActive: boolean }) =>
                        `hover:text-accent-6 tracking-wide transition-all ${
                          isActive && "text-accent-6 font-nokia-bold"
                        }`
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/courses"
                      onClick={closeMenu}
                      className={({ isActive }: { isActive: boolean }) =>
                        `hover:text-accent-6 tracking-wide transition-all ${
                          isActive && "text-accent-6 font-nokia-bold"
                        }`
                      }
                    >
                      Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/sabbathSchool"
                      onClick={closeMenu}
                      className={({ isActive }: { isActive: boolean }) =>
                        `hover:text-accent-6 tracking-wide transition-all ${
                          isActive && "text-accent-6 font-nokia-bold"
                        }`
                      }
                    >
                      Sabbath School
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/devotion"
                      onClick={closeMenu}
                      className={({ isActive }: { isActive: boolean }) =>
                        `hover:text-accent-6 tracking-wide transition-all ${
                          isActive && "text-accent-6 font-nokia-bold"
                        }`
                      }
                    >
                      Devotion
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/aboutUs"
                      onClick={closeMenu}
                      className={({ isActive }: { isActive: boolean }) =>
                        `hover:text-accent-6 tracking-wide transition-all ${
                          isActive && "text-accent-6 font-nokia-bold"
                        }`
                      }
                    >
                      About Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/contactUs"
                      onClick={closeMenu}
                      className={({ isActive }: { isActive: boolean }) =>
                        `hover:text-accent-6 tracking-wide transition-all ${
                          isActive && "text-accent-6 font-nokia-bold"
                        }`
                      }
                    >
                      Contact Us
                    </NavLink>
                  </li>
                  {user ? (
                    <li ref={ref} className="relative">
                      <div
                        className="flex items-center space-x-2 bg-accent-6 rounded-full py-1 px-2 lg:px-3 xl:px-4 xl:py-2 hover:bg-accent-7 cursor-pointer"
                        onClick={handleAccountClick}
                      >
                        <UserCircle size={24} className="text-primary-1" />
                        <div className="text-xs  xl:text-lg font-medium text-primary-1 tracking-wide">
                          {user.firstName}
                        </div>
                      </div>
                      {showAccountModal && (
                        <div className="absolute top-[40px] right-0 bg-accent-6 shadow-lg rounded-md z-10 text-primary-1 mt-1">
                          <div className="px-4 py-2 border-b tracking-wide">
                            {user.role}
                          </div>
                          <div className="px-4 py-2 border-b tracking-wide">
                            <NavLink to="/profile">Settings</NavLink>
                          </div>
                          {user.role === "Admin" && (
                            <div className="px-4 py-2 border-b tracking-wide">
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
                      <li className="hover:text-gray-400 tracking-wide">
                        <NavLink
                          to="/logIn"
                          className={({ isActive }: { isActive: boolean }) =>
                            `hover:text-accent-6 tracking-wide transition-all ${
                              isActive && "text-accent-6 font-nokia-bold"
                            }`
                          }
                        >
                          Log In
                        </NavLink>
                      </li>
                      <li className="hover:text-gray-400 text-base ">
                        <NavLink to="/signup">
                          <button
                            type="button"
                            className=" bg-accent-6 tracking-wide rounded-full  w-auto px-2 py-1  lg:px-3 lg:text-sm xl:py-2 xl:px-4 text-xs  xl:text-xl hover:bg-accent-7 cursor-pointer transition-all text-primary-1"
                          >
                            Create Account
                          </button>
                          {/* <Button
                            size="round"
                            // className=" bg-accent-6 rounded-full  px-2 py-0 lg:px-3 lg:py-1 text-xs xl:text-lg  hover:bg-accent-7 cursor-pointer transition-all"
                          >
                            Create Account
                          </Button> */}
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {/* Header when the scroll is below 20  */}
      <div className="relative z-30 py-2">
        <div className="absolute top-[0.4rem] md:top-0  lg:top-1 xl:top-0   w-full ">
          <div className=" flex justify-between items-center text-white font-nokia-bold w-[90%] md:w-[90%] lg:w-[85%] mx-auto">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="flex justify-center items-center gap-2 md:space-x-0   xl:space-x-1 cursor-pointer "
            >
              <img
                src={LogoImage}
                className="w-4  md:w-5  lg:w-6  xl:w-7 "
                alt=""
              />
              <NavLink to="/" onClick={closeMenu}>
                <h3 className="text-xs md:text-sm lg:text-lg xl:text-2xl tracking-wide">
                  <strong>Ezra</strong> Seminary
                </h3>
              </NavLink>
            </motion.div>
            {/* Navigation and Logo */}
            <nav>
              {/* MenuBar */}
              <div className="md:hidden flex">
                <button
                  onClick={handleMenuClick}
                  className="text-white focus:outline-none "
                >
                  {showMenu ? (
                    <XCircle
                      size={20}
                      className="z-20 fixed top-[2.2rem] left-[90%]"
                    />
                  ) : (
                    <List
                      size={20}
                      className=" z-20 top-[2.7rem] left-[90%] block"
                    />
                  )}
                </button>
              </div>
              {/* Navigation */}
              <ul
                className={`${
                  showMenu
                    ? "flex flex-col justify-center items-end text-xl font-nokia-bold h-auto bg-secondary-6 overflow-auto bg-opacity-80  w-full z-10 top-0 left-0 bottom-0 transform -translate-x-100 transition-transform ease-in-out duration-200 pr-8 space-y-2 fixed cursor-pointer"
                    : "hidden font-Lato-Regular  cursor-pointer  md:flex md:items-center md:justify-end md:text-xs lg:text-sm xl:text-xl gap-[0.4rem] lg:space-x-2  xl:space-x-2  "
                }`}
              >
                <motion.li
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                >
                  <NavLink
                    to="/"
                    onClick={closeMenu}
                    className={({ isActive }: { isActive: boolean }) =>
                      `hover:text-accent-6 tracking-wide transition-all ${
                        isActive && "text-accent-6 font-nokia-bold"
                      }`
                    }
                  >
                    Home
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                >
                  <NavLink
                    to="/courses"
                    onClick={closeMenu}
                    className={({ isActive }: { isActive: boolean }) =>
                      `hover:text-accent-6 tracking-wide transition-all ${
                        isActive && "text-accent-6 font-nokia-bold"
                      }`
                    }
                  >
                    Courses
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                >
                  <NavLink
                    to="/sabbathSchool"
                    onClick={closeMenu}
                    className={({ isActive }: { isActive: boolean }) =>
                      `hover:text-accent-6 tracking-wide transition-all ${
                        isActive && "text-accent-6 font-nokia-bold"
                      }`
                    }
                  >
                    Sabbath School
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                >
                  <NavLink
                    to="/devotion"
                    onClick={closeMenu}
                    className={({ isActive }: { isActive: boolean }) =>
                      `hover:text-accent-6 tracking-wide transition-all ${
                        isActive && "text-accent-6 font-nokia-bold"
                      }`
                    }
                  >
                    Devotion
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
                >
                  <NavLink
                    to="/aboutUs"
                    onClick={closeMenu}
                    className={({ isActive }: { isActive: boolean }) =>
                      `hover:text-accent-6 tracking-wide transition-all ${
                        isActive && "text-accent-6 font-nokia-bold"
                      }`
                    }
                  >
                    About Us
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                >
                  <NavLink
                    to="/contactUs"
                    onClick={closeMenu}
                    className={({ isActive }: { isActive: boolean }) =>
                      `hover:text-accent-6 tracking-wide transition-all ${
                        isActive && "text-accent-6 font-nokia-bold"
                      }`
                    }
                  >
                    Contact Us
                  </NavLink>
                </motion.li>
                {user ? (
                  <motion.li
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.9 }}
                    ref={ref}
                    className="relative"
                  >
                    <div
                      className="flex items-center space-x-2 bg-accent-6 rounded-full py-1 px-2 text-xs1  hover:bg-accent-7 cursor-pointer"
                      onClick={handleAccountClick}
                    >
                      <UserCircle size={24} />
                      <div className="text-xs  xl:text-lg font-medium text-white tracking-wide">
                        {user.firstName}
                      </div>
                    </div>
                    {showAccountModal && (
                      <div className="absolute top-[40px] right-0 bg-accent-6 shadow-lg rounded-md z-10 text-primary-1">
                        <div className="px-4 py-2 border-b tracking-wide">
                          {user.role}
                        </div>
                        <div className="px-4 py-2 border-b tracking-wide">
                          <NavLink to="/profile">Settings</NavLink>
                        </div>
                        {user.role === "Admin" && (
                          <div className="px-4 py-2 border-b tracking-wide">
                            <NavLink to="/admin">Dashboard</NavLink>
                          </div>
                        )}
                        <div className="px-4 py-2">
                          <LogoutButton />
                        </div>
                      </div>
                    )}
                  </motion.li>
                ) : (
                  <>
                    <motion.li
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.9 }}
                      className="hover:text-accent-7 tracking-wide"
                    >
                      <NavLink
                        to="/logIn"
                        className={({ isActive }: { isActive: boolean }) =>
                          `hover:text-accent-6 tracking-wide transition-all ${
                            isActive && "text-accent-6 font-nokia-bold"
                          }`
                        }
                      >
                        Log In
                      </NavLink>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.95 }}
                      className="hover:text-primary-6 text-base "
                    >
                      <NavLink to="/signup">
                        <button
                          type="button"
                          className=" bg-accent-6 tracking-wide rounded-full font-nokia-bold  w-auto px-2 py-1  lg:px-3 lg:text-sm xl:py-2 xl:px-4 text-xs  xl:text-xl hover:bg-accent-7 cursor-pointer transition-all"
                        >
                          Create Account
                        </button>
                        {/* <Button

                          // className=" bg-accent-6 rounded-full text-xs   hover:bg-accent-7 cursor-pointer transition-all"
                        >
                          Create Account
                        </Button> */}
                      </NavLink>
                    </motion.li>
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
