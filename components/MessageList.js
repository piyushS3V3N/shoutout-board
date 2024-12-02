"use client";
import { useEffect, useState } from "react";
import { db, collection, onSnapshot, query, orderBy } from "../utils/firebase"; // Import query and orderBy
import { decryptMessage } from "../utils/encryption"; // Decrypt the messages

const MessageList = ({ secretKey }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Set up Firestore real-time listener with ordering by timestamp
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp"), // Order messages by timestamp in ascending order
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const decryptedMessage = decryptMessage(data.message, secretKey); // Decrypt the message

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
  }, [secretKey]); // Re-run when the secretKey changes

  return (
    <div className="space-y-4 mt-4">
      {messages.map((msg) => (
        <div key={msg.id} className="p-2 border-b">
          <strong>
            {msg.userId === "anonymous" ? "Anonymous" : msg.userId}
          </strong>
          <p>{msg.message}</p>
          <span className="text-sm text-gray-500">
            {new Date(msg.timestamp).toLocaleString()}{" "}
            {/* Convert timestamp to readable format */}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
