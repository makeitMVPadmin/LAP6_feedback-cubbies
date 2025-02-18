import { db } from "../firebase.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const categoryData = {
    devTags: [
        "Frontend",
        "Backend",
        "Fullstack",
        "JavaScript",
        "HTML",
        "CSS",
        "TypeScript",
        "Tailwind",
        "Node.js",
        "Express",
        "MongoDB",
        "Firebase",
        "Git",
        "Machine Learning",
        "Data Science",
        "React",
        "Next.js",
        "Java",
    ],
    designTags: [
        "UI/UX",
        "Product Design",
        "Wireframing", 
        "Prototyping",
        "Visual Design",
        "User Experience",
        "User Interface",
        "Interaction Design",
        "Branding",
        "Motion Design",
        "Design Systems"
    ],
    generalTechTags: [
        "PM",
        "Agile",
        "Scrum",
        "User Research",
        "Cybersecurity",
        "DevOps",
        "Cloud Computing",
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