import { useNavigate } from "react-router-dom";
import TypewriterText from "../components/TypewriterText";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-6">
          <TypewriterText text="Campus Lost & Found" delay={300} />
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          An AI-powered platform to intelligently match lost and found items
          across campus.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/report-lost")}
            className="
    bg-blue-600 cursor-pointer text-white
    px-8 py-3 rounded-lg font-semibold
    transition-all duration-200 ease-out
    hover:bg-blue-700
    hover:-translate-y-0.5
    hover:shadow-lg
    active:translate-y-0
    active:shadow-md
  "
          >
            Report Lost Item
          </button>

          <button
            onClick={() => navigate("/report-found")}
            className="
    bg-white cursor-pointer text-slate-700
    border border-slate-300
    px-8 py-3 rounded-lg font-semibold
    transition-all duration-200 ease-out
    hover:bg-slate-100
    hover:border-slate-400
    hover:-translate-y-0.5
    hover:shadow-md
    active:translate-y-0
  "
          >
            Report Found Item
          </button>
        </div>
      </section>
      {/* Feature Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-slate-200 hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              AI-Based Matching
            </h3>
            <p className="text-slate-600">
              Uses text, location, and time similarity to find the most accurate
              matches.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Faster Recovery
            </h3>
            <p className="text-slate-600">
              No more manual searching. Get notified instantly when a match is
              found.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Secure & Transparent
            </h3>
            <p className="text-slate-600">
              Items are tracked, verified, and marked claimed with a safety
              buffer period.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-500 text-sm">
        © {new Date().getFullYear()} Campus Lost & Found · Built for students
      </footer>
    </div>
  );
};

export default Home;
