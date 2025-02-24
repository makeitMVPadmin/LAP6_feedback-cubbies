import CreatePost from "../CreatePost/CreatePost.jsx";
import Portfolio from "../Portfolio/Portfolio.jsx";

function HomeFeed() {


function HomeFeed({ currentUser }) {
  return (
    <div className="grid grid-cols-1 gap-[3.13rem] justify-items-center">
      <CreatePost />
      <Portfolio />
    </div>
  );
}

export default HomeFeed;
