import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { RootState } from "@/redux/store"; // Adjust this import according to your file structure
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChatCircle,
  Cross,
  UserCircle,
  Graph,
  IconProps,
} from "@phosphor-icons/react";
import LogoutButton from "./LogoutButton";

// Define a type for your menu items
interface MenuItemType {
  label: string;
  icon: React.ElementType<IconProps>;
  subItems: {
    label: string;
    path: string;
  }[];
}

const Sidebar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user); // Use the actual path of user in your root state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const isActive = (path: string): boolean => {
    return location.pathname.includes(path);
  };
  const menuItems: MenuItemType[] = [
    {
      label: "Analytics",
      icon: Graph,
      subItems: [
        { label: "App Usage", path: "/admin/analytics/usage" },
        { label: "Performance Dashboard", path: "/admin/analytics/dashboard" },
      ],
    },
    {
      label: "Courses",
      icon: BookOpen,
      subItems: [
        { label: "Create Course", path: "/admin/courses/create" },
        { label: "Manage Courses", path: "/admin/course/edit" },
      ],
    },
    {
      label: "Sabbath School",
      icon: Cross,
      subItems: [{ label: "SSL Section", path: "/admin/sabbathSchool" }],
    },
    {
      label: "Devotion",
      icon: CalendarCheck,
      subItems: [
        { label: "Create Devotion", path: "/admin/devotion/create" },
        { label: "Manage Devotion", path: "/admin/devotion/manage" },
      ],
    },
    {
      label: "Users",
      icon: UserCircle,
      subItems: [
        { label: "Create User", path: "/admin/users/create" },
        { label: "Manage Users", path: "/admin/users/manage" },
      ],
    },
    {
      label: "Feedback Center",
      icon: ChatCircle,
      subItems: [{ label: "Feedback", path: "/admin/feedback" }],
    },
  ];
  const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    active,
    children,
    onClick,
  }) => {
    return (
      <div
        className={`px-4 py-5 cursor-pointer hover:bg-accent-6 justify-center ${
          active ? "bg-accent-6" : ""
        }`}
        onClick={onClick}
      >
        <div className={`flex ${!isCollapsed ? "gap-2" : ""}`}>
          <Icon className="text-primary-1" size={24} weight="fill" />
          {!isCollapsed && <span>{label}</span>}
        </div>
        {children}
      </div>
    );
  };

  type SidebarItemProps = {
    icon: React.ElementType<IconProps>;
    label: string;
    active: boolean;
    children?: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  };

  const ProfileModal = () => {
    return (
      <div className="fixed bottom-24 left-2 flex justify-center items-center z-50">
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
    if (item.subItems.length === 1) {
      navigate(item.subItems[0].path);
    } else {
      setActiveMenu(activeMenu !== item.label ? item.label : "");
      event.stopPropagation(); // Stop click from propagating to other elements
    }
  };

  const handleSubItemClick = (
    path: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.stopPropagation(); // Stop click from propagating to other elements
    navigate(path);
  };

  return (
    <div
      className={`flex flex-col text-white bg-accent-8 h-full pt-12 font-Lato-Bold  ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      style={{
        height: "100vh",
        transition: "width 0.3s",
      }}
    >
      <div className="relative">
        <h1 className="text-center py-4">Dashboard</h1>
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
            onClick={(event) => {
              if (isCollapsed) {
                // When collapsed, navigate to the path of the first subitem
                navigate(item.subItems[0].path);
              } else {
                // When not collapsed, handle the item click normally
                handleItemClick(item, event);
              }
            }}
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
      {isModalOpen && <ProfileModal />}
      <div
        className="absolute bottom-8 left-4 hover:bg-accent-6 rounded-full transition-all px-3 py-1 cursor-pointer hover:shadow-lg"
        onClick={toggleModal}
      >
        <div className="flex items-center gap-2">
          <UserCircle size={28} className="text-primary-1 cursor-pointer " />
          {user && user.firstName}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
