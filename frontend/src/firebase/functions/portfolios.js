import { db } from '../../firebase/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { collection, getDocs, query, where } from "firebase/firestore";

const fetchPortfolio = async (userId) => {
  try {
    const q = query(collection(db, "portfolios"), where("userId", "==", userId)); // 🔥 Filter by userId
    const querySnapshot = await getDocs(q);

    const userPortfolio = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched portfolios:", userPortfolio);
    return userPortfolio;
  } catch (error) {
    console.error("Error fetching portfolios: ", error);
    return [];
  }
};


const addPortfolio = async (portfolioData) => {
  try {
    await addDoc(collection(db, 'portfolios'), portfolioData);
    console.log('Portfolio added successfully!');
  } catch (error) {
    console.error('Error adding portfolio:', error);
  }
};

const updatePortfolio = async (id, updatedData) => {
  try {
    console.log('Updating Portfolio ID:', id);
    const portfolioRef = doc(db, 'portfolios', id);
    await updateDoc(portfolioRef, updatedData);
    console.log('Portfolio updated successfully!');
  } catch (error) {
    console.error('Error updating portfolio:', error);
  }
};

const deletePortfolio = async (id) => {
  try {
    await deleteDoc(doc(db, 'portfolios', id));
    console.log('Portfolio deleted successfully!');
  } catch (error) {
    console.error('Error deleting portfolio:', error);
  }
};

export { fetchPortfolio, addPortfolio, updatePortfolio, deletePortfolio };
