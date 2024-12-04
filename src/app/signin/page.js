// pages/signin.js
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for navigation

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/message-board"); // Navigate to message board after successful sign-in
    } catch (err) {
      setError("Failed to sign in: " + err.message);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth); // Sign in anonymously
      router.push("/message-board"); // Navigate to message board
    } catch (err) {
      setError("Failed to sign in anonymously: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      {/* Card container with white border */}
      <div className="card-container p-6 w-96 border-2 border-white rounded-lg shadow-lg bg-gray-950">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Sign In
        </h1>
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="block text-sm font-medium text-white">
              Email:
            </label>
            <input
              type="email"
              className="border p-2 w-full rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Password:
            </label>
            <input
              type="password"
              className="border p-2 w-full rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Sign In
          </button>
        </form>

        {/* Divider Line */}
        <div className="my-4">
          <hr className="border-t border-gray-600" />
        </div>

        {/* Link to go to SignUp page */}
        <Link href="/signup">
          <button className="w-full mt-4 bg-green-600 text-white py-2 rounded">
            Create an Account
          </button>
        </Link>

        {/* Divider Line */}
        <div className="my-4">
          <hr className="border-t border-gray-600" />
        </div>

        {/* Anonymous Sign In button */}
        <button
          onClick={handleAnonymousSignIn}
          className="w-full mt-4 bg-gray-500 text-white py-2 rounded"
        >
          Sign In Anonymously
        </button>

        {/* Link to go back to the home page */}
        <Link href="/">
          <button className="w-full mt-4 bg-gray-300 text-black py-2 rounded">
            Go to Home Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
