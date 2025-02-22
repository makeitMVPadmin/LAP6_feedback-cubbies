import { useState, useEffect } from "react";
import fetchTagsByCategory from "../../firebase/functions/fetchTags";

const categories = ["devTags", "designTags", "generalTechTags"];

const TagSelection = ({ selectedTags, setSelectedTags }) => {
    const [tags, setTags] = useState({});

    const fetchTags = async () => {
        try {
            let fetchedTags = {};
            for (let category of categories) {
                const tagsData = await fetchTagsByCategory(category);
                fetchedTags[category] = tagsData;
            }
            setTags(fetchedTags);
        } catch (error) {
            console.error("Error fetching tags: ", error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    // check if the tag is selected (by id), then filter out the tags if they're selected
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
            {Object.entries(tags).map(([category, tagList]) => (
                <div key={category}>
                    <h3>{category.replace("Tags", "")}</h3>
                    <div className="flex flex-wrap gap-2">
                        {tagList?.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => handleTagClick(tag)}
                                className={`py-[8px] px-[12px] rounded-[6px] border-none cursor-pointer ${
                                    selectedTags.some((t) => t.id === tag.id)
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-300 text-black"
                                }`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default TagSelection;
