import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { RootState } from "@/redux/store"; // Adjust this import according to your file structure
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChatCircle,
  UserCircle,
  Graph,
  IconProps,
  BookBookmark,
} from "@phosphor-icons/react";
import LogoutButton from "./LogoutButton";
import { resetCourse } from "@/redux/courseSlice";

interface MenuItemType {
  label: string;
  icon: React.ElementType<IconProps>;
  subItems: {
    label: string;
    path: string;
  }[];
}

interface SidebarProps {
  isInstructor: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isInstructor }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState("");
  // State to control account modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close the account modal when clicked outside
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Ref to listen the cursor and close the account modal
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, isModalOpen, () => setIsModalOpen(false));


  // Define base path based on the role
  const basePath = isInstructor ? "/instructor" : "/admin";

  // Define menu items
  const baseMenuItems: MenuItemType[] = [
    {
      label: "Courses",
      icon: BookOpen,
      subItems: [
        { label: "Create Course", path: `${basePath}/courses/create` },
        { label: "Manage Courses", path: `${basePath}/course/edit` },
      ],
    },
    {
      label: "Devotion",
      icon: CalendarCheck,
      subItems: [
        { label: "Create Devotion", path: `${basePath}/devotion/create` },
        { label: "Manage Devotion", path: `${basePath}/devotion/manage` },
      ],
    },
    {
      label: "Devotion Plans",
      icon: BookBookmark,
      subItems: [
        { label: "Manage Plans", path: `${basePath}/devotion-plans/manage` },
      ],
    },
  ];

  const fullMenuItems: MenuItemType[] = [
    ...baseMenuItems,
    {
      label: "Analytics",
      icon: Graph,
      subItems: [
        { label: "App Usage", path: `${basePath}/analytics/usage` },
        {
          label: "Performance Dashboard",
          path: `${basePath}/analytics/dashboard`,
        },
      ],
    },
    {
      label: "Feedback Center",
      icon: ChatCircle,
      subItems: [{ label: "Feedback", path: `${basePath}/feedback` }],
    },
    {
      label: "Users",
      icon: UserCircle,
      subItems: [
        { label: "Create User", path: `${basePath}/users/create` },
        { label: "Manage Users", path: `${basePath}/users/manage` },
      ],
    },
  ];

  // Determine the menu items based on the user role
  const menuItems = isInstructor ? baseMenuItems : fullMenuItems;

  type SidebarItemProps = {
    icon: React.ElementType<IconProps>;
    label: string;
    active: boolean;
    children?: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  };

  const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    active,
    children,
    onClick,
  }) => {
    return (
      <div
        className={`mx-3 my-1 rounded-xl cursor-pointer transition-all duration-300 ${
          active 
            ? "bg-gradient-to-r from-accent-6 to-accent-7 shadow-lg" 
            : "hover:bg-accent-7/20 hover:shadow-md"
        }`}
        onClick={onClick}
      >
        <div className={`flex items-center py-4 px-4 ${!isCollapsed ? "gap-3" : "justify-center"}`}>
          <div className={`p-2 rounded-lg transition-all duration-300 ${
            active ? "bg-white/20" : "hover:bg-white/10"
          }`}>
            <Icon 
              className={`transition-colors duration-300 ${
                active ? "text-primary-1" : "text-accent-1 hover:text-primary-1"
              }`} 
              size={20} 
              weight="fill" 
            />
          </div>
          {!isCollapsed && (
            <span className={`font-medium text-base transition-colors duration-300 ${
              active ? "text-primary-1" : "text-accent-1 hover:text-primary-1"
            }`}>
              {label}
            </span>
          )}
        </div>
        {children}
      </div>
    );
  };

  const ProfileModal = () => {
    return (
      <div className="fixed bottom-20 left-4 flex justify-center items-center z-50">
        <div className="bg-primary-3 p-2 rounded-lg shadow-lg w-48">
          <div className="flex flex-col items-center">
            <Link
              to="/profile"
              className="py-2 hover:bg-accent-2 w-full text-center text-accent-6 transition-all"
            >
              Profile Settings
            </Link>
            <div className="py-2 hover:bg-accent-2 w-full text-center text-accent-6 transition-all">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleItemClick = (
    item: MenuItemType,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (isCollapsed || item.subItems.length === 1) {
      navigate(item.subItems[0].path);
    } else {
      setActiveMenu(activeMenu !== item.label ? item.label : "");
      event.stopPropagation();
    }
  };

  const handleSubItemClick = (
    path: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    navigate(path);
    dispatch(resetCourse());
  };

  return (
    <div
      className={`flex flex-col text-white bg-gradient-to-b from-accent-8 to-accent-9 h-full pt-8 font-Lato-Bold shadow-2xl ${
        isCollapsed ? "w-16" : "w-72"
      }`}
      style={{
        height: "100vh",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <div className="relative">
        <div className="flex items-center px-6 text-xl pb-8 border-b border-accent-7/30">
          <div className="p-2 bg-primary-1/10 rounded-lg">
            <BookBookmark className="text-primary-1" size={28} weight="fill" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-sm text-accent-2 opacity-75">Admin Portal</p>
            </div>
          )}
        </div>
        <div
          className="absolute -top-2 right-4 transform translate-x-full z-20"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <button className="group h-10 w-10 bg-gradient-to-r from-primary-1 to-accent-1 hover:from-accent-1 hover:to-accent-2 border-2 border-accent-6 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl">
            {isCollapsed ? (
              <ArrowRight
                size={18}
                weight="bold"
                className="text-accent-8 group-hover:text-accent-9 transition-colors"
              />
            ) : (
              <ArrowLeft
                size={18}
                weight="bold"
                className="text-accent-8 group-hover:text-accent-9 transition-colors"
              />
            )}
          </button>
        </div>
        {menuItems.map((item) => {
          // Check if any subItem path matches current location
          const isItemActive = item.subItems.some(subItem => 
            location.pathname === subItem.path || location.pathname.startsWith(subItem.path + "/")
          );
          
          return (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={isItemActive}
              onClick={(event) => handleItemClick(item, event)}
            >
            <div className="mt-2">
              {!isCollapsed &&
                activeMenu === item.label &&
                item.subItems.map((subItem) => (
                  <div
                    key={subItem.path}
                    className="mx-6 my-1 pl-6 py-3 text-sm menu-item hover:bg-accent-6/30 rounded-lg transition-all duration-300 text-accent-1 hover:text-primary-1 border-l-2 border-accent-5 hover:border-accent-3"
                    onClick={(e) => handleSubItemClick(subItem.path, e)}
                  >
                    {subItem.label}
                  </div>
                ))}
            </div>
          </SidebarItem>
        );
        })}
      </div>
      <div
        ref={ref}
        onClick={toggleModal}
        className="absolute bottom-4 left-3 right-3 p-4 rounded-xl bg-accent-7/20 hover:bg-accent-6/30 border border-accent-7/30 hover:border-accent-6/50 cursor-pointer transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
      >
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="p-2 bg-white/10 rounded-full">
              <UserCircle size={24} className="text-primary-1" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
              <UserCircle size={20} className="text-primary-1" />
            </div>
            <div className="flex-1">
              <p className="text-primary-1 font-medium text-base">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="text-accent-2 text-sm opacity-75">
                {user?.role || 'Admin'}
              </p>
            </div>
          </div>
        )}
        {isModalOpen && <ProfileModal />}
      </div>
    </div>
  );
};

export default Sidebar;
