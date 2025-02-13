import { db } from "../firebase.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const categoryData = {
    dev: [
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
    design: [
        "UI/UX",
        "Product Design",
        "Wireframing", 
        "Prototyping",
        "Visual Design",
        "User Experience",
        "User Interface",
        "Interaction Design",
        "User Interface",
        "Motion Design",
        "Design Systems"
    ],
    generalTech: [
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
const predefinedCategories = async () => {
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

export default predefinedCategories;