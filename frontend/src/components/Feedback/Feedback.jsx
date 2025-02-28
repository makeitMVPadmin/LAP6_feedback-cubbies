import avatar from "../../assets/avatar.svg";
import sendIcon from "../../assets/send.svg";
import { useUser } from "../../context/UserContext";
import {
  getPortfolioFeedback,
  createFeedback,
} from "../../firebase/functions/feedbackFunctions";
import { useState, useEffect } from "react";

const Feedback = ({ portfolioId }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useUser();

  const retrivePortfolioFeedback = async () => {
    const feedback = await getPortfolioFeedback(portfolioId);
    setFeedbackList(feedback);
  };

  const handleCreateFeedback = async () => {
    const userId = currentUser?.id;
    const username = currentUser?.username;
    const docRef = await createFeedback(portfolioId, userId, newComment);
    setFeedbackList((prevFeedbackList) => [
      ...prevFeedbackList,
      {
        id: docRef.id,
        comment: newComment,
        portfolioId,
        username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  };

  useEffect(() => {
    retrivePortfolioFeedback();
  }, [portfolioId]);

  return (
    <div className="w-full max-w-[754px] mx-auto">
      <div className="pt-6 px-6 mt-[64px] bg-white rounded-lg border border-[#28363f] flex flex-col justify-start items-start overflow-hidden">
        {feedbackList.length === 0 ? (
          <p className="text-black text-sm font-['Montserrat'] font-normal leading-[20px] custom-font-settings mb-6">
            There are no comments yet.
          </p>
        ) : (
          feedbackList.map((feedback) => (
            <div
              key={feedback.id}
              className="flex items-start px-3 mb-6 self-stretch"
            >
              <div className="pr-4">
                <img src={avatar} alt="user avatar" className="w-9 h-9" />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-black text-sm font-['Montserrat'] font-semibold leading-[20px] custom-font-settings">
                  @{feedback.username}
                </p>
                <p className="text-black text-sm font-['Montserrat'] font-normal leading-[20px] custom-font-settings">
                  {feedback.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full pt-[64px]">
        <div className="flex w-full max-w-[590px] h-[40px] items-center gap-[10px] bg-white rounded-lg border border-[#28363f]">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add comment..."
            className="w-full h-full px-3 py-1 text-sm font-['Montserrat'] font-normal leading-[20px] placeholder:text-[#80909A] placeholder:font-['Montserrat'] placeholder:text-sm placeholder:font-normal placeholder:leading-[20px] focus:outline-none"
          />
          <button onClick={handleCreateFeedback} className="pr-3">
            <img src={sendIcon} className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
