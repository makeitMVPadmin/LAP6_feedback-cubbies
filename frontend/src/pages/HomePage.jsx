import PostModal from "../components/PostModal/PostModal";
import { Button } from "../components/ui/button";
import HomeFeed from "@/components/HomeFeed/HomeFeed";
import { useState } from "react";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page.</p>
      <div>
        <Button variant="default" onClick={() => setIsModalOpen(true)}>
          NEW
        </Button>
        <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
      <HomeFeed />
    </div>
  );
}
