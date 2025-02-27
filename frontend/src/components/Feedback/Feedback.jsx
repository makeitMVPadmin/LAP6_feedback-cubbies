import avatar from "../../assets/avatar.svg";
import sendIcon from "../../assets/send.svg";
import {
  getPortfolioFeedback,
  createFeedback,
} from "../../firebase/functions/feedbackFunctions";
import { useState, useEffect} from "react";
import { useUser } from "../../context/UserContext";

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
    <div>
      <section className="grid grid-cols-1 gap-[3.13rem] justify-items-center">
        <div className="flex flex-col items-start gap-[1.5rem] p-[1.5rem] w-[47.125rem] rounded-lg border-t border-r-2 border-b-2 border-l border-gray-600">
          {feedbackList.length === 0 ? (
            <p>There are no comments yet.</p>
          ) : (
            feedbackList.map((feedback) => (
              <div
                key={feedback.id}
                className="inline-flex items-start gap-[0.25rem] px-[0.75rem] self-stretch"
              >
                <div>
                  <img src={avatar} alt="user avatar" />
                  {/* <img src={feedback.profilePhoto || avatar} alt="user avatar" /> */}
                </div>
                <div>
                  <p className="font-bold">@{feedback.username}</p>
                  <p>{feedback.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="w-[47.125rem]">
          <div className="flex items-center gap-[0.625rem] w-[36.875rem] h-[2.5rem] px-[1px] rounded-lg border-t border-r-2 border-b-2 border-l border-gray-600 bg-white">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add comment..."
              className="flex-grow p-0 outline-none bg-transparent"
            />
            <button onClick={handleCreateFeedback}>
              <img src={sendIcon} className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
