import NotificationDrawer from "../NotificationDrawer/NotificationDrawer";
import logo from "/images/logos/communiti_logo.png";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Home, Users, User, Bell } from "lucide-react";

function TopNav({ setCurrentPage, currentPage, setIsDrawerOpen }) {
  const navItems = [
    { name: "Home", icon: Home, page: "home" },
    { name: "Communities", icon: Users, page: "communities" },
    { name: "Coffee Chat", icon: User, page: "coffee-chat" },
  ];

  return (
    <div className="w-[1156px] h-[104px] flex items-center justify-between mx-auto px-6 pt-6 bg-white">
      {/* Logo */}
      <img
        src={logo}
        alt="Communiti Logo"
        className="w-[248px] h-[48px] py-2 px-1"
      />

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-6">
          {navItems.map(({ name, icon: Icon, page }) => (
            <NavigationMenuItem key={page}>
              <button
                onClick={() => setCurrentPage(page)}
                className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ease-in-out 
                ${currentPage === page ? "bg-gray-300" : "hover:bg-gray-200"}`}
              >
                <Icon
                  className="w-6 h-6 mb-1"
                  stroke={currentPage === page ? "blue" : "black"}
                  strokeWidth={2}
                />
                <span
                  className={`font-medium ${
                    currentPage === page ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {name}
                </span>
              </button>
            </NavigationMenuItem>
          ))}

          {/* Notifications Button (Opens Drawer & Updates State) */}
          <NavigationMenuItem>
            <button
              onClick={() => setCurrentPage("notifications")}
              className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ease-in-out 
              ${
                currentPage === "notifications"
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              }`}
            >
              <Bell
                className="w-6 h-6 mb-1"
                stroke={currentPage === "notifications" ? "blue" : "black"}
                strokeWidth={2}
              />
              <span
                className={`font-medium ${
                  currentPage === "notifications"
                    ? "text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Notifications
              </span>
            </button>
          </NavigationMenuItem>

          {/*Login Button */}
          <NavigationMenuItem>
            <button
              onClick={() => setCurrentPage("login")}
              className={`text-gray-800 font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out
              ${currentPage === "login" ? "bg-gray-300" : "hover:bg-gray-200"}`}
            >
              Login
            </button>
          </NavigationMenuItem>

          {/*Sign Up Button */}
          <NavigationMenuItem>
            <button
              onClick={() => setCurrentPage("signup")}
              className={`bg-black text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out
              ${
                currentPage === "signup" ? "bg-gray-800" : "hover:bg-gray-700"
              }`}
            >
              Sign Up
            </button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default TopNav;
