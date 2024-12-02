"use client";

import { useState } from "react";
import { db } from "../utils/firebase";
import { encryptMessage } from "../utils/encryption";
import { useAuth } from "./FirebaseProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MessageForm = ({ secretKey }) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth(); // This should now correctly access the user context

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const encryptedMessage = encryptMessage(message, secretKey);
    try {
      await addDoc(collection(db, "messages"), {
        message: encryptedMessage,
        userId: user?.uid || "anonymous", // Use anonymous if user is not defined
        timestamp: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send message: ", err);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 rounded-md bg-black  border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        placeholder="Type your message..."
      />{" "}
      <button
        className="bg-green-500 text-white p-2 ml-2 rounded"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default MessageForm;
