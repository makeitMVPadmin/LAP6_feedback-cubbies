import React from "react";

// rendering a single posted portfolio
function Post({ post}) {
  return (
    <div className="post-card">
      <h2 className="post-card__username">{post.username}</h2>
      <h3 className="post-card__title">{post.title}</h3>
      <p className="post-card__description">{post.description}</p>
      <div className="post-card__carousel">
        {post.images.map((image, index) => (
          <img className="post-card__image" key={index} src={image} alt={post.title} />
        ))}
    </div>
    </div>
  )
}

export default Post