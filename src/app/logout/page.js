"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth"; // Firebase auth methods

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const auth = getAuth(); // Initialize auth
        await signOut(auth); // Sign out the user
        // Redirect to the sign-in page after logout
        router.push("/signin");
      } catch (err) {
        console.error("Error logging out:", err);
      }
    };

    handleLogout(); // Trigger logout on page load
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
