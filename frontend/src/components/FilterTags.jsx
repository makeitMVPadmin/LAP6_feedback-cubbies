import { Button, ChevronDown, DropdownMenuGroup } from './ui/index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function FilterTags({ selectedTag, setSelectedTag }) {
  return (
    <div className="pl-4 pr-5">
      <DropdownMenu>
        <Button
          variant="outline"
          className="h-12 w-auto pl-4 pr-5 bg-[#ffd22f] hover:bg-[#e6b800] rounded-[10px] justify-center items-center gap-2 inline-flex text-center text-[#28363f] text-xl leading-7 ">
          <DropdownMenuTrigger>
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          Tags
          <DropdownMenuContent className="h-[17.5] w-[37.5rem] px-3 py-[9px] border-b border-[#d0dce3] grid grid-cols-3 ">
            <DropdownMenuGroup className="text-[#28363f] text-base font-bold font-['Montserrat'] leading-tight ">
              Design Tags
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]"
                onClick={() => setSelectedTag('UX')}>
                UX
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Product Design
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f] ">
                Wireframing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f] ">
                Prototype
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f] ">
                Branding
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Motion Design
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuGroup className="text-[#28363f] text-base font-bold font-['Montserrat'] leading-tight">
              Dev Tags
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Frontend
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Backend
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Full Stack
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Python
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                JavaScript
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Data Science
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            <DropdownMenuGroup className="text-[#28363f] text-base font-bold font-['Montserrat'] leading-tight]">
              General Tags
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Prodect Management
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Cybersecurity
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                DevOps
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Coding
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Game Development
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#28363f] text-sm font-normal font-['Montserrat'] leading-tight focus:bg-[#ffd22f]">
                Mobile Development
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>{' '}
        </Button>{' '}
      </DropdownMenu>
    </div>
  );
}

export default FilterTags;
