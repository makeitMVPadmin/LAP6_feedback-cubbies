import Post from '../Post/Post.jsx';
import PostModal from '../PostModal/PostModal.jsx';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import ChevronDown from '../ui/chevron-down';
import img1 from '/images/MockImg1.jpg';
import img2 from '/images/MockImg2.jpg';
import img3 from '/images/MockImg3.jpg';
import resume from '/images/MockResume.png';
import React, { useState } from 'react';

// loop through the posted portfolios
function HomeFeed() {
  //open modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // mock data - replace with actual data later

  // let mockPosts = [
  //   {
  //     id: 1,
  //     username: "johnSmith",
  //     title: "My Portfolio",
  //     description: "Brief description of my portfolio. More details.",
  //     images: [img1, img2, img3],
  //   },
  //   {
  //     id: 2,
  //     username: "janeDoe",
  //     title: "My Resume",
  //     description: "My resume, looking for feedback.",
  //     images: [resume],
  //   },
  // ];

  return (
    <section className="grid grid-cols-1 justify-items-center">
      <Card className="h-24 p-6 rounded-lg border-l border-r-2 border-t border-b-2 border-[#28363f] flex-col justify-start items-start gap-16 inline-flex overflow-hidden">
        <div className="h-12 px-6 justify-start items-center gap-16 inline-flex">
          <img
            className="w-9 h-9 rounded-full"
            src="https://s3-alpha-sig.figma.com/img/8757/ea43/56d61cf7bb51515bf9da9c2f34ea9d23?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=lIZuF74W~vHigZ4RccPfTTsvUcjXZI3QYmLos9h-AKERaZtZd71LC0oAptDzu4fUExn46v91WJIk71pklm1W62ZykvwPKu~FZUvD1ylZ1btHfQqlkNVWQh~DG9-pH3ZG7YJhRRGBEdOtJF1N-PwSFIrtAmufTs62Zs5dT6VHlGzzCMMuBsh0tE1~WRFLq9rhXUHJ7scXLYDG06xd9q9H7oDd3qDPr0AmFfwFgrbI1haBvV2nLSDGB8B6TjIDLHns0w3R0xG9Oruuog81fq3ZkVetKIap~v8PvGGo8J5EZ84RHkcH9nj6~Jd5aCNsvDyuHqZkXDcXPaqIl2jgkVkMfA__"
          />

          <Button
            className="h-12 pl-4 pr-5 py-2.5 bg-[#0264d4] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.20)] justify-center items-center gap-2 inline-flex"
            onClick={handleOpenModal}>
            Start Creating A Post
          </Button>
          <Button className="h-12 pl-4 pr-5 bg-[#ffd22f] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.20)] justify-center items-center gap-2 inline-flex text-center text-[#28363f] text-xl font-medium leading-7">
            <ChevronDown />
            Tags
          </Button>
        </div>
      </Card>
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} />
      {/* {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))} */}
      <Post />
    </section>
  );
}

export default HomeFeed;
