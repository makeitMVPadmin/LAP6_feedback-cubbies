import { useNavigation } from "../../context/NavigationContext";
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

function TopNav({
  setCurrentPage,
  currentPage,
  notificationCount,
  currentUser,
  usersList,
  handleUserLogin,
}) {
  const { goToProfileDetails } = useNavigation();
  const navItems = [
    { name: "Home", icon: "house", page: "home" },
    { name: "Communities", icon: "group", page: "" },
    { name: "Coffee Chat", icon: "groups", page: "" },
  ];
  const NotificationsIcon = () => (
    <span className="material-symbols-outlined">notifications</span>
  );

  return (
    <div className="w-[1070px] h-[104px] flex items-center justify-between mx-auto px-6  py-6 bg-white">
      {/* Logo */}
      <img
        src={logo}
        alt="Communiti Logo"
        className="w-[240px] h-[48px] py-2 px-1"
      />

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="flex gap-8 pl-4">
          {navItems.map(({ name, icon: Icon, page }) => (
            <NavigationMenuItem key={page !== "" ? page : name}>
              <button
                onClick={() => (page !== "" ? setCurrentPage(page) : null)}
                className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ease-in-out 
                ${currentPage === page ? "bg-gray-300" : "hover:bg-gray-200"}`}
              >
                <span className="material-symbols-outlined">{Icon}</span>
                <span
                  className={`text-black text-base font-semibold font-['Fraunces'] leading-normal whitespace-nowrap w-auto
                  ${currentPage === page ? "text-blue-600" : "text-gray-800"}`}
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
      ${currentPage === "notifications" ? "bg-gray-300" : "hover:bg-gray-200"}`}
            >
              <NotificationsIcon />
              {/* Notification Badge */}
              {notificationCount > 0 && (
                <span className="absolute top-0 right-10 -mt-1 -mr-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
              <span
                className={`text-black text-base font-semibold font-['Fraunces'] leading-normal 
        ${currentPage === "notifications" ? "text-blue-600" : "text-gray-800"}`}
              >
                Notifications
              </span>
            </button>
          </NavigationMenuItem>

          {/*Login Button */}
          {/* <NavigationMenuItem>
            <button
              onClick={() => setCurrentPage("login")}
              className={`text-gray-800 font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out
              ${currentPage === "login" ? "bg-gray-300" : "hover:bg-gray-200"}`}
            >
              Login
            </button>
          </NavigationMenuItem> */}

          {/*Sign Up Button */}
          {/* <NavigationMenuItem>
            <button
              onClick={() => setCurrentPage("signup")}
              className={`bg-black text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out
              ${
                currentPage === "signup" ? "bg-gray-800" : "hover:bg-gray-700"
              }`}
            >
              Sign Up
            </button>
          </NavigationMenuItem> */}
          {/* User Profile with ShadCN Dropdown */}
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer flex items-center space-x-2">
                <button className="relative flex items-center focus:outline-none">
                  <div className="w-[72px] h-[72px] justify-center items-center inline-flex">
                    <img
                      class="w-[72px] h-[72px] rounded-full border border-black"
                      src={currentUser?.profilePicture}
                      alt={currentUser?.firstName}
                    />
                  </div>
                  <div className="absolute -bottom-0 right-0 w-4 h-4">
                    <div data-svg-wrapper class="relative">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="24" height="24" rx="12" fill="#080808" />
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="white"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[200px]  bg-white rounded-lg shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.20)] shadow-[0px_4px_5px_0px_rgba(0,0,0,0.14)] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.12)] border-l border-r-2 border-t border-b-2 border-[#28363f] flex-col justify-center items-start inline-flex overflow-hidden"
                align="end"
                side="bottom"
                sideOffset={10}
              >
                {/* User Info */}
                <div className="w-full px-3 py-[9px] border-b border-[#d0dce3] flex items-center">
                  <div className="text-[#28363f] text-base font-bold font-['Montserrat'] leading-tight">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                </div>
                {/* Menu Items */}
                <div className="flex flex-col w-full">
                  <DropdownMenuItem className="px-3 py-[9px] hover:bg-gray-100">
                    <div className="text-[#28363f] text-sm font-normal font-['Montserrat']">
                      View Profile
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-[9px] hover:bg-gray-100">
                    <div className="text-[#28363f] text-sm font-normal font-['Montserrat']">
                      Settings
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-[9px] hover:bg-gray-100">
                    <div className="text-[#28363f] text-sm font-normal font-['Montserrat']">
                      Posts & Activity
                    </div>
                  </DropdownMenuItem>
                </div>

                {/* Divider (Now full-width) */}
                <div className="w-full border-b border-[#d0dce3]" />

                {/* User Switching */}
                {usersList.map((user) =>
                  currentUser?.id === user.id ? null : (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => handleUserLogin(user.id)}
                      className=" cursor-pointer w-full px-3 py-[9px] flex items-center hover:bg-gray-100"
                    >
                      <div className="text-[#28363f] text-sm font-normal font-['Montserrat']">
                        <span className="text-red-500">Login</span> as{" "}
                        {user.username}
                      </div>
                    </DropdownMenuItem>
                  )
                )}

                {/* <DropdownMenuItem
                onClick={() => setCurrentPage("profile")}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              >
                View Profile
              </DropdownMenuItem> */}
                {/* <DropdownMenuItem
                  onClick={() => goToProfileDetails("PXKgEDwdVZrWxatSfKDr")}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                >
                  Debug feedback page
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem
                onClick={() => setCurrentPage("logout")}
                className="cursor-pointer text-red-600 hover:bg-gray-100 p-2 rounded-md"
              >
                Logout
              </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default TopNav;
