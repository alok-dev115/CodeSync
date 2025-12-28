import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // go to Home (dashboard UI is there)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Google Login
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl p-10">

        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">
          Login to Lost & Found
        </h1>
        <p className="text-slate-600 text-center mb-8 text-sm">
          Access your dashboard and manage reports
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              w-full px-4 py-3 rounded-xl border border-slate-300
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="
              w-full px-4 py-3 rounded-xl border border-slate-300
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
              hover:bg-blue-700 hover:-translate-y-0.5
              transition-all duration-200 shadow-md
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-slate-300" />
          <span className="px-4 text-sm text-slate-500">OR</span>
          <div className="flex-grow h-px bg-slate-300" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="
            w-full bg-red-500 text-white py-3 rounded-xl font-semibold
            hover:bg-red-600 hover:-translate-y-0.5
            transition-all duration-200 shadow-md
          "
        >
          Login with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
