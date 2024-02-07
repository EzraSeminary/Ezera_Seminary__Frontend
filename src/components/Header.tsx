import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaRegUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { Button } from "./ui/button";
import bgImage from "../assets/header-img.webp";

const Header: React.FC = () => {
  const { user } = useAuthContext();
  {/* State to control account modal  */ }
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  {/* State to control mobile menu bar  */ }
  const [showMenu, setShowMenu] = useState<boolean>(false);


  {/* State and Effect to control header by listening the scroll */ }
  const [show, handleShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 620) {
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
    <header className="relative max-w-screen">
      {/* Header Background Image */}
      <div className="absolute top-0 z-0 w-full h-20 xl:h-28">
        <img
          src={bgImage}
          className="w-full h-full  object-cover"
          alt="Background"
        />
      </div>
    </header>
  );
};

export default Header;
