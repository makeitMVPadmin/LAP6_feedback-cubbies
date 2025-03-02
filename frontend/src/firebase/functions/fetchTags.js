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
    // return as an array to filter in frontend component
    return [];
  }
};
const fetchAllTagsSorted = async () => {
  try {
    // Await the fetchAllTags function to get the tags
    const tagsArray = await fetchAllTags();

    // Ensure the tagsArray has data
    if (!tagsArray || tagsArray.length === 0) {
      console.log("No tags found.");
      return [];
    }

    // Sort the tags by 'category' and then by 'tagName'
    const sortedTagsArray = tagsArray.sort((a, b) => {
      // First compare by 'category'
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;

      // If 'category' is the same, compare by 'tagName'
      if (a.tagName < b.tagName) return -1;
      if (a.tagName > b.tagName) return 1;

      return 0; // If both 'category' and 'tagName' are the same
    });

    return sortedTagsArray;
  } catch (error) {
    console.error("Error fetching or sorting tags:", error);
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

export { fetchAllTags, fetchTagsById, fetchAllTagsSorted };
