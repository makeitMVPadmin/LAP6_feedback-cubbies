import PostModal from '../PostModal/PostModal.jsx';
import { Button } from '../ui/index';
import React, { useState } from 'react';

function CreatePost() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
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
