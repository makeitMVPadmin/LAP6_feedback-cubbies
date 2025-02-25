import {
  addBoost,
  removeBoost,
  updatedBoostCount,
} from "../../firebase/functions/boostFunctionality";
import {
  fetchPortfolio,
  fetchRoleById,
  fetchUserById,
} from "../../firebase/functions/index";
import { Button, Card, Avatar } from "../ui/index";
import { Zap } from "lucide-react";
import React, { useEffect, useState } from "react";

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState();
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
        console.error("Error fetching data:", error);
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
      const portfolioItem = portfolios.find((p) => p.id === portfolioId);
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

      setPortfolios([...updatedPortfolios]); // update portfolio state
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error handling boost click:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto text-center gap-6">
      {loading ? (
        <p>Loading...</p>
      ) : portfolios.length > 0 ? (
        <Card className="flex flex-col gap-6 items-center">
          {portfolios.map((portfolio, id) => (
            <Card
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
                    <div className="text-slate-950 text-xl font-bold font-[Corben] leading-7">
                      {users[portfolio.userId]?.firstName}
                      {users[portfolio.userId]?.lastName}
                    </div>
                    <div className="text-slate-500 font-header font-bold font-[Corben] leading-tight">
                      {users[portfolio.userId]?.email}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    <div className="text-slate-500 font-h2 font-bold font-[corben] leading-none">
                      {roles[users[portfolio.userId]?.roleId]?.roleName}
                    </div>
                    <div className="text-slate-500 font-header font-bold font-[corben] leading-none">
                      1 day ago
                    </div>
                  </div>
                </div>
              </div>

              <h2>{portfolio.title}</h2>
              <p>{portfolio.userId}</p>

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
                  <Button
                    onClick={() => handleBoostClick(portfolio.id)}
                    className="h-[45.85px] px-[13.75px] py-[18.34px] bg-[#ffd22f] rounded-xl shadow-md flex 
                    justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7"
                  >
                    <Zap size={20} />
                    {portfolio.boostCount} Boosts
                  </Button>
                  <Button className="h-[45.85px] px-[13.75px] py-[18.34px] bg-white rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7">
                    Comments
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </Card>
      ) : (
        <p>No portfolios available.</p>
      )}
    </div>
  );
};

export default Portfolio;
