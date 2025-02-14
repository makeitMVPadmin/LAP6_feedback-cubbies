import logo from "/images/logos/communiti_logo.png";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Home, Users, User, Bell } from "lucide-react";

function TopNav({
  setCurrentPage,
  currentPage,
  notificationCount,
  userImage,
  username,
}) {
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

          {/* Notifications Button with Badge */}
          <NavigationMenuItem>
            <button
              onClick={() => setCurrentPage("notifications")}
              className={`relative flex flex-col items-center p-2 rounded-md transition-colors duration-200 ease-in-out 
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
              {/* Notification Badge */}
              {notificationCount > 0 && (
                <span className="absolute top-0 right-10 -mt-1 -mr-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
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
          {/* User Profile with ShadCN Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative flex items-center focus:outline-none">
                {/* Circular User Image */}
                <img
                  src={userImage}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-500 transition"
                />
                {/* Dropdown Arrow */}
                <div className="absolute -bottom-0 right-0 w-4 h-4 rotate-45 bg-white shadow-md border border-gray-200"></div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={10}
              className="w-48 bg-white shadow-lg rounded-lg p-2 z-50 relative"
            >
              {/* User Info */}
              <div className="p-2">
                <p className="font-semibold text-gray-800">{username}</p>
              </div>

              <DropdownMenuItem
                onClick={() => setCurrentPage("profile")}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              >
                View Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setCurrentPage("logout")}
                className="cursor-pointer text-red-600 hover:bg-gray-100 p-2 rounded-md"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default TopNav;
