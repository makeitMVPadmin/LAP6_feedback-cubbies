// filepath: /Users/jamie_ingalls/launch_academy/LAP6_feedback-cubbies/frontend/src/firebase/functions/fetchRoles.js
import { db } from "../firebase.js";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const fetchRoles = async () => {
  try {
    const rolesCollection = collection(db, "roles");
    const rolesSnapshot = await getDocs(rolesCollection);
    const rolesList = rolesSnapshot.docs.map(doc => doc.data().roleName);
    return rolesList;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

const fetchRoleById = async (roleId) => {
  try {
    const roleDoc = doc(db, "roles", roleId);
    const roleSnapshot = await getDoc(roleDoc);
    if (roleSnapshot.exists()) {
      return roleSnapshot.data();
    } else {
      console.log("No such role with ID:", roleId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching role by ID:", error);
    return null;
  }
};

export {fetchRoles, fetchRoleById};
