import PortfolioPage from "../components/Portfolio/Portfolio";
import HomeFeed from "@/components/HomeFeed/HomeFeed";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page.</p>
      <HomeFeed />
      <PortfolioPage />
    </div>
  );
}
