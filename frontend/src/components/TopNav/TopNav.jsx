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
      <NavigationMenuList className="">
        <NavigationMenuItem className="">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link to="/comments">Comments</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="">
          <NavigationMenuTrigger>Notifications</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Link to="/comments">notification1</Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
export default NavigationMenuDemo;
