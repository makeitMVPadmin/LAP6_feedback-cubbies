// import { fetchRoles, fetchRoleById } from '../../firebase/functions/index.js';
import CreatePost from "../CreatePost/CreatePost.jsx";
import PortfolioList from "../PortfolioList/PortfolioList.jsx";

function HomeFeed({ currentUser }) {
  return (
    <div className="grid grid-cols-1 gap-[3.13rem] justify-items-center">
      <CreatePost />
      <PortfolioList />
    </div>
  );
}

export default HomeFeed;
