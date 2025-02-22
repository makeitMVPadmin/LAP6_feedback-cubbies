import { useState, useEffect } from "react";
import fetchAllTags from "../../firebase/functions/fetchTags";

const categories = ["devTags", "designTags", "generalTechTags"];

const TagSelection = ({ selectedTags, setSelectedTags }) => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const allTags = await fetchAllTags();
                setTags(allTags || []); // make sure it's an array
            } catch (error) {
                console.error("Error fetching tags:", error);
                setTags([]); 
            }
        };
        fetchTags();
    }, []);

    const handleTagClick = (tag) => {
        setSelectedTags((prevSelectedTags) => {
            const isSelected = prevSelectedTags.some((t) => t.id === tag.id);
            return isSelected
                ? prevSelectedTags.filter((t) => t.id !== tag.id)
                : [...prevSelectedTags, tag];
        });
    };

    return (
        <section>
            {categories.map((category) => {
                const filteredTags = tags.filter((tag) => tag.category === category);

                return (
                    <div key={category}>
                        <h3>{category.replace("Tags", "")}</h3>
                        <div className="flex flex-wrap gap-2">
                            {filteredTags.map((tag) => (
                             <button
                                key={tag.id}
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleTagClick(tag);
                                }}
                                className={`py-[8px] px-[12px] rounded-[6px] border-none cursor-pointer
                                    ${selectedTags.some((t) => t.id === tag.id) 
                                        ? "bg-[#333] text-[white]" // selected state
                                        : "bg-[#ddd] text-[black] hover:bg-[#ccc]" // normal state
                                    }`}
                            >
                                {tag.tagName}
                            </button>
                         
                            ))}
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default TagSelection;
