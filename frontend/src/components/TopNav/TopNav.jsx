import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Home Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Comments Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/feedback">Feedback</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Notifications Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Notifications</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/notifications">Notification 1</Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavigationMenuDemo;
