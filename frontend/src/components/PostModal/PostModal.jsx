import { Button } from "../ui/button";
import { ImagePlus, X, Link2 } from "lucide-react";
import React from "react";
import { useEffect } from "react";

function PostModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  //   useEffect(() => {
  //     if (isOpen) {
  //       document.body.classList.add("overflow-hidden");
  //     } else {
  //       document.body.classList.remove("overflow-hidden");
  //     }

  //     return () => document.body.classList.remove("overflow-hidden");
  //   }, [isOpen]);

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
        <form>
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
                />
              </div>
              <div className="flex items-center border border-[#0F172A] rounded-lg px-3 mt-[41px]">
                <Link2 className="w-4 h-4 rotate-[45deg]" />
                <input
                  className=" flex-1 rounded-lg p-2 placeholder-gray-500"
                  placeholder="Insert Link"
                />
              </div>
              {/* <div className="flex items-center gap-2 bg-gray-100 mt-4 mb-4 rounded-lg p-2">
                <ImagePlus className="w-6 h-6 mr-2.5 ml-4" />
                <div>
                  <label>Thumbnail</label>
                  <div className="flex gap-2">
                    <input
                      className="border border-gray-300 rounded-lg p-2 placeholder-gray-500"
                      placeholder="Choose Image No file chosen"
                    ></input>
                    <Button>Submit</Button>
                  </div>
                  <p className="text-gray-500">Upload an Image</p>
                </div>
              </div> */}
              <p className="border-t-2 border-gray-300 pb-2">--TAGS HERE--</p>
            </div>
            <div className=" bg-gray-400 w-10 h-10"></div>
          </div>
          <div className="flex justify-between">
            <Button variant="secondary">Save Changes</Button>
            <div className="flex gap-4">
              <Button variant="outline">Cancel</Button>
              <Button>Publish</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostModal;
