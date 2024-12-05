"use client";

import { useState } from "react";
import { db } from "../utils/firebase";
import { encryptMessage } from "../utils/encryption";
import { useAuth } from "./FirebaseProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Picker } from "emoji-mart"; // Import emoji picker

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Show emoji picker state
  const { user } = useAuth(); // Access user context

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!message.trim()) return; // Don't send empty messages

    const encryptedMessage = encryptMessage(message);
    try {
      await addDoc(collection(db, "messages"), {
        message: encryptedMessage,
        userId: user?.uid || "anonymous", // Use "anonymous" if user is not logged in
        timestamp: serverTimestamp(),
      });
      setMessage(""); // Clear the message input after sending
    } catch (err) {
      console.error("Failed to send message: ", err);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native); // Add emoji to message
    setShowEmojiPicker(false); // Close the emoji picker after selection
  };

  // Toggle emoji picker visibility
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-col w-full space-y-4 relative"
    >
      <div className="flex items-center w-full space-x-2">
        {/* Emoji button */}
        <button
          type="button"
          className="bg-gray-600 text-white p-2 rounded"
          onClick={toggleEmojiPicker} // Toggling the emoji picker
        >
          😀
        </button>

        {/* Message input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded-md bg-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Type your message..."
        />

        {/* Send button */}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Send
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute z-10 mt-2 w-full max-w-xs">
          <Picker onSelect={handleEmojiSelect} />
        </div>
      )}
    </form>
  );
};

export default MessageForm;
