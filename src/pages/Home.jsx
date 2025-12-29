import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import TypewriterText from "../components/TypewriterText";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🔐 Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* ================= AUTHENTICATED DASHBOARD ================= */}
      {user ? (
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="relative bg-white/70 backdrop-blur-xl w-full max-w-2xl rounded-3xl shadow-2xl p-10">

            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.email[0].toUpperCase()}
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-1 text-center">
              Welcome back 👋
            </h1>

            <p className="text-slate-600 mb-10 text-sm text-center">
              Signed in as <br />
              <span className="font-medium">{user.email}</span>
            </p>

            {/* ACTION CARDS */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* LOST OWNER */}
              <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Lost an Item?
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Report lost items and track claim approvals.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/report-lost")}
                    className="w-full bg-blue-600 cursor-pointer text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Report Lost Item
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-slate-100 cursor-pointer text-slate-800 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition"
                  >
                    My Dashboard
                  </button>
                </div>
              </div>

              {/* FINDER */}
              <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Found an Item?
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Submit found items and approve claim requests.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/report-found")}
                    className="w-full bg-green-600 cursor-pointer text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    Report Found Item
                  </button>

                  <button
                    onClick={() => navigate("/finder-dashboard")}
                    className="w-full bg-slate-100 cursor-pointer text-slate-800 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition"
                  >
                    Finder Dashboard
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-10 text-xs text-slate-500 text-center">
              All actions are logged and verified for security
            </p>
          </div>
        </section>
      ) : (
        /* ================= PUBLIC LANDING PAGE ================= */
        <>
          {/* Hero Section */}
          <section className="max-w-6xl mx-auto px-6 py-24 text-center">
            <h1 className="text-5xl font-extrabold text-slate-800 mb-6">
              <TypewriterText text="Campus Lost & Found" delay={250} />
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
              An AI-powered platform that intelligently matches lost and found
              items across campus.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/report-lost")}
                className="bg-blue-600 cursor-pointer text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Report Lost Item
              </button>

              <button
                onClick={() => navigate("/report-found")}
                className="bg-white border border-slate-300 cursor-pointer px-8 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Report Found Item
              </button>
            </div>
          </section>

          {/* Features */}
          <section className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              <Feature
                title="AI-Based Matching"
                desc="Matches items using text, image, time, and location similarity."
              />
              <Feature
                title="Faster Recovery"
                desc="Instant notifications/update when potential matches are found."
              />
              <Feature
                title="Secure & Transparent"
                desc="Items are verified and marked claimed with a safety buffer."
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-8 text-slate-500 text-sm">
            © {new Date().getFullYear()} Campus Lost & Found · Built for students
          </footer>
        </>
      )}
    </div>
  );
};

// 🔹 Feature Card Component
const Feature = ({ title, desc }) => (
  <div className="p-6 rounded-xl border border-slate-200 hover:shadow-md transition">
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

export default Home;
