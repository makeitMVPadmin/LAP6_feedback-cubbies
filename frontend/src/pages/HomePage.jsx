import CreatePost from "../components/CreatePost/CreatePost";
import FilterTags from "../components/FilterTags";
import PortfolioCard from "../components/PortfolioCard/PortfolioCard";
import { Card, Avatar } from "../components/ui/index";
import {
  fetchPortfolio,
  fetchRoleById,
  fetchUserById,
  fetchTagsById,
} from "../firebase/functions/index";
import { useEffect, useState } from "react";

function HomePage() {
  const [portfolios, setPortfolios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const portfolioData = await fetchPortfolio();
        console.log("Fetched portfolios:", portfolioData);
        setPortfolios(portfolioData);
  
        const usersData = {};
        const rolesData = {};
        const tagsData = {};

        for (const portfolio of portfolioData) {

          if (portfolio.userId && !usersData[portfolio.userId]) {
            const userData = await fetchUserById(portfolio.userId);
            usersData[portfolio.userId] = userData;
  
            if (userData.roleId && !rolesData[userData.roleId]) {
              const roleData = await fetchRoleById(userData.roleId);
              if (roleData) {
                rolesData[userData.roleId] = roleData;
              }
            }
          }
  
          if (portfolio.tagId) {
            const tagIds = Array.isArray(portfolio.tagId) ? portfolio.tagId : [portfolio.tagId];
            
            if (!tagsData[portfolio.id]) {
              tagsData[portfolio.id] = [];
            }
  
            for (const tagId of tagIds) {
              const tagData = await fetchTagsById(tagId);
              if (tagData) {
                tagsData[portfolio.id].push(tagData.tagName);
              }
            }
          }
        }

        setUsers(usersData);
        setRoles(rolesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching portfolios or associated data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getData();
  }, []);
  

  console.log("tags data", tags);

  // Sort portfolios by updatedAt field in descending order
  // const sortedPortfolios = portfolios.sort((a, b) => b.updatedAt.seconds - a.updatedAt.seconds);

  // // Filter portfolios based on selected tag
  // const filteredPortfolios = selectedTag
  //   ? sortedPortfolios.filter(portfolio => portfolio.tagId === selectedTag)
  //   : sortedPortfolios;

  return (
    <section className="grid grid-cols-1 min-h-screen gap-[3.13rem] justify-items-center">
      <div className="flex w-[55.125rem] justify-start">
        <Card className="h-24 p-8 bg-blue-200 rounded-lg border-l border-r-2 border-t border-b-2 border-[#28363f] justify-start items-center gap-6 inline-flex ">
          <Avatar className="w-12 h-12" />
          <CreatePost />
          {/* <FilterTags
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            tags={tags}
          /> */}
        </Card>
      </div>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : portfolios.length > 0 ? (
          <Card className="w-[882px] grid grid-cols-1 justify-items-center h-auto text-center gap-6 bg-blue-200 p-16">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                user={users[portfolio.userId]}
                role={roles[portfolio.userId?.roleId]}
                tags={tags[portfolio.id] || []}
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
