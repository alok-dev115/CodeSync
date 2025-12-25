import { testWrite } from "../firebase/testFirestore";

const Home = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Campus Lost & Found</h1>

      <button
        onClick={testWrite}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Test Firebase
      </button>
    </div>
  );
};

export default Home;
