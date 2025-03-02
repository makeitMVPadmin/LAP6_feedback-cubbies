import React, { useState, useEffect } from 'react';
import PostModal from '../PostModal/PostModal.jsx';
import { Button } from '../ui/index'

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
     <div className="h-12 px-6 justify-start items-center gap-16 inline-flex">
        <Button
          className="h-12 w-xs pl-4 pr-5 py-2.5 bg-[#0264d4] hover:bg-[#024a9b] rounded-[10px] text-xl shadow-sm justify-center items-center gap-2 inline-flex"
          onClick={handleOpenModal}>
          Start Creating A Post...
        </Button>
      </div>

      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default CreatePost;
