import { db, FIREBASE_AUTH } from '../../firebase-config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  setDoc,
  orderBy,
  endAt,
  startAt,
  increment,
  onSnapshot,
} from "firebase/firestore";

{/*
    getUserByUid: Fetches a user's document from Firestore by their UID.
searchUsersByUsername: Looks for users whose username matches exactly (case-insensitive if you store a lowercased version in Firestore).
searchUsersByEmail: Finds users by their email (exact match).
updateUserProfile: Updates fields for a user's document.
createUserProfile: Creates a user document on signup (call this after the user registers with Firebase Auth).
    */}

/**
 * Fetch a user profile by their UID
 * @param {string} uid - The Firebase Auth UID of the user
 * @returns {Promise<Object|null>} - Returns user data object or null if not found
 */
export async function getUserByUid(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { uid: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (e) {
    console.error("Error fetching user by UID:", e);
    alert("Error fetching user by UID:", e.message)
    throw e;
  }
}

/**
 * Search users by their username (case-insensitive, exact match)
 * @param {string} username - The username to search for
 * @returns {Promise<Array>} - Returns array of user objects
 */
export async function searchUsersByUsername(username) {
  try {
    if (!username) return [];

    const usersCol = collection(db, "users");
    // Firestore doesn't support case-insensitive search natively.
    // You can store a lowercased "username_lowercase" field for easier search.
    const q = query(
      usersCol, 
      orderBy("username_lowercase"), 
      startAt(username.toLowerCase()), 
      endAt(username.toLowerCase() + '\uf8ff')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error searching users by username:", e);
    alert("Error searching users by username:", e.message)
    throw e;
  }
}

/**
 * Search users by their email (exact match)
 * @param {string} email - The email to search for
 * @returns {Promise<Array>} - Returns array of user objects
 */
export async function searchUsersByEmail(email) {
  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("email", "==", email));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error searching users by email:", e);
    alert("Error searching users by email:", e.message)
    throw e;
  }
}

/**
 * Update a user's profile data.
 * 
 * @param {string} uid - The user's Firebase Auth UID
 * @param {Object} data - The data to update (e.g., { displayName, avatarUrl, ... })
 * @returns {Promise<void>}
 */
export async function updateUserProfile(uid, data) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
  } catch (e) {
    console.error("Error updating user profile:", e);
    alert("Error updating user profile:", e.message)
    throw e;
  }
}

/**
 * Create a user document (used on sign up)
 * 
 * @param {string} uid - The user's Firebase Auth UID
 * @param {Object} data - The user data (should at least include displayName, email, username, etc.)
 * @returns {Promise<void>}
 */
export async function createUserProfile(uid, data) {
  try {
    // Example: store a lowercase version of the username for easier search
    const userDoc = {
      ...data,
      displayName: data.username || '',
      username_lowercase: data.username ? data.username.toLowerCase() : '',
      email: data.email || '',
      bio: data.bio || '',
      friendsCount: 0,
      uploadCount: 0,
      notificationCount: 0, 
      createdAt: Date.now(),
    };

    await setDoc(doc(db, "users", uid), userDoc);
    console.log("User profile created successfully!")
  } catch (e) {
    console.error("Error creating user profile:", e);
    alert("Error creating user profile:", e.message)
    throw e;
  }
}

export async function fetchUserData() {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) return null;

    try {

      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return userData;
      }
    else {
      console.warn("User document not found.")
      return null;
    }
  } catch (e) {
    console.error("Error fetching user data:", e)
    throw(e);
  }
};

export function listenToUserData(uid, onUpdate) {
  const userDocRef = doc(db, 'users', uid);
  
  const unsubscribe = onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const userData = { uid: doc.id, ...doc.data() };
      onUpdate(userData);
    } else {
      console.warn("User document not found.");
      onUpdate(null);
    }
  }, (error) => {
    console.error("Error listening to user data:", error);
    alert("Error listening to user data:", error.message)
  });

  return unsubscribe; // Return the unsubscribe function
}

export async function incrementNotificationCount(uid) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      notificationCount: increment(1)
    });
  } catch (e) {
    console.error("Error incrementing notification count:", e);
    alert("Error incrementing notification count:", e.message)
    throw e;
  }
}

export async function resetNotificationCount(uid) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      notificationCount: 0
    });
  } catch (e) {
    console.error("Error resetting notification count:", e);
    alert("Error resetting notification count:", e.message);
    throw e;
  }
}

// export async function addFriendToUser(currentUserId, friendUserId) {
//   try {
//     const friendDocRef = doc(db, "users", currentUserId, "friends", friendUserId);

//     await setDoc(friendDocRef, {
//       since: Date.now(),
//       friendID: friendUserId,
//     });

//     const userDocRef = doc(db, "users", currentUserId);
//     await updateDoc(userRef, {
//       friends: increment(1) // Increment friends count
//     });
//     console.log("Friend added successfully:", friendUserId);
//   } catch (e) {
//     console.error("Error adding friend to user:", e);
//     alert("Error adding friend to user:", e.message);
//     throw e;
//   }
// }