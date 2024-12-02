"use client";
// pages/index.js
import routes from "../route";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const goToSignIn = () => {
    router.push("/signin"); // Navigate to /signin page
  };

  return (
    <div className="grid h-screen place-items-center">
      <h1>Welcome to the Home Page</h1>
      <button
        onClick={goToSignIn}
        className="mt-4 items-center bg-gray-500 text-white px-4 py-2 rounded"
      >
        Go to Sign In
      </button>
    </div>
  );
};

export default HomePage;
