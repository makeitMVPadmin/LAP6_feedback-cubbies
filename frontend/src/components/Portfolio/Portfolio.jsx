import fetchPortfolio from "../firebase/functions/fetchPortfolio";
import React, { useEffect, useState } from "react";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchPortfolio();
      setPortfolio(data);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>My Portfolio</h1>
      <ul>
        {portfolio.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.userId}</p>
            <p>{item.description}</p>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} width="200" />
            )}
            <p>{item.link}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioPage;
