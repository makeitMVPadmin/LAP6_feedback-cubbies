import { Button } from "../ui/button";
import { ImagePlus, X } from "lucide-react";
import React from "react";

function PostModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded shadow-lg ">
        <div className="flex justify-between">
          <div>
            <img />
            <h1 className="text-3xl font-bold">post options</h1>
          </div>
          <Button className="rounded-full" variant="outline" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        <form>
          <div>
            <div className="flex flex-col">
              <label className="font-bold">Post Message</label>
              <textarea
                className="border border-gray-300 rounded-lg p-2"
                placeholder="Type your message here"
              ></textarea>
            </div>
            <p>
              Post message will give the reviewers more details about your
              portfolio
            </p>
            <div className="flex items-center gap-2 bg-gray-100 border-b-2 border-t-2 border-gray-300 pb-2">
              <ImagePlus className="w-6 h-6" />
              <div>
                <label className="font-bold">Thumbnail</label>
                <div className="flex gap-2">
                  <input
                    className="border border-gray-300 rounded-lg p-2"
                    placeholder="Choose Image No file chosen"
                  ></input>
                  <Button>Submit</Button>
                </div>
                <p>Upload an Image</p>
              </div>
            </div>
            <p>--Waiting for final design here--</p>
          </div>
          <div></div>
          <div className="flex justify-between">
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
