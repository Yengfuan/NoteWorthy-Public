import { collection, getDocs } from "firebase/firestore";

async function getFriendsList(userId) {
  const friendsCol = collection(db, "users", userId, "friends");
  const snapshot = await getDocs(friendsCol);
  return snapshot.docs.map(doc => doc.id); // friend UIDs
}