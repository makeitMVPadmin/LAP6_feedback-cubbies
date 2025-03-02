import { fetchAllTagsSorted } from "../firebase/functions/fetchTags";
import { Button, ChevronDown, DropdownMenuGroup } from "./ui/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function FilterTags({ selectedTag, setSelectedTag }) {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This ensures the dropdown is rendered only on the client side
  }, []);

  useEffect(() => {
    const getTags = async () => {
      try {
        const tagsData = await fetchAllTagsSorted();
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setError("Error fetching tags");
      }
    };

    getTags();
  }, []);

  if (!isClient) return null; // Don't render the dropdown on the server

  return (
    <DropdownMenu>
      <Button
        variant="outline"
        className="h-12 pl-4 pr-5 bg-[#ffd22f] hover:bg-[#ffd22f] rounded-[10px] justify-center items-center gap-2 inline-flex text-center text-[#28363f] text-xl font-medium leading-7"
      >
        <DropdownMenuTrigger>
          <ChevronDown className="w-3 h-3" />
        </DropdownMenuTrigger>
        Tags
        <DropdownMenuContent className="h-[17.5rem] w-[37.5rem] px-3 py-[9px] border-b border-[#d0dce3] grid grid-cols-3">
          {tags.map((tag) => (
            <DropdownMenuItem
              key={tag.id}
              className="text-[#28363f] focus:bg-[#ffd22f] text-sm font-normal font-['Montserrat'] leading-tight"
              onClick={() => setSelectedTag(tag.id)}
            >
              {tag.tagName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </Button>
    </DropdownMenu>
  );
}

export default FilterTags;
