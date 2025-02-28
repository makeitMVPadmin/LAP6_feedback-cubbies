import CreatePost from '../components/CreatePost/CreatePost';
import PortfolioCard from '../components/PortfolioCard/PortfolioCard';
import FilterTags from '../components/FilterTags';
import { Card, Avatar } from '../components/ui/index';
import {
  fetchPortfolio,
  fetchRoleById,
  fetchUserById,
} from '../firebase/functions/index';
import { useEffect, useState } from 'react';

function HomePage() {
  const [portfolios, setPortfolios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);


  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const portfolioData = await fetchPortfolio();
        console.log('Fetched portfolios:', portfolioData);
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
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Sort portfolios by updatedAt field in descending order
  const sortedPortfolios = portfolios.sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <section className="grid grid-cols-1 min-h-screen gap-[3.13rem] justify-items-center">
      <div className="flex w-[55.125rem] justify-start">
        <Card className="h-24 p-8 bg-blue-200 rounded-lg border-l border-r-2 border-t border-b-2 border-[#28363f] justify-start items-center gap-6 inline-flex ">
          <Avatar className="w-12 h-12" />
          <CreatePost />
          <FilterTags selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
        </Card>
      </div>

      <div >
        {loading ? (
          <p>Loading...</p>
        ) : sortedPortfolios.length > 0 ? (
          <Card className=" w-[882px] grid grid-cols-1 justify-items-center h-auto text-center gap-6 bg-blue-200 p-16">
            {sortedPortfolios.map((portfolio) => (
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
    </section>
  );
}

export default HomePage;
