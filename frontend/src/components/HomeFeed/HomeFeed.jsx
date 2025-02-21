import Post from '../Post/Post.jsx';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import React from 'react';

// loop through the posted portfolios
function HomeFeed() {

  return (
    <section className="grid grid-cols-1 gap-[3.13rem] justify-items-center">
      <Card className="w-[29.4375rem] p-[0.5rem] border-y-1 border-x-2 rounded-[5px] #28363F gap-[o.625rem]">
        <div className="w-[25.93575rem] p-x-[0.5rem] flex flex-row justify-center">
          <Button className="bg-[#0099ff] h-[3rem] ">Start Creating A Post</Button>
        </div>
      </Card>
      {/* {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))} */}
    </section>
  );
}

export default HomeFeed;
