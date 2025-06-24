import { db } from '../../firebase-config';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, setDoc, onSnapshot, runTransaction, increment } from "firebase/firestore";
import { getUserByUid, incrementNotificationCount } from './Users';

// Send a friend request
export async function sendFriendRequest(senderId, receiverId) { 
  const [senderData, receiverData] = await Promise.all([
    getUserByUid(senderId),
    getUserByUid(receiverId)
  ]);

  if (!senderData?.username || !receiverData?.username) {
    throw new Error("Sender or receiver user not found");
  }

    await addDoc(collection(db, "friendRequests"), {
    from: senderId,
    fromUsername: senderData.username,
    to: receiverId,
    toUsername: receiverData.username,
    status: "pending",
    createdAt: Date.now()
  });
    await incrementNotificationCount(receiverId); // Increment notification count for the receiver
}

// Accept/reject a friend request
export async function respondToFriendRequest(requestId, accepted) { 
  const requestRef = doc(db, "friendRequests", requestId);
  await updateDoc(requestRef, { status: accepted ? "accepted" : "rejected" });
  
}

// List incoming friend requests
export function getIncomingRequests(userId, onUpdate) { 
  const q = query(
    collection(db, "friendRequests"),
    where("to", "==", userId),
    where("status", "==", "pending")
  );

  // Subscribe to changes and call onUpdate with the latest data
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Incoming friend requests:", requests);
    onUpdate(requests);
  });
  return unsubscribe;
}

export async function confirmFriendRequest(currentUserId, otherUserId) {
  const currentFriendRef = doc(db, `users/${currentUserId}/friends/${otherUserId}`);
  const otherFriendRef = doc(db, `users/${otherUserId}/friends/${currentUserId}`);
  const currentUserRef = doc(db, `users/${currentUserId}`);
  const otherUserRef = doc(db, `users/${otherUserId}`);

  const friendData = {
    since: Date.now(),
    friendID: otherUserId,
  };

  try {
    await runTransaction(db, async (transaction) => {
      transaction.set(currentFriendRef, friendData);
      transaction.set(otherFriendRef, { ...friendData, friendID: currentUserId });

      transaction.update(currentUserRef, {
        friendsCount: increment(1),
      });
      transaction.update(otherUserRef, {
        friendsCount: increment(1),
      });
    });
    console.log('Friend request confirmed!');
  } catch (e) {
    console.error('Failed to confirm friend request:', e);
  }
}