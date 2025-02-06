import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// rendering a single posted portfolio
function Post({ post }) {
  return (
    <Card>
    <CardHeader>
      <CardTitle>{post.username}</CardTitle>
      <CardTitle>{post.title}</CardTitle>
      <CardDescription>{post.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {/* Loop through the images array from the mock data */}
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <img
                      src={image}
                      alt={post.title}
                      style={{
                        width: "350px",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
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
