// import addPortfolio from "../../firebase/functions/addPortfolio";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import React, { useState } from "react";

// const AddPortfolioPage = () => {
//   const [newPortfolio, setNewPortfolio] = useState({
//     title: "",
//     userId: "",
//     description: "",
//     imageUrl: "",
//     link: "",
//     coverImage: "",
//   });

//   const [showPreview, setShowPreview] = useState(false);

//   const handleChange = (e) => {
//     setNewPortfolio({ ...newPortfolio, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setNewPortfolio({ ...newPortfolio, coverImage: imageUrl });
//     }
//   };

//   const handleClearCoverImage = () => {
//     setNewPortfolio({ ...newPortfolio, coverImage: "" });
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
//       coverImage: "",
//     });
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Add a New Portfolio</h2>

//       <Tabs defaultValue="details">
//         <TabsList className="mb-4">
//           <TabsTrigger value="details">Portfolio Details</TabsTrigger>
//           <TabsTrigger value="cover">Upload Cover Image</TabsTrigger>
//         </TabsList>

//         {/* Portfolio Details Tab */}
//         <TabsContent value="details">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="title"
//               placeholder="Title"
//               value={newPortfolio.title}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded-md"
//             />
//             <input
//               type="text"
//               name="userId"
//               placeholder="User ID"
//               value={newPortfolio.userId}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded-md"
//             />
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={newPortfolio.description}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded-md"
//             />
//             <input
//               type="text"
//               name="imageUrl"
//               placeholder="Portfolio Image URL"
//               value={newPortfolio.imageUrl}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//             />
//             <input
//               type="text"
//               name="link"
//               placeholder="Portfolio Link"
//               value={newPortfolio.link}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded-md"
//             />

//             <div className="flex space-x-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setShowPreview(true)}
//               >
//                 Preview
//               </Button>
//               <Button type="submit">Publish Post</Button>
//             </div>
//           </form>
//         </TabsContent>

//         {/* Cover Image Tab */}
//         <TabsContent value="cover">
//           <div className="space-y-4">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="w-full p-2 border rounded-md"
//             />
//             {newPortfolio.coverImage && (
//               <div className="relative">
//                 <img
//                   src={newPortfolio.coverImage}
//                   alt="Cover Preview"
//                   className="w-full h-40 object-cover rounded-md"
//                 />
//                 <Button
//                   variant="destructive"
//                   className="absolute top-2 right-2 text-xs"
//                   onClick={handleClearCoverImage}
//                 >
//                   Remove
//                 </Button>
//               </div>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Preview Modal */}
//       <Dialog open={showPreview} onOpenChange={setShowPreview}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">
//               Portfolio Preview
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             {newPortfolio.coverImage && (
//               <img
//                 src={newPortfolio.coverImage}
//                 alt="Cover Preview"
//                 className="w-full h-40 object-cover rounded-md"
//               />
//             )}
//             <h2 className="text-xl font-bold">
//               {newPortfolio.title || "Untitled"}
//             </h2>
//             <p className="text-gray-600">
//               {newPortfolio.userId || "No User ID"}
//             </p>
//             <p>{newPortfolio.description || "No description available."}</p>
//             {newPortfolio.imageUrl && (
//               <img
//                 src={newPortfolio.imageUrl}
//                 alt="Portfolio Preview"
//                 className="w-full h-40 object-cover rounded-md"
//               />
//             )}
//             {newPortfolio.link && (
//               <a
//                 href={newPortfolio.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 View Portfolio
//               </a>
//             )}
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setShowPreview(false)} variant="outline">
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AddPortfolioPage;
