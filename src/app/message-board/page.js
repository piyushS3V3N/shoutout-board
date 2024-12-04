"use client";

import { useEffect } from "react";
import { useAuth } from "../../../components/FirebaseProvider";
import { useRouter } from "next/navigation";
import MessageList from "../../../components/MessageList";
import MessageForm from "../../../components/MessageForm";

const MessageBoard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const secretKey = "YOUR_SECRET_KEY"; // Replace with secure key logic

  // Redirect to sign-in page if no user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  if (!user) return <div>Loading...</div>; // Prevent rendering before redirect

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Chat header */}
      <div className="text-center py-4 bg-gray-950  text-white">
        <h1 className="text-2xl font-bold">Message Board</h1>
      </div>

      {/* Message list container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-950">
        <MessageList secretKey={secretKey} />
      </div>

      {/* Message form container */}
      <div className="bg-gray-800 p-4">
        <MessageForm secretKey={secretKey} />
      </div>
    </div>
  );
};

export default MessageBoard;
