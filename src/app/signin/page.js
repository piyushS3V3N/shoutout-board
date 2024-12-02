"use client";

import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import routes from "../route";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(routes.MESSAGE_BOARD); // Redirect to the message board
    } catch (err) {
      setError("Failed to sign in: " + err.message);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth); // Sign in anonymously
      router.push(routes.MESSAGE_BOARD); // Redirect to the message board
    } catch (err) {
      setError("Failed to sign in anonymously: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form className="space-y-4" onSubmit={handleSignIn}>
        <div>
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            className="border p-2 w-64 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password:</label>
          <input
            type="password"
            className="border p-2 w-64 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
      </form>
      <button
        onClick={handleAnonymousSignIn}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Sign In Anonymously
      </button>
    </div>
  );
};

export default SignIn;
