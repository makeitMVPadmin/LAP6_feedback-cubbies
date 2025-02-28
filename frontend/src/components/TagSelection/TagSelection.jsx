import { fetchAllTags } from "../../firebase/functions/fetchTags";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const categories = ["Dev Tags", "General Tags", "Design Tags"];

const TagSelection = ({ selectedTags, setSelectedTags }) => {
  const [tags, setTags] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const allTags = await fetchAllTags();
        setTags(allTags || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  const handleTagClick = (tag, category, e) => {
    e.preventDefault();
    e.stopPropagation();

    // replace the selected tag in the category dropdown
    setSelectedTags((prevSelectedTags) => {
      const isAlreadySelected = prevSelectedTags.some(
        (t) => t.id === tag.id && t.category === category
      );
    
      if (isAlreadySelected) {
        return prevSelectedTags.filter(
          (t) => !(t.id === tag.id && t.category === category)
        ); 
      } else {
        return [...prevSelectedTags, { ...tag, category }]; 
      }
    });

    // keep the dropdown open after a selection
    setOpenDropdowns(
      (prevOpenDropdowns) =>
        prevOpenDropdowns.includes(category)
          ? prevOpenDropdowns // do nothing if the dropdown is already open
          : [...prevOpenDropdowns, category] // otherwise, add it to the open list
    );
  };

  return (
    <section className="flex gap-[10px]">
      {categories.map((category) => {
        const filteredTags = tags.filter((tag) => tag.category === category);
        const isOpen = openDropdowns.includes(category); // check if the dropdown is open

        const selectedTag = selectedTags.find((t) => t.category === category);

        return (
          <div key={category} className="relative w-[220px] mb-[215px]">
          {/* dropdown button */}
          <button
            type="button"
            onClick={() =>
              setOpenDropdowns((prevOpenDropdowns) =>
                prevOpenDropdowns.includes(category)
                  ? prevOpenDropdowns.filter((c) => c !== category) // close dropdown
                  : [...prevOpenDropdowns, category] // open dropdown
              )
            }
            className={`flex justify-between items-center bg-[#fffefe] text-black px-4 py-2 w-[200px] h-[40px] flex-shrink-0  border-black border-t-[1px] border-r-[2px] border-b-[2px] border-l-[1px] 
              border border-gray-800 text-base font-bold
              ${
                isOpen
                ? "rounded-t-lg border-b-[0.5px] border-b-[#d9d9d9] border-r-[2px]" // open state
                : "rounded-lg border-b-[2px]" // goes back to closed state
              }`}
          >
            {category}
            <ChevronDown className="w-5 h-5" />
          </button>
        
          {/* dropdown Menu */}
          {isOpen && (
            <div
              className="absolute left-0 w-[200px] bg-white border-black border-t-0 border-r-[2px] border-b-[2px] border-l-[1px] 
                rounded-b-lg z-10" 
            >
              {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={(e) => handleTagClick(tag, category, e)}
                  className={`block w-full text-left px-[12px] py-[9px] text-[#28363F] text-[14px] font-400 leading-[20px] transition-all 
                    ${selectedTags.some((t) => t.id === tag.id && t.category === category)
                      ? "bg-[#FFD22F] text-black border border-[#987700]"
                      : "hover:bg-[#FFD22F] hover:text-black"}`}
                >
                  {tag.tagName}
                </button>
              ))}
            </div>
          )}
        </div>
        );
      })}
    </section>
  );
};

export default TagSelection;
