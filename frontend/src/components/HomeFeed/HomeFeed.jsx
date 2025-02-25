import React, { useEffect, useState } from 'react';
import CreatePost from "../CreatePost/CreatePost.jsx";
import Portfolio from "../Portfolio/Portfolio.jsx";
import FilterTags from '../FilterTags';
import { Card, Avatar } from '../ui';
import { fetchPortfolio, fetchRoleById, fetchUserById, fetchAllTags, fetchTagsById } from '../../firebase/functions/index';


function HomeFeed({ currentUser }) {
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

        const tagsData = await fetchAllTags();
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const filteredPortfolios = selectedTag
    ? portfolios.filter(portfolio => portfolio.tagId === selectedTag)
    : portfolios;

  return (
    <section className="grid grid-cols-1 gap-[3.13rem] justify-items-center overflow-hidden">
      <div className="flex w-[47.125rem] justify-start">
        <Card className="h-24 p-6 rounded-lg border-l border-r-2 border-t border-b-2 border-[#28363f] justify-start items-start gap-6 inline-flex">
          <Avatar className="w-12 h-12" />
          <CreatePost />
          <FilterTags selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
        </Card>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Portfolio portfolios={filteredPortfolios} users={users} roles={roles} />
      )}
    </section>
  );
}

export default HomeFeed;
