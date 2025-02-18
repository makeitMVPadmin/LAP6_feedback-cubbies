import addPortfolio from "../../firebase/functions/addPortfolio";
import deletePortfolio from "../../firebase/functions/deletePortfolio";
import fetchPortfolio from "../../firebase/functions/fetchPortfolio";
import updatePortfolio from "../../firebase/functions/updatePortfolio";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    userId: "",
    description: "",
    imageUrl: "",
    link: "",
  });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchPortfolio();
      setPortfolios(data);
      if (data.length > 0) {
        setPortfolio(data[0]);
      }
      setLoading(false);
    };
    getData();
  }, []);

  const handleNextPortfolio = () => {
    if (portfolios.length > 0) {
      const nextIndex = (currentIndex + 1) % portfolios.length;
      setCurrentIndex(nextIndex);
      setPortfolio(portfolios[nextIndex]);
    }
  };

  const handlePrevPortfolio = () => {
    if (portfolios.length > 0) {
      const prevIndex =
        (currentIndex - 1 + portfolios.length) % portfolios.length;
      setCurrentIndex(prevIndex);
      setPortfolio(portfolios[prevIndex]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPortfolio(newPortfolio);
    const updatedData = await fetchPortfolio();
    setPortfolios(updatedData);
    setPortfolio(updatedData[updatedData.length - 1] || null);
    setNewPortfolio({
      title: "",
      userId: "",
      description: "",
      imageUrl: "",
      link: "",
    });
    setShowModal(false);
  };

  return (
    <div>
      <h2>Portfolio</h2>
      {loading ? (
        <p>Loading...</p>
      ) : portfolio ? (
        <div>
          <h2>{portfolio.title}</h2>
          <p>{portfolio.userId}</p>
          <p>{portfolio.description}</p>
          {portfolio.imageUrl && (
            <img src={portfolio.imageUrl} alt={portfolio.title} width="200" />
          )}
          {portfolio.link && (
            <Button
              as="a"
              href={portfolio.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Portfolio
            </Button>
          )}
          <Button onClick={handlePrevPortfolio}>Previous Portfolio</Button>
          <Button onClick={handleNextPortfolio}>Next Portfolio</Button>
          <Button onClick={() => setShowModal(true)}>Add New Portfolio</Button>
        </div>
      ) : (
        <p>No portfolio available.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Add New Portfolio</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newPortfolio.title}
                onChange={(e) =>
                  setNewPortfolio({ ...newPortfolio, title: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newPortfolio.description}
                onChange={(e) =>
                  setNewPortfolio({
                    ...newPortfolio,
                    description: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={newPortfolio.imageUrl}
                onChange={(e) =>
                  setNewPortfolio({ ...newPortfolio, imageUrl: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                name="link"
                placeholder="Portfolio Link"
                value={newPortfolio.link}
                onChange={(e) =>
                  setNewPortfolio({ ...newPortfolio, link: e.target.value })
                }
                className="border p-2 w-full mb-4"
              />
              <div className="flex justify-between">
                <Button type="submit">Submit</Button>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
