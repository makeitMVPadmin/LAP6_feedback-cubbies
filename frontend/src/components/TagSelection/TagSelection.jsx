import fetchAllTags from "../../firebase/functions/fetchTags";
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
    <section className="flex gap-4">
      {categories.map((category) => {
        const filteredTags = tags.filter((tag) => tag.category === category);
        const isOpen = openDropdowns.includes(category); // check if the dropdown is open

        const selectedTag = selectedTags.find((t) => t.category === category);

        return (
          <div key={category} className="relative w-1/3 mb-[200px]">
            {/* dropdown button */}
            <button
              type="button" //prevents immediate form submission
              onClick={() =>
                setOpenDropdowns(
                  (prevOpenDropdowns) =>
                    prevOpenDropdowns.includes(category)
                      ? prevOpenDropdowns
                      : [...prevOpenDropdowns, category] // open if not
                )
              }
              className="flex justify-between items-center bg-[#fffefe] text-black px-4 py-2 rounded-lg hover:bg-[#ccc] w-[200px] h-[40px] flex-shrink-0 
                            border radius-[8px] border-t-[1px] border-r-[2px] border-b-[1px] border-l-[1px] border-gray-800 text-base font-bold"
            >
              {category}
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* dropdown Menu */}
            {isOpen && (
              <div
                className="absolute left-0 w-50 bg-white border-black radius-[8px] border-t-[1px] border-r-[2px] border-b-[2px] border-l-[1px]
                             rounded-lg z-10"
              >
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={(e) => handleTagClick(tag, category, e)}
                    className={`block w-full text-left px-4 py-2 cursor-pointer text-[14px] font-400 leading-[20px] transition-all
                    
                      ${
                        selectedTags.some(
                          (t) =>
                            t.id === tag.id &&
                            t.category === category
                        )
                          ? "bg-[#FFD22F] text-black font-bold border-width-[2rem] border border-[#d0aa24] focus:radius-[8px] "
                          : "hover:bg-[#FFD22F] hover:text-black focus:radius-[8px]"
                      }`}
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
