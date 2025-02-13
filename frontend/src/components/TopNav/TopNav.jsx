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
import { useEffect } from "react";

function TopNav({ setCurrentPage, currentPage }) {
  useEffect(() => {}, [currentPage]); // ✅ Ensures immediate updates

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
          {[
            { name: "Home", icon: Home, page: "home" },
            { name: "Communities", icon: Users, page: "communities" },
            { name: "Coffee Chat", icon: User, page: "coffee-chat" },
          ].map(({ name, icon: Icon, page }) => (
            <NavigationMenuItem key={page}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                onClick={() => setCurrentPage(page)}
              >
                <button
                  className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ease-in-out 
                  ${
                    currentPage === page ? "bg-gray-300" : "hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span
                    className={`font-medium ${
                      currentPage === page ? "text-blue-600" : "text-gray-800"
                    }`}
                  >
                    {name}
                  </span>
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          {/* Notifications Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ease-in-out 
              ${
                currentPage === "notifications"
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              }`}
            >
              <Bell className="w-6 h-6 mb-1" />
              <span
                className={`font-medium ${
                  currentPage === "notifications"
                    ? "text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Notifications
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white shadow-lg rounded-lg p-2">
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                onClick={() => setCurrentPage("notifications")}
              >
                <button className="text-gray-700 hover:text-gray-900">
                  Notification 1
                </button>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Login Link (No Icon) */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
              onClick={() => setCurrentPage("login")}
            >
              <button
                className={`text-gray-800 font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out
                ${
                  currentPage === "login" ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
              >
                Login
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Sign Up Link (Black Background, White Text) */}
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
    </div>
  );
}

export default TopNav;
