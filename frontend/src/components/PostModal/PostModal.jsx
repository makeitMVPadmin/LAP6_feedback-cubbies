import { Button } from "../ui/button";
import lightbulb from "/images/lightbulb.svg";
import { ImagePlus, X } from "lucide-react";
import React from "react";

function PostModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-7 rounded-3xl shadow-lg w-2/3">
        <div className="flex justify-between">
          <div className="flex mb-6 gap-4">
            <img src={lightbulb} />
            <h1 className="text-4xl font-bold ">post options</h1>
          </div>
          <Button
            className="rounded-full p-0"
            variant="outline"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <form>
          <div className="flex gap-4">
            <div className="w-[60%]">
              <div className="flex flex-col">
                <label>Post Message</label>
                <textarea
                  className="border border-gray-300 rounded-lg p-2 placeholder-gray-500"
                  placeholder="Type your message here"
                ></textarea>
              </div>
              <p className="border-b-2 border-gray-300 pb-2 text-gray-500">
                Post message will give the reviewers more details about your
                portfolio
              </p>
              <div className="flex items-center gap-2 bg-gray-100 mt-4 mb-4 rounded-lg p-2">
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
              </div>
              <p className="border-t-2 border-gray-300 pb-2">
                --Waiting for final design here--
              </p>
            </div>
            <div className=" bg-gray-400 w-10 h-10"></div>
          </div>
          <div className="flex justify-between gap-4">
            <Button variant="secondary">Save Changes</Button>
            <div>
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
