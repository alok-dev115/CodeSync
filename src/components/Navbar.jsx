import { Link } from "react-router-dom";
import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Lost & Found</h1>

      <div className="space-x-4">
        <Link to="/" className="hover:text-slate-300">Home</Link>
        <Link to="/report-lost" className="hover:text-slate-300">Report Lost</Link>
        <Link to="/report-found" className="hover:text-slate-300">Report Found</Link>
        <Link to="/matches" className="hover:text-slate-300">Matches</Link>
      </div>
    </nav>
  );
};

export default Navbar;
