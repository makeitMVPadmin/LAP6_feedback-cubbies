import Post from "../Post/Post.jsx";
import img1 from "/images/MockImg1.jpg";
import img2 from "/images/MockImg2.jpg";
import img3 from "/images/MockImg3.jpg";
import resume from "/images/MockResume.png";
import React from "react";

// loop through the posted portfolios
function HomeFeed() {
  // mock data - replace with actual data later
  let mockPosts = [
    {
      id: 1,
      username: "johnSmith",
      title: "My Portfolio",
      description: "Brief description of my portfolio. More details.",
      images: [img1, img2, img3],
    },
    {
      id: 2,
      username: "janeDoe",
      title: "My Resume",
      description: "My resume, looking for feedback.",
      images: [resume],
    },
  ];

  return (
    <section className="">
      {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  );
}

export default HomeFeed;
