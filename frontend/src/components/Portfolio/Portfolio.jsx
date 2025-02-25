import {
  fetchPortfolio, addPortfolio, updatePortfolio, deletePortfolio,fetchRoleById,
  fetchUserById,
} from '../../firebase/functions/index';
import { addBoost, removeBoost, updatedBoostCount} from '../../firebase/functions/boostFunctionality';
import { Button, Card } from '../ui/index';
import React, { useEffect, useState } from 'react';

import PortfolioCard from '../PortfolioCard/PortfolioCard';

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    title: '',
    userId: '',
    tagId: '',
    description: '',
    imageUrl: '',
    link: '',
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const portfolioData = await fetchPortfolio();
        console.log('Fetched portfolios:', portfolioData);
        setPortfolios(portfolioData);

        // Fetch user and role data for each portfolio
        for (const portfolio of portfolioData) {
          // only fetch user data if userId is available (new posts should have userId)
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
            // handle the case for old posts without userId if needed
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


// boost logic
const handleBoostClick = async (portfolioId) => {
  try {
    // find the portfolio and get the current boost count (defaulting is 0)
    const portfolioItem = portfolios.find(p => p.id === portfolioId);
    const currentBoostCount = portfolioItem?.boostCount || 0; 

    const newBoostCount = currentBoostCount + 1;

    await addBoost(portfolioId); // directly increment the boost count

    // update Firestore with the new boost count
    await updatedBoostCount(portfolioId, newBoostCount);

    // update the UI state with the new boost count
    const updatedPortfolios = portfolios.map((item) => 
      item.id === portfolioId 
        ? { ...item, boostCount: newBoostCount, boosted: !item.boosted } 
        : item
    );

    setPortfolios([...updatedPortfolios]);  // update portfolio state
    setRefresh(prev => !prev);
  } catch (error) {
    console.error("Error handling boost click:", error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPortfolio) {
      await updatePortfolio(editingPortfolio.id, portfolioData);
      setPortfolios((prev) =>
        prev.map((item) =>
          item.id === editingPortfolio.id ? { ...item, ...portfolioData } : item
        )
      );
    } else {
      const newPortfolio = await addPortfolio(portfolioData);
      setPortfolios((prev) => [...prev, newPortfolio]);
    }
    resetForm();
  };

  const handleEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setPortfolioData({
      title: portfolio.title || '',
      userId: portfolio.userId || '',
      tagId: portfolio.tagId || '',
      description: portfolio.description || '',
      imageUrl: portfolio.imageUrl || '',
      link: portfolio.link || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    console.log('Deleting Portfolio ID:', id);
    if (!id) {
      console.error('No ID found, delete failed.');
      return;
    }
    await deletePortfolio(id);
    setPortfolios((prev) => prev.filter((portfolio) => portfolio.id !== id));
  };

  const resetForm = () => {
    setPortfolioData({
      title: '',
      userId: '',
      tagId: '',
      description: '',
      imageUrl: '',
      link: '',
    });
    setEditingPortfolio(null);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto text-center gap-6">
      {loading ? (
        <p>Loading...</p>
      ) : portfolios.length > 0 ? (
        <Card className="flex flex-col gap-6 items-center">
          {portfolios.map((portfolio, id) => (
            <PortfolioCard 
              key={id} 
              portfolio={portfolio} 
              user={users[portfolio.userId]} 
              role={roles[portfolio.userId?.roleId]?.roleName}
              handleBoostClick={handleBoostClick}
            />
          ))}
        </Card>
      ) : (
        <p>No portfolios available.</p>
      )}
    

      {/* .......... Add/Edit Portfolio...................... */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-6">
              {editingPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={portfolioData.title}
                onChange={(e) =>
                  setPortfolioData({ ...portfolioData, title: e.target.value })
                }
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="userId"
                placeholder="User ID"
                value={portfolioData.userId}
                onChange={(e) =>
                  setPortfolioData({ ...portfolioData, userId: e.target.value })
                }
                className="border p-2 w-full"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={portfolioData.description}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    description: e.target.value,
                  })
                }
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={portfolioData.imageUrl}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    imageUrl: e.target.value,
                  })
                }
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="link"
                placeholder="Portfolio Link"
                value={portfolioData.link}
                onChange={(e) =>
                  setPortfolioData({ ...portfolioData, link: e.target.value })
                }
                className="border p-2 w-full"
              />
              <div className="flex justify-between">
                <Button type="submit">
                  {editingPortfolio ? 'Update' : 'Submit'}
                </Button>
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
