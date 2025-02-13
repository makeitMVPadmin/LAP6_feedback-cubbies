import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

const fetchCategories = async (categoryType) => {
    try {
        const categoryReference = doc(db, "categories", categoryType);
        const categorySnapshot = await getDoc(categoryReference);

        if (categorySnapshot.exists()) {
            return categorySnapshot.data().categories;
        } else {
            console.log("No category for selected type found!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export default fetchCategories;
