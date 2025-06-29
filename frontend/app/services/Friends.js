import { collection, getDocs, getDoc, doc, runTransaction } from "firebase/firestore";
import { db } from "../../firebase-config"; 

export async function getFriendsList(userId) {
  const friendsCol = collection(db, "users", userId, "friends");
  const snapshot = await getDocs(friendsCol);

  const friendUIDs = snapshot.docs.map(doc => doc.id);

  // Now fetch user details for each UID
  const friendDocs = await Promise.all(
    friendUIDs.map(async (uid) => {
      const userDoc = await getDoc(doc(db, "users", uid));
      return { uid, ...userDoc.data() };
    })
  );

  return friendDocs;
}

export async function removeFriend(userId, friendId) {
  
  const paths = {
    userFriendRef: doc(db, "users", userId, "friends", friendId),
    friendUserRef: doc(db, "users", friendId, "friends", userId),
    userRef: doc(db, "users", userId),
    friendRef: doc(db, "users", friendId),
  };

  await runTransaction(db, async (transaction) => {
    const [userFriendSnap, friendUserSnap, userSnap, friendSnap] = await Promise.all([
      transaction.get(paths.userFriendRef),
      transaction.get(paths.friendUserRef),
      transaction.get(paths.userRef),
      transaction.get(paths.friendRef),
    ]);

    if (userFriendSnap.exists()) transaction.delete(paths.userFriendRef);
    if (friendUserSnap.exists()) transaction.delete(paths.friendUserRef);

    const decrementCount = (snap, ref) => {
      if (snap.exists()) {
        const count = snap.data().friendsCount || 0;
        transaction.update(ref, { friendsCount: Math.max(0, count - 1) });
      }
    };

    decrementCount(userSnap, paths.userRef);
    decrementCount(friendSnap, paths.friendRef);
  });

  console.log("Friendship and counts updated atomically.");

}