import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";


// rendering a single posted portfolio
function Post({ post }) {
  // console.log("Received post:", post);
  
  if (!post) {
    console.error("Post is undefined!");
    return null;
  }

  return (
    <Card className="flex flex-col items-center text-left w-3xl">
    <CardHeader>
      <CardTitle>{post?.username || "Unknown User"}</CardTitle>
      <CardTitle>{post?.title || "Untitled Post"}</CardTitle>
      <CardDescription>{post?.description || "No description available."}</CardDescription>
    </CardHeader>
    <CardContent>
      <Carousel className="w-full max-w-xs">
        <CarouselContent className="flex overflow-hidden">
              {post.images?.map((image, index) => (
                <CarouselItem key={index} className="flex-none">
                    <img
                      src={image}
                      alt={post.title}
                      style={{
                        width: "450px",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                </CarouselItem>
              ))}
            </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </CardContent>
  </Card>
  );
}

export default Post;
