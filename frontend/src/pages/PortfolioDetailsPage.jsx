import PortfolioCard from "../components/PortfolioCard/PortfolioCard";
import { useNavigation } from "../context/NavigationContext";
import { getPortfolioById } from "../firebase/functions/portfolios";
import Feedback from "@/components/Feedback/Feedback";
import { useState, useEffect } from "react";

function PortfolioDetailsPage() {
  const { portfolioId } = useNavigation();
  const [selectedPortfolio, setSelectedPortfolio] = useState({});
  const [loading, setLoading] = useState(true);

  const retrivePortfoliobyId = async () => {
    try {
      const portfolio = await getPortfolioById(portfolioId);
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

  const renderMessage = loading ? "Loading..." : !selectedPortfolio ? "No portfolio found!" : null;

  return renderMessage ? (
    <div className="flex items-center justify-center min-h-screen">
      <div>{renderMessage}</div>
    </div>
  ) : (
    <section className="grid grid-cols-1 min-h-screen mt-[64px] pb-[64px] justify-items-center">
      <div className="w-[882px] h-auto flex flex-col justify-center items-center text-center bg-blue-200 p-16 rounded-lg shadow-md">
        <PortfolioCard
          portfolio={selectedPortfolio.portfolio}
          user={selectedPortfolio.user}
          role={selectedPortfolio.role}
          tags={selectedPortfolio.tags}
        />
        <Feedback portfolioId={portfolioId} />
      </div>
    </section>
  );
};

export default PortfolioDetailsPage;
