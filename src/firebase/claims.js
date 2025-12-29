import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { createNotification } from "./notifications";

/**
 * 🔔 A (lost owner) requests a claim on an item found by B
 */
export const createClaim = async ({
  lostItemId,
  foundItemId,
  lostUserId,
  foundUserId,
}) => {
  // 1️⃣ Create claim document
  await addDoc(collection(db, "claims"), {
    lostItemId,
    foundItemId,
    lostUserId,
    foundUserId,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  // 2️⃣ Notify B (finder)
  await createNotification(
    foundUserId,
    "Someone wants to claim the item you found."
  );
};

/**
 * ✅ / ❌ B approves or rejects the claim
 */
export const resolveClaim = async ({
  claimId,
  status,
  lostItemId,
  foundItemId,
  lostUserId,
}) => {
  // 1️⃣ Update claim status
  await updateDoc(doc(db, "claims", claimId), { status });

  if (status === "approved") {
    // 2️⃣ Mark both items as claimed
    await updateDoc(doc(db, "lost_items", lostItemId), {
      claimed: true,
    });

    await updateDoc(doc(db, "found_items", foundItemId), {
      claimed: true,
    });

    // 3️⃣ Notify A (lost owner)
    await createNotification(
      lostUserId,
      "Your claim has been approved 🎉"
    );
  } else {
    // 3️⃣ Notify A (rejected)
    await createNotification(
      lostUserId,
      "Your claim request was rejected."
    );
  }
};
