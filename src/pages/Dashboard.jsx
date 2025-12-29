import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Welcome to Lost & Found Dashboard
        </h1>

        <p className="text-gray-600 mb-8">
          Manage reported lost items and track claim status.
        </p>

        {/* CLAIM STATUS */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            My Claim Requests
          </h2>

          {claims.length === 0 && (
            <p className="text-gray-500">No claims yet.</p>
          )}

          <div className="space-y-4">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <span className="font-medium text-gray-700">
                  Claim for Found Item
                </span>

                <span
                  className={`font-bold ${
                    claim.status === "approved"
                      ? "text-green-600"
                      : claim.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {claim.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
