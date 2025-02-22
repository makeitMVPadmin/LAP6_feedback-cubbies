import Post from '../Post/Post.jsx';
import PostModal from '../PostModal/PostModal.jsx';
import Portfolio from '../Portfolio/Portfolio.jsx';
import fetchRoles from '../../firebase/functions/fetchRoles.js';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import ChevronDown from '../ui/chevron-down';
import React, { useState, useEffect } from 'react';

// loop through the posted portfolios
function HomeFeed() {
  //open modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);


  useEffect(() => {
    const getRoles = async () => {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles);
    };

    getRoles();
  }, []);
 

  return (
    <div className="grid grid-cols-1 gap-[3.13rem] justify-items-center">
      <Card className="h-24 p-6 rounded-lg border-l border-r-2 border-t border-b-2 border-[#28363f] justify-start items-start gap-6 inline-flex overflow-hidden">
        <div className="h-12 px-6 justify-start items-center gap-16 inline-flex">
          <img
            className="w-9 h-9 rounded-full"
            src="https://s3-alpha-sig.figma.com/img/8757/ea43/56d61cf7bb51515bf9da9c2f34ea9d23?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=lIZuF74W~vHigZ4RccPfTTsvUcjXZI3QYmLos9h-AKERaZtZd71LC0oAptDzu4fUExn46v91WJIk71pklm1W62ZykvwPKu~FZUvD1ylZ1btHfQqlkNVWQh~DG9-pH3ZG7YJhRRGBEdOtJF1N-PwSFIrtAmufTs62Zs5dT6VHlGzzCMMuBsh0tE1~WRFLq9rhXUHJ7scXLYDG06xd9q9H7oDd3qDPr0AmFfwFgrbI1haBvV2nLSDGB8B6TjIDLHns0w3R0xG9Oruuog81fq3ZkVetKIap~v8PvGGo8J5EZ84RHkcH9nj6~Jd5aCNsvDyuHqZkXDcXPaqIl2jgkVkMfA__"
          />

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
      {/* <Post /> */}
      <div>
        <h2>Roles</h2>
        <ul>
          {roles.map((role_name, id) => (
            <li key={id}>{role_name}</li>
            
          ))}
        </ul>
      </div>
      <Portfolio />
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} />
  
    </div>
  );
}

export default HomeFeed;
