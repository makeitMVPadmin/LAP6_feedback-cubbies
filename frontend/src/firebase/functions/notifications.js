import { db } from "../firebase.js";
import { collection, addDoc, getDocs } from "firebase/firestore";

//table: 
//id - notification id
//userId - sender
//portfolioId - receiver
//feedbackId - feedback id: commentId
//message - message
//readStatus
//createdAt
//updatedAt

//Create a new notification

//Get all notifications for a user

//Get all unread notifications for a user
