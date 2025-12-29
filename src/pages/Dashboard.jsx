import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Dashboard = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "claims"),
      where("lostUserId", "==", auth.currentUser.uid)
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

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to Lost & Found Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Manage reported lost items and track claim status.
      </p>

      {/* CLAIMS */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">My Claim Requests</h2>

        {claims.length === 0 && (
          <p className="text-gray-500">No claims yet.</p>
        )}

        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="flex justify-between items-center border rounded-lg p-4"
            >
              <span className="font-medium">Claim for Found Item</span>

              {claim.status === "approved" && (
                <span className="text-green-600 font-semibold">
                  APPROVED · Claimed on{" "}
                  {claim.resolvedAt?.toDate().toLocaleDateString()}
                </span>
              )}

              {claim.status === "pending" && (
                <span className="text-yellow-600 font-semibold">
                  PENDING
                </span>
              )}

              {claim.status === "rejected" && (
                <span className="text-red-600 font-semibold">
                  REJECTED
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => signOut(auth)}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
