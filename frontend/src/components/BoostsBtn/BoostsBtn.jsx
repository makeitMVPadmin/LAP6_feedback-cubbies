import React, { useState, useEffect } from 'react';
import { addBoost, removeBoost, checkIfBoosted, fetchUserBoosts } from '../../firebase/functions/boostFunctionality';
import { Button } from '../ui';
import { Zap } from 'lucide-react';

const BoostButton = ({ currentUser, portfolioId }) => {
  const [isBoosted, setIsBoosted] = useState(false);
  const [boostCount, setBoostCount] = useState(0);
k
  const handleBoostClick = async () => {
    if (!currentUser || !portfolioId) {
      console.error("Invalid user or portfolio data.");
      return;
    }

    const userId = currentUser.id || currentUser.uid;
    console.log("User ID:", userId);
    console.log("Portfolio ID:", portfolioId);

    const existingBoost = await checkIfBoosted(portfolioId, userId);

    if (existingBoost) {
      await removeBoost(existingBoost);
      setIsBoosted(false);
    } else {
      await addBoost(portfolioId, userId);
      setIsBoosted(true);
    }

    const updatedCount = await fetchUserBoosts(portfolioId);
    setBoostCount(updatedCount);
  };

  useEffect(() => {
    if (!currentUser || !portfolioId) {
      console.error("User or portfolio data is missing.");
      return;
    }

    const userId = currentUser.id || currentUser.uid;
    console.log("Fetching boost data for user:", userId);

    const fetchBoostData = async () => {
      try {
        const boostId = await checkIfBoosted(portfolioId, userId);
        setIsBoosted(!!boostId);

        const count = await fetchBoostData(portfolioId);
        setBoostCount(count);
      } catch (error) {
        console.error("Error fetching boost data:", error);
      }
    };

    fetchBoostData();
  }, [currentUser, portfolioId]); 

  return (
    <Button
      onClick={handleBoostClick}
      className="h-[45.85px] px-[13.75px] py-[18.34px] bg-[#ffd22f] rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7">
      <Zap size={30} />
      {boostCount} Boosts
    </Button>
  );
};

export default BoostButton;
