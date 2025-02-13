import NotificationDrawer from "../NotificationDrawer/NotificationDrawer";
import logo from "/images/logos/communiti_logo.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, Users, User, Bell } from "lucide-react";
import { useState } from "react";

function TopNav({ setCurrentPage, currentPage }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
              {/* ✅ Replacing NavigationMenuLink with button */}
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

          {/* Notifications Button */}
          <NavigationMenuItem>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex flex-col items-center p-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-200"
            >
              <Bell className="w-6 h-6 mb-1" stroke="black" strokeWidth={2} />
              <span className="text-gray-800 font-medium">Notifications</span>
            </button>
          </NavigationMenuItem>

          {/* Login Link */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
              onClick={() => setCurrentPage("login")}
            >
              <button className="text-gray-800 font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-200">
                Login
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Sign Up Button */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
              onClick={() => setCurrentPage("signup")}
            >
              <button className="bg-black text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-800">
                Sign Up
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default TopNav;
