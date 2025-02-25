import React, { useEffect, useState } from 'react';
import CreatePost from "../CreatePost/CreatePost.jsx";
import Portfolio from "../Portfolio/Portfolio.jsx";
import { fetchPortfolio, fetchRoleById, fetchUserById } from '../../firebase/functions/index';

function HomeFeed({ currentUser }) {
  const [portfolios, setPortfolios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="grid grid-cols-1 gap-[3.13rem] justify-items-center">
      <CreatePost />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Portfolio portfolios={portfolios} users={users} roles={roles} />
      )}
    </div>
  );
}

export default HomeFeed;
