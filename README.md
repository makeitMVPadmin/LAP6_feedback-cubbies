# LAP6_feedback-cubbies

## About The Project
This feature is designed to integrate into an existing app, creating a space where users can give and receive constructive feedback. It’s aimed at supporting new grads who want guidance on their work, helping ease the uncertainty of the job search process. By promoting clarity and confidence, it empowers users to grow and move forward in their careers.

## Tech Stack
- Frontend: React, SASS, ShadUI, HTML
- Backend: Firebase

## Project Goals
- Enable members to upload content of their projects/portfolio.
- Allow members to comment and provide genuine feedback.
- Display uploaded profiles in a queue or list format for easy access.
- Allow users to tag their uploads with predefined roles for context.

## Project Resources:
- Figma
- VsCode, GitHub
- Jira, Confluence
---

## Firebase initialization steps

This guide walks you through setting up Firebase for your project, including installation, authentication, routing configuration, and deployment.

### Prerequisites

Ensure you have the following installed before proceeding:

- **[Node.js](https://nodejs.org/)** (LTS version recommended)

## Installation and Setup

Follow these steps to initialize Firebase in your project:

### **Install Firebase CLI**
Install Firebase tools globally using npm:
```
npm install -g firebase-tools
```
### **Login to Firebase**
#### Authenticate with Firebase using your Google account:
```
firebase login
```
#### Navigate to your project directory and run:
```
firebase init
```
During initialization, select the following options:

Hosting (for deploying web apps)

Choose dist as the public directory (or your preferred build folder)

Configure as a single-page app if applicable (y/n prompt)

Skip automatic builds (n)

Configuring Routing for a New App Link

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
Here’s an example query:

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
