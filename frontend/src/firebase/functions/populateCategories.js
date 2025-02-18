import { db } from "../firebase.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const categoryData = {
    devTags: [
        "Frontend",
        "Backend",
        "Full-Stack",
        "Python",
        "JavaScript",
        "Data Science",
    ],
    designTags: [
        "UX",
        "Product Design",
        "Wireframing", 
        "Prototyping",
        "Branding",
        "Motion Design",
    ],
    generalTechTags: [
        "Project Management",
        "Cybersecurity",
        "DevOps",
        "Coding",
        "Game Development",
        "Mobile Development",
    ]
}
const populateCategories = async () => {
    try{
        for (const [categoryType, subCategories] of Object.entries(categoryData)) {
            const categoryRef = doc(db, "categories", categoryType);

            await setDoc(categoryRef, {
                categories: subCategories,
                createdAt: serverTimestamp(),
                userId: "admin",
            })
        }
    } catch (error){
        console.error("Error adding predefined categories: ", error)
    }
}
populateCategories();

export default populateCategories;