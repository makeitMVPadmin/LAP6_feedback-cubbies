import { db } from "../firebase.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const fetchRoles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "role"));
    const rolesArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(rolesArray);
    return rolesArray;
  } catch (error) {
    console.error("Error fetching roles: ", error);
    return [];
  }
};

const fetchUserRoleById = async (roleId) => {
  try {
    const roleDoc = await getDoc(doc(db, "role", roleId));
    if (roleDoc.exists()) {
      const roleData = { id: roleDoc.id, ...roleDoc.data() };
      console.log(roleData);
      return roleData;
    } else {
      console.log("No such role!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching role: ", error);
    return null;
  }
};



export { fetchUserRoleById, fetchRoles };
