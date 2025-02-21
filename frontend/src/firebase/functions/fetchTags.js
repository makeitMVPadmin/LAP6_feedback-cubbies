import { db } from "../firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";


const fetchTagsByCategory = async (catgeory) => {
    try{
        const getTags = collection(db, "tags");
        
        const q = query(getTags, where("category", "==", catgeory));
        
        const querySnapshot = await getDocs(q);

        const tagsArray = [];

        querySnapshot.forEach((doc) => {
            tagsArray.push({ id: doc.id, ...doc.data() });
        });
        return tagsArray;

    }catch (error){
        console.error("Error fetching tags: ", error);
    }
};

export default fetchTagsByCategory;