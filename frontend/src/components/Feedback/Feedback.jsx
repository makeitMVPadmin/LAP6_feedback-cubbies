import { useState, useEffect } from "react";
import {
  getPortfolioFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../firebase/functions/feedbackFunctions";


const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [portfolioId, setPortfolioId] = useState("KoFVGG5ARPOD2kcRT2JN");
  const [newComment, setNewComment] = useState("");
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [updatedComments, setUpdatedComments] = useState({});


  const retrivePortfolioFeedback = async () => {
    const feedback = await getPortfolioFeedback(portfolioId);
    setFeedbackList(feedback);
  };

  const handleCreateFeedback = async () => {
    const userId = "wJMvwRo2mqYo59LRA1hT";
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
      <h2>Feedbacks for Portfolio {portfolioId}</h2>
      <ul>
        {feedbackList.map((feedback) => (
          <li key={feedback.id}>
            {editingFeedbackId === feedback.id ? (
              <div>
                <input
                  type="text"
                  value={updatedComments[feedback.id] || feedback.comment}
                  onChange={(e) =>
                    setUpdatedComments((prev) => ({
                      ...prev,
                      [feedback.id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => handleUpdateFeedback(feedback.id)}>
                  Save
                </button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <p onClick={() => handleEditClick(feedback.id)}>
                  {feedback.comment}
                </p>
              </div>
            )}

            <button onClick={() => handleDeleteFeedback(feedback.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a feedback"
        />
        <button onClick={handleCreateFeedback}>Submit Feedback</button>
      </div>
    </div>
  );
};

export default Feedback;
