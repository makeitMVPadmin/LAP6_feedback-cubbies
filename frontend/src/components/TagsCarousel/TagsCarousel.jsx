import fetchCategories from "../../utils/fetchCategories";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";
import React, { useState, useEffect } from "react";

const TagsCarousel = () => {
  const [devTags, setDevTags] = useState([]);
  const [designTags, setDesignTags] = useState([]);
  const [generalTechTags, setGeneralTechTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState({
    devTags: [],
    designTags: [],
    generalTechTags: [],
  });

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategoriesData = async () => {
      const devTagsData = await fetchCategories("devTags");
      const designTagsData = await fetchCategories("designTags");
      const generalTechTagsData = await fetchCategories("generalTechTags");

      setDevTags(devTagsData || []); // Default to empty array if no data is returned
      setDesignTags(designTagsData || []);
      setGeneralTechTags(generalTechTagsData || []);
    };
    fetchCategoriesData();
  }, []);

  // Handle the tag selection
  const handleTagSelection = (category, tag) => {
    setSelectedTags((prevSelectedTags) => ({
      ...prevSelectedTags,
      [category]: [...prevSelectedTags[category], tag],
    }));
  };

  // Handle tag removal
  const handleTagRemoval = (category, tag) => {
    setSelectedTags((prevSelectedTags) => ({
      ...prevSelectedTags,
      [category]: prevSelectedTags[category].filter((selectedTag) => selectedTag !== tag),
    }));
  };

  // Render categories with tags in the carousel
  const renderCategories = (categoryName, tags) => {
    return (
      <div key={categoryName}>
        <h3 className="text-xl font-semibold mb-2">{categoryName}</h3>
        <Carousel>
          <CarouselContent>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <CarouselItem key={tag} className="basis-1/4 p-2">
                  <button
                    onClick={() =>
                      selectedTags[categoryName]?.includes(tag)
                        ? handleTagRemoval(categoryName, tag)
                        : handleTagSelection(categoryName, tag)
                    }
                    className={`w-full p-4 border rounded-md ${
                      selectedTags[categoryName]?.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {tag}
                  </button>
                </CarouselItem>
              ))
            ) : (
              <p>No tags available</p> // Handle case where there are no tags
            )}
          </CarouselContent>

          <div className="flex justify-center mt-4">
            <CarouselPrevious className="mr-4">
              <span className="material-symbols-outlined">arrow_back</span>
            </CarouselPrevious>
            <CarouselNext>
              <span className="material-symbols-outlined">arrow_forward</span>
            </CarouselNext>
          </div>
        </Carousel>
      </div>
    );
  };

  return (
    <div>
      {renderCategories("Dev Tags", devTags)}
      {renderCategories("Design Tags", designTags)}
      {renderCategories("General Tech Tags", generalTechTags)}
    </div>
  );
};

export default TagsCarousel;
