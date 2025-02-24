import placeholder from "../../assets/portfolio-placeholder.jpeg";
import { auth } from "../../firebase/firebase";
import { addPortfolio } from "../../firebase/functions/index.js";
import TagSelection from "../TagSelection/TagSelection";
import { Button } from "../ui/button";
import { ImagePlus, Link2 } from "lucide-react";
import React, { useState, useEffect } from "react";

function PostModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [postMessage, setPostMessage] = useState("");
  const [link, setLink] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showError, setShowError] = useState(false); // Track form error

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // check if the user is logged in
    if (!auth.currentUser) {
      console.error("User is not authenticated.");
      return;
    }

    //form fiels validation
    if (!postMessage || !link || !coverImage || selectedTags.length === 0) {
      setShowError(true);
      return;
    }

    const portfolioData = {
      userId: auth.currentUser.uid,
      title: postMessage,
      description: postMessage,
      imageUrl: coverImage,
      link,
      tagId: selectedTags.map((tag) => tag.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addPortfolio(portfolioData);

    setPostMessage("");
    setLink("");
    setCoverImage(null);
    setSelectedTags([]);
    setShowError(false);

    onClose();
  };

  // Handle closing the modal when clicking outside of it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-10"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white p-7 rounded-2xl border-2 w-[1014px] h-[90vh] overflow-y-auto pt-[45px] pl-[62px] pr-[62px] pb-[16px]"
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
            <div className="w-[60%] border-b border-black">
              {/* Text area for description */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-bold text-base"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Post message
                </label>
                <textarea
                  className="border border-[#0F172A] rounded-lg px-3 py-2 placeholder-gray-500 h-[80px]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  placeholder="Post message will give the reviewers more details about your portfolio"
                  value={postMessage}
                  onChange={(e) => setPostMessage(e.target.value)}
                />
              </div>
              {/* Input for inserting a portfolio link */}
              <div className="flex items-center border border-[#0F172A] rounded-lg px-3 mt-[42px] mb-4 w-[384px] focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-400">
                <Link2 className="w-4 h-4 rotate-[45deg]" />
                <input
                  className="flex-1 rounded-lg p-2 placeholder-gray-500 outline-none "
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  placeholder="Insert Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-[32px] w-[313px]">
              {/* Display selected or placeholder image */}
              <div
                className="w-full h-[103px] rounded-[8px] bg-cover bg-center flex flex-col justify-between"
                style={{ backgroundImage: `url(${coverImage || placeholder})` }}
              ></div>
              {/* Input for uploading a cover image */}
              <div className="h-[40px]">
                <label className="flex items-center border border-[#0F172A] rounded-lg px-3 mt-[19px] w-full h-full">
                  <ImagePlus className="w-4 h-4" />
                  <span
                    className="text-gray-500 ml-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {coverImage ? "File selected" : "Edit cover image"}
                  </span>
                  <input
                    className="flex-1 rounded-lg hidden"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    type="file"
                    onChange={(e) =>
                      setCoverImage(URL.createObjectURL(e.target.files[0]))
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Display error message only when clicking Submit */}
          {showError && (
            <p
              className="text-red-500 text-sm mt-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              ⚠️ All fields are required.
            </p>
          )}

          {/* Tag selection section */}
          <section className="pb-4 mt-4">
            <h2 className="text-base font-bold my-2 mx-4">Choose Tags</h2>
            <TagSelection
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </section>

          {/* Buttons for canceling or publishing */}
          <div className="flex justify-between mt-4 font-[20px]">
            <Button
              variant="outline"
              className="border-0 shadow-none"
              style={{ fontFamily: "Montserrat, sans-serif" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#0099ff] font-[20px]"
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
