import PortfolioCard from "../components/PortfolioCard/PortfolioCard";
import { useNavigation } from "../context/NavigationContext";
import { getPortfolioById } from "../firebase/functions/portfolios";
import Feedback from "@/components/Feedback/Feedback";
import { useState, useEffect } from "react";

function PortfolioDetailsPage() {
  const { portfolioId, goToHome } = useNavigation();
  const [selectedPortfolio, setSelectedPortfolio] = useState({});
  const [loading, setLoading] = useState(true);

  const retrivePortfoliobyId = async () => {
    try {
      const portfolio = await getPortfolioById(portfolioId);
      console.log("portfolio data", portfolio);
      setSelectedPortfolio(portfolio);
    } catch (error) {
      console.error("Error retrieving portfolio:", error);
      setSelectedPortfolio(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrivePortfoliobyId(portfolioId);
  }, [portfolioId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selectedPortfolio) {
    return <div>No portfolio found!</div>;
  }

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
      <div className="flex flex-col items-center justify-center h-auto text-center gap-6">
        <PortfolioCard
          portfolio={selectedPortfolio.portfolio}
          user={selectedPortfolio.user}
          role={selectedPortfolio.role}
        />
        <Feedback portfolioId={portfolioId} />
      </div>
    </div>
  );
}

export default PortfolioDetailsPage;
