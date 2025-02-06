import React from "react";

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
      <div key={post.id} className="">
        <h2 className="">{post.username}</h2>
        <h3 className="">{post.title}</h3>
        <p className="">{post.description}</p>
        <div className="carousel">
          {post.images.map((image, index) => (
            <img className="" key={index} src={image} alt={post.title} />
          ))}
        </div>
      </div>
      ))}
    </section>
  )
}

export default HomeFeed