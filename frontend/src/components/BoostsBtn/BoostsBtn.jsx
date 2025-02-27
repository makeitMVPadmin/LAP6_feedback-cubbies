import React, { useState, useEffect } from "react";
import {
  addBoost,
  removeBoost,
  checkIfBoosted,
  fetchBoostCount,
} from "../../firebase/functions/boostFunctionality";
import { Button } from "../ui";
import { useUser } from "../../context/UserContext";
import { Zap } from "lucide-react";

const BoostButton = ({ portfolioId }) => {
  const { currentUser } = useUser();

  const [isBoosted, setIsBoosted] = useState(false);
  const [boostCount, setBoostCount] = useState(0);

  const handleBoostClick = async (e) => {
    e.preventDefault();
  
    const userId = currentUser?.id;
  
    if (!userId) {
      console.error("[BoostButton] No user ID found");
      return;
    }
  
    try {
      if (isBoosted) {
        await removeBoost(portfolioId, userId);
        setIsBoosted(false);
      } else {
        await addBoost(portfolioId, userId);
        setIsBoosted(true);
      }

      const updatedCount = await fetchBoostCount(portfolioId); 
      setBoostCount(updatedCount);
    } catch (error) {
      console.error("[BoostButton] Error updating boost:", error);
    }
  };

  useEffect(() => {
    if (!portfolioId || !currentUser) return;

    const fetchBoostData = async () => {
      try {
        const count = await fetchBoostCount(portfolioId); 
        setBoostCount(count);

        const userId = currentUser?.id;
        if (userId) {
          const existingBoost = await checkIfBoosted(portfolioId, userId);
          setIsBoosted(!!existingBoost);
        }
      } catch (error) {
        console.error("[BoostButton] Error fetching boost data:", error);
      }
    };

    fetchBoostData();
  }, [portfolioId, currentUser]);

  return (
    <Button
      onClick={handleBoostClick}
      className="h-[45.85px] px-[13.75px] py-[18.34px] bg-[#ffd22f] rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7 hover:bg-[#e6b800]"
    >
      <Zap size={30} />
      <span>{boostCount} Boost{boostCount !== 1 ? "s" : ""}</span>
    </Button>
  );
};

export default BoostButton;
