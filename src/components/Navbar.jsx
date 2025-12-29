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
    navigate("/login"); // safer than /dashboard
  };

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        bg-slate-900 text-white
        border-b border-slate-800
        shadow-md
      "
    >
      <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        {/* LOGO */}
        <h1
          className="text-xl font-bold cursor-pointer hover:text-slate-300 transition"
          onClick={() => navigate("/")}
        >
          Lost & Found
        </h1>

        {/* LINKS */}
        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link to="/" className="hover:text-slate-300">Home</Link>
          <Link to="/report-lost" className="hover:text-slate-300">Report Lost</Link>
          <Link to="/report-found" className="hover:text-slate-300">Report Found</Link>
          <Link to="/matches" className="hover:text-slate-300">Matches</Link>

          {/* 🔑 AUTH BUTTON */}
          {user ? (
            <button
              onClick={handleLogout}
              className="
                ml-4 bg-red-600 cursor-pointer hover:bg-red-700
                px-4 py-1.5 rounded-md font-semibold
                transition
              "
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="
                ml-4 bg-blue-600 cursor-pointer hover:bg-blue-700
                px-4 py-1.5 rounded-md font-semibold
                transition
              "
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
