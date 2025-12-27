import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Matches from "./pages/Matches";
import React from 'react'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
       <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-lost"
          element={
            <ProtectedRoute>
              <ReportLost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-found"
          element={
            <ProtectedRoute>
              <ReportFound />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
