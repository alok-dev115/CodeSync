import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { resolveClaim } from "../firebase/claims";

const FinderDashboard = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "claims"),
      where("foundUserId", "==", auth.currentUser.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClaims(data);
    });

    return () => unsubscribe();
  }, []);

  const handleAction = async (claim, status) => {
    await resolveClaim({
      claimId: claim.id,
      status,
      lostItemId: claim.lostItemId,
      foundItemId: claim.foundItemId,
      lostUserId: claim.lostUserId,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Claim Requests
        </h1>

        {claims.length === 0 && (
          <p className="text-gray-500">
            No pending claim requests.
          </p>
        )}

        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white shadow rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-700">
                  Someone wants to claim an item you found
                </p>
                <p className="text-sm text-gray-500">
                  Claim ID: {claim.id}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(claim, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleAction(claim, "rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FinderDashboard;
