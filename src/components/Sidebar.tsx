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

  const isActive = (path: string): boolean => {
    return location.pathname.includes(path);
  };

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
        className={`px-4 py-5 cursor-pointer hover:bg-accent-6 justify-center items-center border-b border-accent-5 ${
          active ? "bg-accent-6" : ""
        }`}
        onClick={onClick}
      >
        <div className={`flex my-2 ${!isCollapsed ? "gap-2" : ""}`}>
          <Icon className="text-primary-1" size={24} weight="fill" />
          {!isCollapsed && <span>{label}</span>}
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
      className={`flex flex-col text-white bg-accent-8 h-full pt-12 font-Lato-Bold ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      style={{
        height: "100vh",
        transition: "width 0.3s",
      }}
    >
      <div className="relative">
        <div className="flex px-4 text-xl pb-6">
          <BookBookmark className="text-primary-1" size={24} weight="fill" />
          {!isCollapsed && <h1 className="ml-2">Dashboard</h1>}
        </div>
        <div
          className="absolute top-2 right-4 transform translate-x-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ArrowRight
              size={20}
              weight="bold"
              className="h-8 w-8 text-accent-8 border border-accent-8 bg-primary-1 rounded-full p-2"
            />
          ) : (
            <ArrowLeft
              size={20}
              weight="bold"
              className="h-8 w-8 text-accent-8 border border-accent-8 bg-primary-1 rounded-full p-2"
            />
          )}
        </div>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={isActive(item.label.toLowerCase())}
            onClick={(event) => handleItemClick(item, event)}
          >
            <div className="mt-2">
              {!isCollapsed &&
                activeMenu === item.label &&
                item.subItems.map((subItem) => (
                  <div
                    key={subItem.path}
                    className="pl-8 menu-item py-1 hover:bg-accent-8 rounded-lg transition-all"
                    onClick={(e) => handleSubItemClick(subItem.path, e)}
                  >
                    {subItem.label}
                  </div>
                ))}
            </div>
          </SidebarItem>
        ))}
      </div>
      <div
        ref={ref}
        onClick={toggleModal}
        className="absolute bottom-8 left-1 hover:bg-accent-6 rounded-full transition-all px-3 py-1 cursor-pointer hover:shadow-lg"
      >
        {isCollapsed ? (
          <div className="flex items-center gap-1">
            <UserCircle size={26} className="text-primary-1 cursor-pointer" />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <UserCircle size={22} className="text-primary-1 cursor-pointer" />
            {user && user.firstName}
          </div>
        )}
        {isModalOpen && <ProfileModal />}
      </div>
    </div>
  );
};

export default Sidebar;
