import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🔐 Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/dashboard"); // 👈 after logout
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        Lost & Found
      </h1>

      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-slate-300">Home</Link>
        <Link to="/report-lost" className="hover:text-slate-300">Report Lost</Link>
        <Link to="/report-found" className="hover:text-slate-300">Report Found</Link>
        <Link to="/matches" className="hover:text-slate-300">Matches</Link>

        {/* 🔑 AUTH BUTTON */}
        {user ? (
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-md font-semibold transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="ml-4 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md font-semibold transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
