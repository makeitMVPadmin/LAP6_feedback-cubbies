import addPortfolio from "../../firebase/functions/addPortfolio";
import deletePortfolio from "../../firebase/functions/deletePortfolio";
import fetchPortfolio from "../../firebase/functions/fetchPortfolio";
import updatePortfolio from "../../firebase/functions/updatePortfolio";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    userId: "",
    description: "",
    imageUrl: "",
    link: "",
  });

  // ..Edit Current Portfolio............................................
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    userId: "",
    description: "",
    imageUrl: "",
    link: "",
  });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchPortfolio();
      if (data.length > 0) {
        setPortfolio(data[0]);
      }
    };
    getData();
  }, []);

  const handleChange = (e) => {
    setNewPortfolio({ ...newPortfolio, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPortfolio(newPortfolio);
    const updatedData = await fetchPortfolio();
    setPortfolio(updatedData[0] || null);
    setNewPortfolio({
      title: "",
      userId: "",
      description: "",
      imageUrl: "",
      link: "",
      CategoryId: "",
    });
  };
  // ..Delete Portfolio............................................
  const handleDelete = async () => {
    if (portfolio) {
      await deletePortfolio(portfolio.id);
      setPortfolio(null);
    }
  };
  // ..Edit Portfolio............................................
  const handleEdit = () => {
    setEditing(true);
    setUpdatedData({
      title: portfolio.title,
      userId: portfolio.userId,
      description: portfolio.description,
      imageUrl: portfolio.imageUrl,
      link: portfolio.link,
      CategoryId: portfolio.CategoryId,
    });
  };

  const handleUpdate = async () => {
    if (!portfolio) return;
    await updatePortfolio(portfolio.id, updatedData);
    setPortfolio({ ...portfolio, ...updatedData });
    setEditing(false);
  };

  return (
    <div>
      <h2>Portfolio</h2>
      {portfolio ? (
        <div>
          {editing ? (
            <div>
              <input
                type="text"
                name="title"
                placeholder="New Title"
                value={updatedData.title}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, title: e.target.value })
                }
              />
              <textarea
                name="description"
                placeholder="New Description"
                value={updatedData.description}
                onChange={(e) =>
                  setUpdatedData({
                    ...updatedData,
                    description: e.target.value,
                  })
                }
              />
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          ) : (
            <div>
              <h2>{portfolio.title}</h2>
              <p>{portfolio.userId}</p>
              <p>{portfolio.description}</p>
              {portfolio.imageUrl && (
                <img
                  src={portfolio.imageUrl}
                  alt={portfolio.title}
                  width="200"
                />
              )}
              {/* <Button to={portfolio.link}>Review Portfolio</Button> */}
              <Button variant="default" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p>No portfolio available.</p>
      )}
      {/* ADDING PORTFOLIO FORM */}
      <h2>ADD A NEW PORTFOLIO BELOW</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPortfolio.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={newPortfolio.userId}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newPortfolio.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newPortfolio.imageUrl}
          onChange={handleChange}
        />
        <input
          type="text"
          name="link"
          placeholder="Portfolio Link"
          value={newPortfolio.link}
          onChange={handleChange}
          required
        />
        <Button type="submit">Add New Portfolio</Button>
      </form>
    </div>
  );
};

export default PortfolioPage;

// import addPortfolio from "../../firebase/functions/addPortfolio";
// import deletePortfolio from "../../firebase/functions/deletePortfolio";
// import fetchPortfolio from "../../firebase/functions/fetchPortfolio";
// import updatePortfolio from "../../firebase/functions/updatePortfolio";
// import { Button } from "@/components/ui/button";
// import React, { useEffect, useState } from "react";

// const PortfolioPage = () => {
//   const [portfolio, setPortfolio] = useState([]);
//   const [newPortfolio, setNewPortfolio] = useState({
//     title: "",
//     userId: "",
//     description: "",
//     imageUrl: "",
//     link: "",
//   });
//   // ..Edit Portfolio...........................................................
//   const [editingId, setEditingId] = useState(null);
//   const [updatedData, setUpdatedData] = useState({
//     title: "",
//     userId: "",
//     description: "",
//     imageUrl: "",
//     link: "",
//   });

//   useEffect(() => {
//     const getData = async () => {
//       const data = await fetchPortfolio();
//       setPortfolio(data);
//     };
//     getData();
//   }, []);

//   const handleChange = (e) => {
//     setNewPortfolio({ ...newPortfolio, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await addPortfolio(newPortfolio);
//     setNewPortfolio({
//       title: "",
//       userId: "",
//       description: "",
//       imageUrl: "",
//       link: "",
//     });

//     // ..Getting Updated Data after adding a new Portfolio...........................................................
//     const updatedData = await fetchPortfolio();
//     setPortfolio(updatedData);
//   };
//   // ..Delete Portfolio...........................................................
//   const handleDelete = async (id) => {
//     await deletePortfolio(id);
//     setPortfolio(portfolio.filter((item) => item.id !== id));
//   };
//   // ..Edit Portfolio...........................................................
//   const handleEdit = (item) => {
//     setEditingId(item.id);
//     setUpdatedData({
//       title: item.title,
//       description: item.description,
//     });
//   };
//   // ..update Portfolio...........................................................
//   const handleUpdate = async (id) => {
//     if (!id) {
//       console.error("Error: Missing document ID!");
//       return;
//     }
//     console.log("Updating portfolio with ID:", id);
//     await updatePortfolio(id, updatedData);
//     setPortfolio(
//       portfolio.map((item) =>
//         item.id === id ? { ...item, ...updatedData } : item
//       )
//     );
//     setEditingId(null);
//   };
//   return (
//     <div>
//       <h2>Portfolio Title</h2>
//       <ul>
//         {portfolio.map((item) => (
//           <li key={item.id}>
//             <h2>{item.title}</h2>
//             <p>{item.userId}</p>
//             <p>{item.description}</p>
//             {item.imageUrl && (
//               <img src={item.imageUrl} alt={item.title} width="200" />
//             )}
//             <Button to={item.link}>Review Portfolio</Button>

//             {/* ..EDIT BUTTON.. */}
//             <Button variant="default" onClick={() => handleEdit(item)}>
//               Edit
//             </Button>

//             {/* .. DELETE BUTTON... */}
//             <Button variant="destructive" onClick={() => handleDelete(item.id)}>
//               Delete
//             </Button>

//             {/* EDIT FORM -Only When Editing */}
//             {editingId === item.id && (
//               <div>
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="New Title"
//                   value={updatedData.title}
//                   onChange={(e) =>
//                     setUpdatedData({ ...updatedData, title: e.target.value })
//                   }
//                 />
//                 <input
//                   type="text"
//                   name="description"
//                   placeholder="New Description"
//                   value={updatedData.description}
//                   onChange={(e) =>
//                     setUpdatedData({
//                       ...updatedData,
//                       description: e.target.value,
//                     })
//                   }
//                 />
//                 <Button variant="success" onClick={() => handleUpdate(item.id)}>
//                   Save Changes
//                 </Button>
//               </div>
//             )}
//             <br></br>
//           </li>
//         ))}
//       </ul>

//       <h2>Add a New Portfolio</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           value={newPortfolio.title}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="userId"
//           placeholder="User ID"
//           value={newPortfolio.userId}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={newPortfolio.description}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="imageUrl"
//           placeholder="Image URL"
//           value={newPortfolio.imageUrl}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="link"
//           placeholder="Portfolio Link"
//           value={newPortfolio.link}
//           onChange={handleChange}
//           required
//         />
//         <Button type="submit">Add Portfolio</Button>
//       </form>
//     </div>
//   );
// };

// export default PortfolioPage;
