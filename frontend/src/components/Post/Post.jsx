import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


// rendering a single posted portfolio
function Post({ post}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.username}</CardTitle>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {post.images.map((image, index) => (
            <img key={index} src={image} alt={post.title} />
          ))}
      </CardContent>
    </Card>
  )
}

export default Post