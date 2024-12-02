// app/page.js
"use client"; // Use client-side JavaScript

import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const goToSignIn = () => {
    router.push("/signin"); // Navigate to /signin page
  };

  return (
    <div className="grid h-screen place-items-center">
      <h1 className="text-3xl font-semibold">Welcome to the Home Page</h1>
      <button
        onClick={goToSignIn}
        className="mt-4 bg-gray-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-gray-700 transition-all duration-300"
      >
        Go to Sign In
      </button>
    </div>
  );
};

export default HomePage;
