# LAP6_feedback-cubbies 🎉

## Table of Contents 📜
- [About The Project](#about-the-project)
- [Project Goals](#project-goals)
- [Tech Stack](#tech-stack)
- [Project Resources](#project-resources)
- [Installation](#installation)
- [Firebase Initialization Steps](#firebase-initialization-steps)
- [Deploying the App](#deploying-the-app)
- [Setting Up Firebase API Keys](#setting-up-firebase-api-keys)

## About The Project 🔎
This feature is designed to integrate into an existing app, creating a space where users can give and receive constructive feedback. It’s aimed at supporting new grads who want guidance on their work, helping ease the uncertainty of the job search process. By promoting clarity and confidence, it empowers users to grow and move forward in their careers. 🚀

## Home Page
![alt text](<frontend/src/assets/FireShot Capture 003 - Feedback Cubbies - [localhost].png>)

## Post Modal
![alt text](<frontend/src/assets/FireShot Capture 006 - Feedback Cubbies - [localhost].png>)

## Notifications
![alt text](<frontend/src/assets/FireShot Capture 009 - Feedback Cubbies - [localhost].png>)

## Filter Tags
![alt-text](<frontend/src/assets/Screenshot 2025-03-02 at 11.41.58 AM.png>)

## Project Goals 🎯

- Enable members to upload content of their projects/portfolio.
- Allow members to comment and provide genuine feedback.
- Display uploaded profiles in a queue or list format for easy access.
- Allow users to tag their uploads with predefined roles for context.

## Tech Stack  💻

- **[React](https://react.dev/):** A JavaScript library for building user interfaces.  
- **[Vite](https://vitejs.dev/):** A fast build tool and development server for modern web applications.  
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for styling.  
- **[shadcn/ui](https://ui.shadcn.com/):** Pre-built, accessible UI components built on Radix and Tailwind CSS.  
- **[Firebase](https://firebase.google.com/):** Backend services for authentication, database, and hosting.  

## Project Resources  📚

- **[Figma](https://www.figma.com/):** UI/UX design and prototyping tool.  
- **[VS Code](https://code.visualstudio.com/):** Source code editor with powerful extensions.  
- **[GitHub](https://github.com/):** Version control and repository hosting.  
- **[Jira](https://www.atlassian.com/software/jira):** Project management and issue tracking.  
- **[Confluence](https://www.atlassian.com/software/confluence):** Documentation and team collaboration.  

## Contributors

Our team comprises two mains teams, developers and designers. Designers are responsible for all aspects of the design not limited to user research, wireframing, prototyping and creating detailed figma files to hand off to developers. For this project, developers got a chance to try out various aspects of the stack including backend and frontend.
### Designers:

 - [Anthony Kazman](https://www.linkedin.com/in/anthony-kazman/)
 - [Kery Mauvais](https://www.linkedin.com/in/kery-mauvais?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)

### Developers

   - [Darius Fang](https://www.linkedin.com/in/dariusfang/)
   - [Jamie Ingalls](https://www.linkedin.com/in/jamieingalls/)
   - [Maria Lukowich](https://www.linkedin.com/in/maria-lukowich/)
   - [Matie Baida](https://www.linkedin.com/in/maitebaida/)
   - [Nyakuma Wal](https://www.linkedin.com/in/nyakuma-wal-3-120/)
   - [Rouene Medina](https://www.linkedin.com/in/rouenemedina/)
   - [Tetiana Vezyr](https://www.linkedin.com/in/tetiana-vezyr/)

### Product Manager

- [Abigayle Lefranc](https://www.linkedin.com/in/abigaylelefranc/)

### Team Leads

 - [Helen Yan](https://www.linkedin.com/in/helenyanux/)


---

## Installation 🛠️  

Follow these steps to set up the project on your local machine:  

### Prerequisites  

Make sure you have the following installed:  
- **[Node.js](https://nodejs.org/)** (LTS recommended)  
- **npm** (comes with Node.js)  

### Clone the Repository  

```sh
   git clone git@github.com:makeitMVPadmin/LAP6_feedback-cubbies.git
   ```
### Install Dependencies
```sh
   npm install
   ```

## Firebase Initialization Steps

### **Install Firebase CLI**
Install Firebase tools globally using npm:
```
npm install -g firebase-tools
```
### **Login to Firebase**
#### Authenticate With Firebase Using Your Google Account
```
firebase login
```
#### Navigate To Your Project Directory And Run This Command
```
firebase init
```
#### Select The Following Options:

- Hosting (for deploying web apps)
- Choose dist as the public directory (or your preferred build folder)
- Configure as a single-page app if applicable (y/n prompt)
- Skip automatic builds (n)

#### Configuring Routing For A New App Link

If you need to add a custom app link (e.g., /app1), update your firebase.json file:
```
{
  "hosting": [
    {
      "target": "app1",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "/app1/**",
          "destination": "/app1/index.html"
        }
      ]
    }
  ]
}
```
## Deploying the App
Once Firebase is initialized and configured, follow these steps to deploy:
### Build the app
```
npm run build
```
### Assign a Firebase Hosting target
```
firebase target:apply hosting app1 app1-site
```
### Deploy only the configured app (app1)
```
firebase deploy --only hosting:app1
```
### Setting Up Firebase API Keys
To use Firebase services like Firestore, Authentication, or Storage, set up API keys:

Go to Firebase Console.
Select your project and navigate to Project Settings.
Under General > Your Apps, find the Firebase SDK Configuration.
Copy the config object and add it to your project.
Storing API Keys in an .env file (Recommended)
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```
### Initializing Firebase in Your Application
Create a Firebase utility file in your frontend project under the directory firebase/firebase.js:
```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };

```
#### Querying Firebase Firestore (Example)

```
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

const fetchUsers = async (params) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const userArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(userArray);
    return userArray;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};
export default fetchUsers;

```
