import PostModal from "../components/PostModal/PostModal";
import { Button } from "../components/ui/button";
import HomeFeed from "@/components/HomeFeed/HomeFeed";
import { useState } from "react";

export default function HomePage({ currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page.</p> */}
      <HomeFeed currentUser={currentUser}/>
    </div>
  );
}
