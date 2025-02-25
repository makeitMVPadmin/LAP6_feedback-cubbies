import { db } from "../firebase.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const fetchAllTags = async () => {
  try {
    const getTags = collection(db, "tags");
    const querySnapshot = await getDocs(getTags);

    const tagsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched Tags:", tagsArray);
    return tagsArray;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

const fetchTagsById = async (tagId) => {
  try {
    const tagDoc = doc(db, "tags", tagId);
    const tagSnapshot = await getDoc(tagDoc);

    if (tagSnapshot.exists()) {
      const tagData = { id: tagSnapshot.id, ...tagSnapshot.data() };
      console.log("Fetched Tag by ID:", tagData);
      return tagData;
    } else {
      console.log("No such tag!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching tag by ID:", error);
    return null;
  }
};

export { fetchAllTags, fetchTagsById };
