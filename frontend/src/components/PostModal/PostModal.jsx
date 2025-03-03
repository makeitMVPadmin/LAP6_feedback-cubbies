import placeholder from "../../assets/portfolio-placeholder.jpeg";
import { useNavigation } from "../../context/NavigationContext.jsx";
import { useUser } from "../../context/UserContext";
import { addPortfolio } from "../../firebase/functions/index.js";
import { showCustomToast } from "../CustomToast/CustomToast";
import TagSelection from "../TagSelection/TagSelection";
import { Button } from "../ui/button";
import { ImagePlus, Link2 } from "lucide-react";
import React, { useState, useEffect } from "react";

function PostModal({ isOpen, onClose }) {
  const { currentUser } = useUser();
  if (!isOpen) return null;
  const { goToProfileDetails } = useNavigation();
  const [postMessage, setPostMessage] = useState("");
  const [link, setLink] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showError, setShowError] = useState(false); // Error message state

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling when modal opens
    } else {
      document.body.style.overflow = ""; // Restore scrolling when modal closes
    }

    return () => {
      document.body.style.overflow = ""; // Ensure cleanup when modal unmounts
    };
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

     // Check if selectedTags is an array and has valid tags
     const hasValidTags = selectedTags && selectedTags.length > 0;

  if (!link.trim() || !coverImage || !hasValidTags) {
    setShowError(true);
    return;
  }

    const portfolioData = {
      userId: currentUser.id,
      postMessage,
      title: postMessage,
      description: postMessage,
      imageUrl: coverImage, // Use the coverImage URL directly
      link,
      tagId: selectedTags.map((tag) => tag.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Add portfolio and get the portfolioId
      const addedPortfolio = await addPortfolio(portfolioData);
      console.log("Added Portfolio Response:", addedPortfolio);

      const portfolioId = addedPortfolio.id;

      console.log("Portfolio Created with ID:", portfolioId);

      setPostMessage("");
      setLink("");
      setCoverImage(null);
      setSelectedTags([]);
      setShowError(false);
      onClose();
      goToProfileDetails(portfolioId);
      showCustomToast(5000);
    } catch (error) {
      console.error("Error adding portfolio:", error);
    }
  };

  // Clear error when user starts typing
  const handlePostMessageChange = (e) => {
    setPostMessage(e.target.value);
    if (showError) setShowError(false);
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
    if (showError) setShowError(false);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.value);
    if (showError) setShowError(false);
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
    if (showError) setShowError(false);
  };

  // Handle closing the modal when clicking outside of it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-10 bg-black/60"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white p-7 rounded-2xl border-2 w-[1014px] h-[730px] pt-[45px] pl-[62px] pr-[62px] pb-[16px] overflow-hidden relative"
        style={{
          borderTop: "1px solid var(--Gray-Gray12, #28363F)",
          borderRight: "2px solid var(--Gray-Gray12, #28363F)",
          borderBottom: "2px solid var(--Gray-Gray12, #28363F)",
          borderLeft: "1px solid var(--Gray-Gray12, #28363F)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-2xl font-bold mb-[40px]"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Publish a Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-[37px]">
            <div className="w-[60%]">
              {/* Text area for description */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-bold text-base"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Post message
                </label>
                <textarea
                  className="border border-[#0F172A] rounded-lg px-3 py-2 placeholder-gray-500 h-[103px]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  placeholder="Post message will give the reviewers more details about your portfolio"
                  value={postMessage}
                  onChange={handlePostMessageChange}
                />
              </div>

              {/* Input for inserting a portfolio link */}
              <div
                className={`relative flex items-center border rounded-lg px-3 mt-[18px] w-[384px] h-[38px] transition-all ${
                  showError && !link.trim()
                    ? "border-red-500"
                    : "border-[#0F172A]"
                }`}
              >
                <Link2 className="w-4 h-4 rotate-[45deg]" />
                <input
                  className="flex-1 rounded-lg p-2 placeholder-gray-500 outline-none"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  placeholder="Insert Link"
                  value={link}
                  onChange={handleLinkChange}
                />

                {/* Display error message when click submit */}
              </div>
              {showError && (
                <div className="flex gap-2 absolute left-[62px]">
                  <p
                    className="text-white text-sm mt-2 rounded-full bg-red-500 px-[9px] mb-0"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    !
                  </p>
                  <p
                    className="text-red-500 text-sm mt-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Field input is required
                  </p>
                </div>
              )}
            </div>

            <div className="pt-[32px] w-[313px] relative">
              {/* Display selected or placeholder image */}
              <div
                className="w-full h-[103px] rounded-[8px] bg-cover bg-center flex flex-col justify-between"
                style={{ backgroundImage: `url(${coverImage || placeholder})` }}
              ></div>

              {/* Input for uploading a cover image */}
              <div className="h-[40px]">
                <label
                  className={`h-[40px] border rounded-lg px-3 mt-[18px] w-full flex items-center transition-all ${
                    showError && !coverImage
                      ? "border-red-500"
                      : "border-[#0F172A]"
                  }`}
                >
                  <ImagePlus className="w-4 h-4" />
                  <input
                    className="flex-1 rounded-lg p-2 placeholder-gray-500 outline-none"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onChange={handleCoverImageChange}
                    value={coverImage || ""}
                    placeholder="Insert image link"
                  />
                </label>
              </div>

              {/* Display error message when click submit */}
              {showError && (
                <div className="flex gap-2 absolute ">
                  <p
                    className="text-white text-sm mt-2 rounded-full bg-red-500 px-[9px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    !
                  </p>
                  <p
                    className="text-red-500 text-sm mt-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Field input is required
                  </p>
                </div>
              )}
            </div>
          </div>
            {/* Tag selection section */}
            <section className="pb-4 mt-4 relative w-[313px]">
              <h2 className="text-base font-bold mb-[25px] mt-[38px]">Choose Tags</h2>
              
              <TagSelection
                onChange={handleTagsChange}
                selectedTags={selectedTags}
                showError={showError && selectedTags.length === 0}
              />

              {/* Display error message when clicking submit */}
              {showError && selectedTags.length === 0 && (
                <div className="flex gap-2 absolute left-0 mt-[-200px]">
                  <p
                    className="text-white text-sm rounded-full bg-red-500 px-[9px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    !
                  </p>
                  <p
                    className="text-red-500 text-sm"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Field input is required
                  </p>
                </div>
              )}
            </section>


          {/* Buttons for canceling or publishing */}
          <div className="flex justify-between">
            <Button
              className="border-none shadow-none  h-[48px] text-[20px]"
              variant="outline"
              onClick={onClose}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#0099ff] h-[48px] text-[20px]"
              type="submit"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostModal;
