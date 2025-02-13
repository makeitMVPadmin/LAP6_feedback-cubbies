import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function NavigationMenuDemo({ setCurrentPage }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Home Link */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={navigationMenuTriggerStyle()}
            onClick={() => setCurrentPage("home")}
          >
            <button>Home</button>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Feedback Link */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={navigationMenuTriggerStyle()}
            onClick={() => setCurrentPage("feedback")}
          >
            <button>Feedback</button>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Notifications Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Notifications</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
              onClick={() => setCurrentPage("notifications")}
            >
              <button>Notification 1</button>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavigationMenuDemo;
