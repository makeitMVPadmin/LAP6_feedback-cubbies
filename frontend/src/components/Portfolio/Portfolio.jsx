import addPortfolio from "../../firebase/functions/addPortfolio";
import deletePortfolio from "../../firebase/functions/deletePortfolio";
import fetchPortfolio from "../../firebase/functions/fetchPortfolio";
import updatePortfolio from "../../firebase/functions/updatePortfolio";
import Avatar from '../ui/avatar';

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([fetchPortfolio()]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [portfolioData, setPortfolioData] = useState({
    title: "",
    userId: "",
    tagId: "",
    description: "",
    imageUrl: "",
    link: "",
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchPortfolio();
      setPortfolios(data);
      setLoading(false);
    };
    getData();
  }, []);
  
  console.log(fetchPortfolio());

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
      title: portfolio.title || "",
      userId: portfolio.userId || "",
      description: portfolio.description || "",
      imageUrl: portfolio.imageUrl || "",
      link: portfolio.link || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    console.log("Deleting Portfolio ID:", id);
    if (!id) {
      console.error("No ID found, delete failed.");
      return;
    }
    await deletePortfolio(id);
    setPortfolios((prev) => prev.filter((portfolio) => portfolio.id !== id));
  };

  const resetForm = () => {
    setPortfolioData({
      title: "",
      userId: "",
      description: "",
      imageUrl: "",
      link: "",
    });
    setEditingPortfolio(null);
    setShowModal(false);
  };
  return (
    <div className="flex flex-col items-center justify-center h-auto text-center gap-6">
      {loading ? (
        <p>Loading...</p>
      ) : portfolios.length > 0 ? (
        <div className="flex flex-col gap-6 items-center">
          {portfolios.map((portfolio, id) => (
            <div
              key={id}
              className="w-[754px] h-[537px] flex-shrink-0 rounded-lg border border-gray-700 border-t border-l border-r-2 border-b-2 p-6 shadow-md flex flex-col gap-6"
            >
              <div className="h-6 px-2.5 w-15 py-1 bg-[#ebebeb] rounded-lg justify-center items-center gap-0.5 inline-flex">
                <div className="text-slate-900 text-sm font-semibold font-['Inter'] leading-none">
                  New
                </div>
              </div>
              <div className="w-[342px] h-[60px] flex items-center gap-2">
                <div className="w-9 h-9 flex justify-center items-center">
                  <Avatar className="w-12 h-12" />
                </div>

                <div className="flex flex-col w-[298px]">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-950 text-xl font-semibold font-['Montserrat'] leading-7">
                      Jackson Lee
                    </div>
                    <div className="text-slate-500 text-base font-bold font-['Montserrat'] leading-tight">
                      @jacksonlee487
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    <div className="text-slate-500 text-xs font-bold font-['Montserrat'] leading-none">
                      New Grad
                    </div>
                    <div className="text-slate-500 text-xs font-bold font-['Montserrat'] leading-none">
                      1 day ago
                    </div>
                  </div>
                </div>
              </div>

              {/* ..........Portfolio title and Id................................  */}
              <h2>{portfolio.title}</h2>
              {/* <p>{portfolio.userId}</p> */}

              <div className="text-black text-xl font-bold font-['Montserrat'] leading-loose text-left w-[570px] ml-[70px]">
                <p>{portfolio.description}</p>
              </div>
              {portfolio.imageUrl && (
                <div className="flex justify-center items-center w-full">
                  <div className="w-[570px] h-[188px] flex-shrink-0 rounded-lg overflow-hidden border border-gray-300 shadow-lg">
                    <img
                      className="w-full h-full object-cover"
                      src={portfolio.imageUrl}
                      alt={portfolio.title}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-6 mt-6 w-full items-start ml-[70px]">
                <div className="flex flex-wrap gap-2 border border-gray-300 rounded-lg">
                  <div className="w-[97px] h-[35px] px-6 py-2 bg-[#ebebeb] rounded-[9px] justify-center items-center gap-6 inline-flex">
                    <div className="text-black/70 text-lg font-semibold font-['Montserrat'] leading-relaxed">
                      Python
                    </div>
                  </div>
                  <div className="w-[105px] h-[35px] px-6 py-2 bg-[#ebebeb] rounded-[9px] justify-center items-center gap-6 inline-flex">
                    <div className="text-black/70 text-lg font-semibold font-['Montserrat'] leading-relaxed">
                      Coding{" "}
                    </div>
                  </div>
                  <div className="w-[72px] h-[35px] px-6 py-2 bg-[#ebebeb] rounded-[9px] justify-center items-center gap-6 inline-flex">
                    <div className="text-black/70 text-lg font-semibold font-['Montserrat'] leading-relaxed">
                      UX
                    </div>
                  </div>
                  <div data-svg-wrapper className="relative">
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.0001 5.30078L12 19.7008M19.2 12.5008L4.80005 12.5008"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 border border-gray-300 rounded-lg ">
                  <Button className="h-[45.85px] pl-[13.75px] pr-[18.34px] bg-[#0264d4] rounded-xl justify-center items-center gap-[9.17px] inline-flex">
                    <div className="w-[27.51px] h-[27.51px] bg-[#d9d9d9]"></div>

                    <a
                      href={portfolio.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 block"
                    >
                      <div className="text-center text-white text-lg font-medium font-['Montserrat'] leading-7">
                        Review Portfolio
                      </div>
                    </a>
                  </Button>
                  <Button className="h-[45.85px] px-[13.75px] py-[18.34px] bg-[#ffd22f] rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7">
                    Boosts
                  </Button>

                  <Button className="h-[45.85px] px-[13.75px] py-[18.34px] bg-white rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7">
                    Comments
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleEdit(portfolio)}
                      className="bg-blue-500 text-white"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(portfolio.id)}
                      className="bg-red-500 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No portfolios available.</p>
      )}

      {/* .......... Add/Edit Portfolio...................... */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-6">
              {editingPortfolio ? "Edit Portfolio" : "Add New Portfolio"}
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
                  {editingPortfolio ? "Update" : "Submit"}
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

export default PortfolioPage;
