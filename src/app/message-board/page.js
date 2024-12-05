"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../components/FirebaseProvider";
import { useRouter } from "next/navigation";
import MessageList from "../../../components/MessageList";
import MessageForm from "../../../components/MessageForm";
import Image from "next/image"; // Import Image component
import { doc, getDoc } from "firebase/firestore"; // Correct Firestore imports
import { db } from "../../../utils/firebase"; // Import the Firestore instance

const MessageBoard = () => {
  const { user } = useAuth(); // Get the current user from context
  const router = useRouter();
  const [userIcon, setUserIcon] = useState("/default.png"); // Default icon if none is set

  // Fetch user icon on component mount
  useEffect(() => {
    if (user) {
      const fetchUserIcon = async () => {
        try {
          // Firestore reference to the user's document in the "user_info" collection
          const userDocRef = doc(db, "user_info", user.uid);

          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserIcon(userData.icon || "/default.png"); // Set user icon or fallback to default
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
      fetchUserIcon();
    }
  }, [user]);

  // Redirect to sign-in page if no user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  if (!user) return <div>Loading...</div>; // Prevent rendering before redirect

  const handleProfileClick = () => {
    // Redirect to user management page
    router.push("/usermanage");
  };

  const handleLogout = () => {
    // Navigate to the logout page to handle the sign-out process
    router.push("/logout");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 relative">
      {/* Profile icon button */}
      <button
        onClick={handleProfileClick}
        className="absolute top-4 left-16 bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
      >
        <Image
          src={userIcon} // Use the user's icon or fallback to default
          alt="User Avatar"
          width={32}
          height={32}
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
      </button>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 p-2 rounded-full"
      >
        <span className="text-white font-bold">Logout</span>
      </button>

      {/* Chat header */}
      <div className="text-center py-4 bg-gray-950 text-white">
        <h1 className="text-2xl font-bold">Message Board</h1>
      </div>

      {/* Message list container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-950">
        <MessageList />
      </div>

      {/* Message form container */}
      <div className="bg-gray-800 p-4">
        <MessageForm />
      </div>
    </div>
  );
};

export default MessageBoard;
