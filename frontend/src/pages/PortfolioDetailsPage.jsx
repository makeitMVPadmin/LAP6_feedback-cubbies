import { useNavigation } from "../context/NavigationContext";
import Feedback from "@/components/Feedback/Feedback";

export default function PortfolioDetailsPage(userId) {
  const { portfolioId, goToHome } = useNavigation();

  return (
    <div>
      {/* Home Button */}
      <button
        onClick={goToHome}
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#007BFF",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Home
      </button>
      {/* PortfolioCard goes here */}
      <p>Portfolio ID: {portfolioId}</p>

      <Feedback portfolioId={portfolioId} />
    </div>
  );
}
