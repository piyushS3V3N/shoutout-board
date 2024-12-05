"use client";
import { useEffect, useRef, useState } from "react";
import {
  db,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDocs,
} from "../utils/firebase"; // Firestore imports
import { decryptMessage } from "../utils/encryption"; // Decrypt the messages
import { useAuth } from "./FirebaseProvider"; // Assuming you're using FirebaseProvider for user context
import Image from "next/image"; // Import Image component from Next.js

const MessageList = () => {
  const { user } = useAuth(); // Get current user from context
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({}); // Store user info (username and icon)
  const messagesEndRef = useRef(null); // Ref to scroll to the last message

  useEffect(() => {
    // Fetch the user info (username and icon) for all users when the component mounts
    const fetchUserInfo = async () => {
      const usersSnapshot = await getDocs(collection(db, "user_info"));
      const userData = {};
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        userData[doc.id] = {
          username: data.username || "Anonymous", // Set default to "Anonymous" if no username
          icon: data.icon || "/default.png", // Fallback to default icon if no icon is set
          showUsername: data.showUsername || false, // Default to false if showUsername is not set
        };
      });
      setUserInfo(userData);
    };

    fetchUserInfo();

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
          media: data.media || null, // Add media field if it exists
          userId: data.userId,
          timestamp,
        };
      });
      setMessages(fetchedMessages); // Update the state with the new messages
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Runs every time messages are updated

  return (
    <div className="space-y-4 mt-4 flex-row-reverse overflow-y-auto">
      {messages.map((msg) => {
        const user = userInfo[msg.userId] || {};
        const { username, icon, showUsername } = user;

        return (
          <div
            key={msg.id}
            className={`p-4 border-2 rounded-lg shadow-md ${
              msg.userId === user?.uid
                ? "bg-blue-600 text-white" // Current user's messages in blue (darker)
                : "bg-teal-0 text-gray-800" // Other users' messages in light teal
            }`}
          >
            <div className="mt-4 flex items-center space-x-2">
              {/* User icon */}
              <Image
                src={icon || "/default.png"} // Fallback to a default avatar
                alt="User Avatar"
                width={32} // Set width for Image component
                height={32} // Set height for Image component
                className=" rounded-full border-2 border-gray-300 " // Ensure fixed size and round shape
              />
              <strong className="text-lg">
                {showUsername ? username : msg.userId}
              </strong>
            </div>
            {/* Separator */}
            <br />
            {/* Message content */}
            <p className="mb-2 text-m leading-relaxed "> {msg.message}</p>{" "}
            {/* Ensured readability of text */}
            {/* Render image if the message has media (Base64) */}
            {msg.media && (
              <div className="mt-2 flex justify-center">
                <Image
                  src={msg.media} // Base64 image data
                  alt="Message Media"
                  width={400} // Set a width for the media image
                  height={200} // Set a height for the media image
                  className="object-contain rounded"
                />
              </div>
            )}
            <span className="text-xs text-gray-400">
              {new Date(msg.timestamp).toLocaleString()}{" "}
              {/* Convert timestamp to readable format */}
            </span>
          </div>
        );
      })}

      {/* Empty div at the bottom to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
