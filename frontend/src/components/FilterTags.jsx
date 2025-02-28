import { Button, ChevronDown, DropdownMenuGroup } from './ui/index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function FilterTags() {
  return (
    <DropdownMenu>
      <Button
        variant="outline"
        className="h-12 pl-4 pr-5 bg-[#ffd22f] hover:bg-[#ffd22f] rounded-[10px] justify-center items-center gap-2 inline-flex text-center text-[#28363f] text-xl font-medium leading-7 ">
        <DropdownMenuTrigger>
          <ChevronDown className="w-3 h-3" />
        </DropdownMenuTrigger>
        Tags
        <DropdownMenuContent className="h-[17.5] w-[37.5rem] px-3 py-[9px] border-b border-[#d0dce3] grid grid-cols-3">
          <DropdownMenuGroup className="text-[#28363f] text-base font-bold font-['Montserrat'] leading-tight">
            Design Tags
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              UX
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Product Design
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Wireframing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Prototype
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Branding
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Motion Design
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuGroup className="text-[#28363f] text-base font-bold font-['Montserrat'] leading-tight">
            Dev Tags
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f]  text-sm font-normal font-['Montserrat'] leading-tight">
              Frontend
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Backend
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Full Stack
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Python
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              JavaScript
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Data Science
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup className="text-[#28363f] text-base font-bold font-['Montserrat'] leading-tight">
            General Tags
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Prodect Management
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Cybersecurity
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              DevOps
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Coding
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Game Development
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight">
              Mobile Development
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>{' '}
      </Button>{' '}
    </DropdownMenu>
  );
}

export default FilterTags;
