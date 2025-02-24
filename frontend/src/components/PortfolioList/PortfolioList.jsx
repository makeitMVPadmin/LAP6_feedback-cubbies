import {
  fetchPortfolio, addPortfolio, updatePortfolio, deletePortfolio,fetchRoleById,
  fetchUserById,
} from '../../firebase/functions/index';
import { Button, Card, Avatar } from '../ui/index';
import React, { useEffect, useState } from 'react';
import PortfolioCard from '../PortfolioCard/PortfolioCard';

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
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
        setPortfolios(portfolioData);

        // Fetch user and role data for each portfolio
        const usersData = {};
        const rolesData = {};
        for (const portfolio of portfolioData) {
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
              handleEdit={handleEdit} 
              handleDelete={handleDelete} 
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

export default PortfolioList;
