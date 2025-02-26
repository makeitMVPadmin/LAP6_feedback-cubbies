import CreatePost from "../components/CreatePost/CreatePost";
import PortfolioCard from "../components/PortfolioCard/PortfolioCard";
import { Card } from "../components/ui/index";
import {
  fetchPortfolio,
  fetchRoleById,
  fetchUserById,
} from "../firebase/functions/index";
import { useEffect, useState } from "react";

function HomePage() {
  const [portfolios, setPortfolios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const portfolioData = await fetchPortfolio();
        console.log("Fetched portfolios:", portfolioData);
        setPortfolios(portfolioData);

        const usersData = {};
        const rolesData = {};
        for (const portfolio of portfolioData) {
          if (portfolio.userId) {
            if (!usersData[portfolio.userId]) {
              const userData = await fetchUserById(portfolio.userId);
              if (userData) {
                usersData[portfolio.userId] = userData;
                if (userData.roleId && !rolesData[userData.roleId]) {
                  const roleData = await fetchRoleById(userData.roleId);
                  if (roleData) {
                    rolesData[userData.roleId] = roleData;
                  }
                }
              }
            }
          } else {
            console.log(`No userId for portfolio with id: ${portfolio.id}`);
          }
        }

        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);


  return (
    <div className="grid grid-cols-1 gap-[3.13rem] justify-items-center">
      <CreatePost />
      <div className="flex flex-col items-center justify-center h-auto text-center gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : portfolios.length > 0 ? (
          <Card className="flex flex-col gap-6 items-center">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                user={users[portfolio.userId]}
                role={roles[portfolio.userId?.roleId]}
              />
            ))}
          </Card>
        ) : (
          <p>No portfolios available.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
