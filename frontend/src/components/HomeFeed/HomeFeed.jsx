import img1 from '../../../public/images/MockImg1.jpg';
import fetchRoles from '../../firebase/functions/fetchRoles.js';
import Portfolio from '../Portfolio/Portfolio.jsx';
import Post from '../Post/Post.jsx';
import PostModal from '../PostModal/PostModal.jsx';
import Avatar from '../ui/avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import ChevronDown from '../ui/chevron-down';
import React, { useState, useEffect } from 'react';

// loop through the posted portfolios
function HomeFeed() {
  //open modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [posts, setPosts] = useState([]); // Add state for posts

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const getRoles = async () => {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles);
    };

    getRoles();

    // Add mock data for posts
    const mockPosts = [
      {
        id: 1,
        username: 'johnSmith',
        title: 'My Portfolio',
        description: 'Brief description of my portfolio. More details.',
        images: [
          'https://via.placeholder.com/450',
          'https://via.placeholder.com/450',
          'https://via.placeholder.com/450',
        ],
      },
      {
        id: 2,
        username: 'janeDoe',
        title: 'My Resume',
        description: 'My resume, looking for feedback.',
        images: ['https://via.placeholder.com/450'],
      },
    ];

    setPosts(mockPosts);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-[3.13rem] justify-items-center">
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
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <Portfolio />

      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default HomeFeed;
