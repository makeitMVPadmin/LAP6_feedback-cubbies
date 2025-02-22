import placeholder from "../../assets/portfolio-placeholder.jpeg";
import addPortfolio from "../../firebase/functions/addPortfolio";
import { Button } from "../ui/button";
import { ImagePlus, Link2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import TagSelection from "../TagSelection/TagSelection";

function PostModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [postMessage, setPostMessage] = useState("");
  const [link, setLink] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the portfolio data
    const portfolioData = {
      postMessage,
      link,
      coverImage: coverImage || placeholder,
    };

    // Call Firebase function to add portfolio data
    await addPortfolio(portfolioData);

    // Reset form after submission
    setPostMessage("");
    setLink("");
    setCoverImage(null);

    // Close modal after submitting
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-7 rounded-2xl border-2 border-black shadow-md w-[80%] max-w-[1014px] h-[603px] mt-[145px] overflow-hidden pt-[37px] pl-[62px] pr-[62px] pb-[16px]">
        <h2
          className="text-2xl font-bold mb-40px"
          style={{
            fontFamily: "Fraunces, serif",
          }}
        >
          Publish a Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mt-[40px]">
            <div className="w-[60%]">
              <div className="flex flex-col gap-2">
                <label
                  className="font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Post message
                </label>
                <textarea
                  className="border border-[#0F172A] rounded-lg px-3 py-2 placeholder-gray-500 h-[80px]"
                  placeholder="Post message will give the reviewers more details about your portfolio"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  value={postMessage}
                  onChange={(e) => setPostMessage(e.target.value)}
                />
              </div>
              <div className="flex items-center border border-[#0F172A] rounded-lg px-3 mt-[41px] mb-[18px] ">
                <Link2 className="w-4 h-4 rotate-[45deg]" />
                <input
                  className=" flex-1 rounded-lg p-2 placeholder-gray-500"
                  placeholder="Insert Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div
                className="w-full h-[103px] rounded-[8px] bg-cover bg-center flex flex-col justify-between"
                style={{ backgroundImage: `url(${placeholder})` }}
              >
                {/* <img alt="profile photo" /> */}
                {/* <p
                  className="p-2"
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#FFF",
                  }}
                >
                  My Portfolio
                </p> */}
              </div>
              <div className="flex items-center border border-[#0F172A] rounded-lg px-3">
                <ImagePlus className="w-4 h-4" />
                <input
                  className=" flex-1 rounded-lg p-2 placeholder-gray-500"
                  placeholder="Editify cover image"
                  type="file"
                  onChange={(e) =>
                    setCoverImage(URL.createObjectURL(e.target.files[0]))
                  }
                />
              </div>
            </div>
          </div>
          <section className="border-t border-black pb-2">
           <TagSelection selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          </section>
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="border-0 shadow-none"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button className="bg-[#0099ff]" type="submit">
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostModal;
