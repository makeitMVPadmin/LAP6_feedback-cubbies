import { db } from "../firebase.js";
import { collection, addDoc, serverTimeStamp } from "firebase/firestore";

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
const addPredefinedCategories = async () => {
    
}

export default addPredefinedCategories;