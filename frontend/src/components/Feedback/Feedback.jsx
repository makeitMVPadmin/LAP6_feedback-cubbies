import avatar from "../../assets/avatar.svg";
import sendIcon from "../../assets/send.svg";
import {
  getPortfolioFeedback,
  createFeedback,
} from "../../firebase/functions/feedbackFunctions";
import { useState, useEffect } from "react";

const Feedback = () => {
import { useState, useEffect } from "react";

const Feedback = ({ currentUser }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [portfolioId, setPortfolioId] = useState("PXKgEDwdVZrWxatSfKDr");
  const [newComment, setNewComment] = useState("");
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [updatedComments, setUpdatedComments] = useState({});

  const retrivePortfolioFeedback = async () => {
    const feedback = await getPortfolioFeedback(portfolioId);
    setFeedbackList(feedback);
  };

  const handleCreateFeedback = async () => {
    const userId = currentUser.id;
    const docRef = await createFeedback(portfolioId, userId, newComment);
    setFeedbackList((prevFeedbackList) => [
      ...prevFeedbackList,
      {
        id: docRef.id,
        comment: newComment,
        portfolioId,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  };


  const handleUpdateFeedback = async (feedbackId) => {
    const updatedComment = updatedComments[feedbackId];
    if (updatedComment.trim() !== "") {
      setFeedbackList((prevFeedbackList) =>
        prevFeedbackList.map((feedback) =>
          feedback.id === feedbackId
            ? {
                ...feedback,
                comment: updatedComment,
                updatedAt: new Date().toISOString(),
              }
            : feedback
        )
      );

      try {
        await updateFeedback(feedbackId, updatedComment);
      } catch (err) {
        console.error("Error updating feedback:", err);
      }

      setEditingFeedbackId(null);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
      setFeedbackList((prevFeedbackList) =>
        prevFeedbackList.filter((feedback) => feedback.id !== feedbackId)
      );
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const handleEditClick = (feedbackId) => {
    setEditingFeedbackId(feedbackId);
    setUpdatedComments((prev) => ({
      ...prev,
      [feedbackId]: feedbackList.find((feedback) => feedback.id === feedbackId)
        .comment,
    }));
  };

  const handleCancelEdit = () => {
    setEditingFeedbackId(null);
  };

  useEffect(() => {
    retrivePortfolioFeedback();
  }, [portfolioId]);

  return (
    <div>
      <section className="grid grid-cols-1 gap-[3.13rem] pl-[3.13rem] justify-items-center">
        <div className="flex flex-col items-start gap-[1.5rem] p-[1.5rem] w-[47.125rem] rounded-lg border-t border-r-2 border-b-2 border-l border-gray-600">
          {feedbackList.map((feedback) => (
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
          ))}
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
