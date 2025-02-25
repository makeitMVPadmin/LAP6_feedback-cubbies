import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { fetchAllTags } from "../../firebase/functions/index.js";

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
        e.stopPropagation();

        // replace the selected tag in the category dropdown
        setSelectedTags((prevSelectedTags) => {
            const updatedTags = prevSelectedTags.filter((t) => t.category !== category);
            updatedTags.push({ ...tag, category });
            return updatedTags;
        });

        // keep the dropdown open after a selection
        setOpenDropdowns((prevOpenDropdowns) => 
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
                            onClick={() =>
                                setOpenDropdowns((prevOpenDropdowns) =>
                                    prevOpenDropdowns.includes(category)
                                        ? prevOpenDropdowns
                                        : [...prevOpenDropdowns, category] // open if not
                                )
                            }
                            className="flex justify-between items-center bg-[#fffefe] text-black px-4 py-2 rounded-lg hover:bg-[#ccc] w-[200px] h-[40px] flex-shrink-0 
                            border radius-[8px] border-t-[1px] border-r-[2px] border-b-[2px] border-l-[1px] border-gray-800 text-base font-bold"
                        >
                            {category} 
                            <ChevronDown className="w-5 h-5" />
                        </button>

                        {/* dropdown Menu */}
                        {isOpen && (
                            <div className="absolute left-0 w-full bg-white border radius-[8px] border-t-[1px] border-r-[2px] border-b-[2px] border-l-[1px]
                             shadow-md rounded-lg mt-1 z-10">
                                {filteredTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={(e) => handleTagClick(tag, category, e)} // update the selected tag
                                        className={`block w-full text-left px-4 py-2 cursor-pointer text-[14px] font-400 leading-[20px]
                                            ${
                                                selectedTags.some((t) => t.id === tag.id && t.category === category)
                                                    ? "bg-[#0099FF] text-white"
                                                    : "hover:bg-[#0099FF] hover:text-white"
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
