import React, { useState, useEffect } from 'react';
import { addBoost, removeBoost, updatedBoostCount, checkIfBoosted } from '../../firebase/functions/boostFunctionality';
import { Button } from '../ui';
import { Zap } from 'lucide-react';

const BoostButton = ({ currentUser, portfolioId, portfolios, setPortfolios }) => {
  const [isBoosted, setIsBoosted] = useState(false);
  const [boostCount, setBoostCount] = useState(0);

  // Check if the current user has already boosted this portfolio
  const handleBoostClick = async (portfolioId) => {
    console.log("Current User:", currentUser);  // Log currentUser to see its value
  
    if (!currentUser || !currentUser.id) {
      console.error("User not logged in or invalid user data.");
      return; // Prevent any further action if currentUser is not valid
    }
  
    const boostId = await checkIfBoosted(portfolioId, currentUser.id);
  
    // Update portfolio data
    const updatedPortfolios = portfolios.map((item) => {
      if (item.id === portfolioId) {
        const updatedBoostCount = item.boosted ? item.boostCount - 1 : item.boostCount + 1;
        return { ...item, boosted: !item.boosted, boostCount: updatedBoostCount };
      }
      return item;
    });
  
    // Add or remove the boost
    if (boostId) {
      await removeBoost(boostId); // If boost exists, remove it
    } else {
      await addBoost(portfolioId, currentUser.id); // Else, add the boost
    }
  
    // Update portfolios state with the new boost count
    setPortfolios(updatedPortfolios);
  
    // Update the boost count in the backend
    updatedBoostCount(portfolioId, updatedPortfolios.find(p => p.id === portfolioId).boostCount);
  };
  

  // Fetch initial boost count and check if user has boosted
  useEffect(() => {
    const fetchBoostData = async () => {
      if (currentUser && currentUser.id) {
        const boostId = await checkIfBoosted(portfolioId, currentUser.id);
        setIsBoosted(!!boostId);
        const count = await getBoostCount(portfolioId);
        setBoostCount(count);
      }
    };
    fetchBoostData();
  }, [currentUser, portfolioId]);

  return (
    <Button
      onClick={() => handleBoostClick(portfolioId)}
      className="h-[45.85px] px-[13.75px] py-[18.34px] bg-[#ffd22f] rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7">
      <Zap size={30}/>
      {boostCount} Boosts
    </Button>
  );
};

export default BoostButton;
