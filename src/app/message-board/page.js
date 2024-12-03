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

  useEffect(() => {
    if (!user) {
      router.push("/signin"); // Redirect to sign-in if no user
    }
  }, [user, router]);

  if (!user) return <div>Loading...</div>; // Prevent rendering before redirect

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Message Board</h1>
      <MessageForm secretKey={secretKey} />
      <MessageList secretKey={secretKey} />
    </div>
  );
};

export default MessageBoard;
