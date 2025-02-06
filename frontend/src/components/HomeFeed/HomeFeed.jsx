import React from "react";
import Post from "../Post/Post.jsx";

// loop through the posted portfolios
function HomeFeed() {
  // mock data - replace with actual data later
  let mockPosts = [
    {
    "id": 1,
    "username": "johnSmith",
    "title": "My Portfolio",
    "description": "Brief description of my portfolio. More details.",
    "images": ["image1.jpg", "image2.jpg", "image3.jpg"]
    },
    {
      "id": 2,
      "username": "janeDoe",
      "title": "My Resume",
      "description": "My resume, looking for feedback.",
      "images": ["resume1.jpg"]
    },
  ]

  return (
    <section className="">
      {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  )
}

export default HomeFeed