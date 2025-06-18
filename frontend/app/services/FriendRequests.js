import { db } from '../../firebase-config';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, setDoc } from "firebase/firestore";

// Send a friend request
export async function sendFriendRequest(senderId, receiverId) { 
    await addDoc(collection(db, "friendRequests"), {
    from: senderId,
    to: receiverId,
    status: "pending",
    createdAt: Date.now()
  });
 }

// Accept/reject a friend request
export async function respondToFriendRequest(requestId, accepted, currentUserId, otherUserId) { const requestRef = doc(db, "friendRequests", requestId);
  await updateDoc(requestRef, { status: accepted ? "accepted" : "rejected" });

  if (accepted) {
    // Add each other as friends
    await setDoc(doc(db, "users", currentUserId, "friends", otherUserId), { since: Date.now() });
    await setDoc(doc(db, "users", otherUserId, "friends", currentUserId), { since: Date.now() });
  } }

// List incoming friend requests
export async function getIncomingRequests(userId) { 
    const q = query(collection(db, "friendRequests"), where("to", "==", userId), where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 }