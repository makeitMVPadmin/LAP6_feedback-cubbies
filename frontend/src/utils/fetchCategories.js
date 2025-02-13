import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

const fetchCategories = async (categoryType) => {
    try {
        const categoryRef = doc(db, "categories", categoryType);
        const categorySnap = await getDoc(categoryRef);

        if (categorySnap.exists()) {
            return categorySnap.data().categories;
        } else {
            console.log("No category found!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export default fetchCategories;
