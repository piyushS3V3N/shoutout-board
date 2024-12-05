"use client";
import { useEffect, useRef, useState } from "react";
import { db, collection, onSnapshot, query, orderBy } from "../utils/firebase"; // Import query and orderBy
import { decryptMessage } from "../utils/encryption"; // Decrypt the messages
import { useAuth } from "./FirebaseProvider"; // Assuming you're using FirebaseProvider for user context

const MessageList = () => {
  const { user } = useAuth(); // Get current user from context
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Ref to scroll to the last message

  useEffect(() => {
    // Set up Firestore real-time listener with ordering by timestamp
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp"), // Order messages by timestamp in ascending order
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const decryptedMessage = decryptMessage(data.message); // Decrypt the message

        // Safely access the timestamp field
        const timestamp = data.timestamp
          ? data.timestamp.seconds * 1000
          : Date.now(); // Default to current time if timestamp is missing or invalid

        return {
          id: doc.id,
          message: decryptedMessage,
          userId: data.userId,
          timestamp,
        };
      });
      setMessages(fetchedMessages); // Update the state with the new messages
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }); // Re-run when the secretKey changes

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Runs every time messages are updated

  return (
    <div className="space-y-4 mt-4 flex-row-reverse overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-4 border-2 rounded-lg shadow-md ${
            msg.userId === user?.uid
              ? "bg-blue-500 text-white" // Current user's messages in blue
              : "bg-teal-50 text-white" // Other users' messages in gray
          }`}
        >
          <div className="mb-2">
            <strong>
              {msg.userId === "anonymous" ? "Anonymous" : msg.userId}
            </strong>
          </div>
          <p className="mb-2">{msg.message}</p>
          <span className="text-sm text-gray-400">
            {new Date(msg.timestamp).toLocaleString()}{" "}
            {/* Convert timestamp to readable format */}
          </span>
        </div>
      ))}

      {/* Empty div at the bottom to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
