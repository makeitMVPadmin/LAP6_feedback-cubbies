import React from "react";
import PostModal from '../PostModal/PostModal.jsx';
import { Button, ChevronDown, Card, Avatar } from '../ui/index';
import { useState } from 'react';

function CreatePost() {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
  return (
    <>
      <Card className="h-24 p-6 rounded-lg border-l border-r-2 border-t border-b-2 border-[#28363f] justify-start items-start gap-6 inline-flex overflow-hidden">
        <div className="h-12 px-6 justify-start items-center gap-16 inline-flex">
          <Avatar className="w-12 h-12" />
          <Button
            className="h-12 pl-4 pr-5 py-2.5 bg-[#0264d4] hover:bg-[#024a9b] rounded-[10px] shadow-sm justify-center items-center gap-2 inline-flex"
            onClick={handleOpenModal}>
            Start Creating A Post
          </Button>
          <Button
            variant="outline"
            className="h-12 pl-4 pr-5 bg-[#ffd22f] hover:bg-[#e6b800] rounded-[10px] justify-center items-center gap-2 inline-flex text-center text-[#28363f] text-xl font-medium leading-7 ">
            <ChevronDown className="w-3 h-3" />
            Tags
          </Button>
        </div>
      </Card>
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
    
    
  )
}

export default CreatePost
