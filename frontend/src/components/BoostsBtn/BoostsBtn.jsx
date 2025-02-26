import React, { useState, useEffect, useContext } from "react";
import {
  addBoost,
  removeBoost,
  checkIfBoosted,
  fetchUserBoosts,
} from "../../firebase/functions/boostFunctionality";
import { Button } from "../ui";
import { UserContext } from "../../context/UserContext";
import { Zap } from "lucide-react";

const BoostButton = ({ portfolioId }) => {
  const { currentUser } = useContext(UserContext); 
  const userId = currentUser?.id; 
  const [isBoosted, setIsBoosted] = useState(false);
  const [boostCount, setBoostCount] = useState(0);

  const handleBoostClick = async () => {
    if (!portfolioId) {
      console.error("[BoostButton] Missing portfolioId.");
      return;
    }
    if (!userId) {
      console.error("[BoostButton] No logged-in user.");
      return;
    }

    try {
      if (isBoosted) {
        console.log("[BoostButton] Removing boost...");
        await removeBoost(portfolioId, userId);
        setIsBoosted(false);
      } else {
        console.log("[BoostButton] Adding boost...");
        await addBoost(portfolioId, userId);
        setIsBoosted(true);
      }

      const updatedCount = await fetchUserBoosts(portfolioId);
      setBoostCount(updatedCount);
    } catch (error) {
      console.error("[BoostButton] Error updating boost:", error);
    }
  };

  useEffect(() => {
    if (!portfolioId) {
      console.error("[BoostButton] portfolioId is missing.");
      return;
    }

    const fetchBoostData = async () => {
      try {
        console.log("[BoostButton] Fetching boost count...");
        const count = await fetchUserBoosts(portfolioId);
        setBoostCount(count);

        if (userId) {
          console.log("[BoostButton] Checking if user has boosted...");
          const existingBoost = await checkIfBoosted(portfolioId, userId);
          setIsBoosted(!!existingBoost);
        }
      } catch (error) {
        console.error("[BoostButton] Error fetching boost data:", error);
      }
    };

    fetchBoostData();
  }, [portfolioId, userId]);

  return (
    <Button
      onClick={handleBoostClick}
      className="h-[45.85px] px-[13.75px] py-[18.34px] bg-[#ffd22f] rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7 hover:bg-[#e6b800]"
    >
      <Zap size={30} />
      {isBoosted ? `${boostCount} Boosts` : "Boosts"}
    </Button>
  );
};

export default BoostButton;
