import React, { useState, useEffect } from 'react';
import { addBoost, removeBoost, checkIfBoosted, fetchUserBoosts } from '../../firebase/functions/boostFunctionality';
import { Button } from '../ui';
import { Zap } from 'lucide-react';

const BoostButton = ({ portfolioId }) => {
  const [isBoosted, setIsBoosted] = useState(false);
  const [boostCount, setBoostCount] = useState(0);

  const handleBoostClick = async () => {
    if (!portfolioId) {
      console.error("Missing portfolioId.");
      return;
    }

    if (isBoosted) {
      await removeBoost(portfolioId);
      setIsBoosted(false);
    } else {
      await addBoost(portfolioId);
      setIsBoosted(true);
    }

    // Fetch updated boost count after boosting/removing
    const updatedCount = await fetchUserBoosts(portfolioId);
    setBoostCount(updatedCount);
  };

  useEffect(() => {
    if (!portfolioId) {
      console.error("portfolioId is missing.");
      return;
    }

    // Reset state on portfolioId change (when switching users)
    const resetState = () => {
      setIsBoosted(false);
      setBoostCount(0);
    };

    // Fetch boost data when portfolioId changes
    const fetchBoostData = async () => {
      try {
        const count = await fetchUserBoosts(portfolioId);
        setBoostCount(count);

        const existingBoost = await checkIfBoosted(portfolioId);
        setIsBoosted(!!existingBoost);
      } catch (error) {
        console.error("Error fetching boost data:", error);
      }
    };

    resetState();
    fetchBoostData();
    
  }, [portfolioId]);

  return (
    <Button
      onClick={handleBoostClick}
      className="h-[45.85px] px-[13.75px] py-[18.34px] bg-[#ffd22f] rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7 hover:bg-[#e6b800]">
      <Zap size={30} />
      {isBoosted ? `${boostCount} Boosts` : "Boosts"}
    </Button>
  );
};

export default BoostButton;
