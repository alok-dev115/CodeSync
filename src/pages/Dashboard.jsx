import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Lost & Found Dashboard</h1>
      
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <p className="text-gray-600 mb-6">
          Manage reported lost and found items, and monitor user activity.
        </p>
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
