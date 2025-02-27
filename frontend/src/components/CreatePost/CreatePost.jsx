import FilterTags from "../FilterTags";
import PostModal from "../PostModal/PostModal.jsx";
import { Button, Card, Avatar } from "../ui/index";
import React, { useState, useEffect } from "react";

function CreatePost() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling when modal opens
    } else {
      document.body.style.overflow = ""; // Restore scrolling when modal closes
    }

    return () => {
      document.body.style.overflow = ""; // Cleanup on unmount
    };
  }, [isModalOpen]);

  return (
    <>
      <Card className="h-24 p-6 rounded-lg border-l border-r-2 border-t border-b-2 border-[#28363f] justify-start items-start gap-6 inline-flex overflow-hidden">
        <div className="h-12 px-6 justify-start items-center gap-16 inline-flex">
          <Avatar className="w-12 h-12" />
          <Button
            className="h-12 pl-4 pr-5 py-2.5 bg-[#0264d4] hover:bg-[#024a9b] rounded-[10px] shadow-sm justify-center items-center gap-2 inline-flex"
            onClick={handleOpenModal}
          >
            Start Creating A Post
          </Button>
          <FilterTags />
        </div>
      </Card>
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default CreatePost;
