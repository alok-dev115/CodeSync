import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Matches from "./pages/Matches";
import React from 'react'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
