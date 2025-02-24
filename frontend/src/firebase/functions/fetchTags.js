import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

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

export default fetchAllTags;
