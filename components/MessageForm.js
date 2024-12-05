"use client";

import { useState } from "react";
import { db } from "../utils/firebase";
import { encryptMessage } from "../utils/encryption";
import { useAuth } from "./FirebaseProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image"; // Import Next.js Image component

const MessageForm = ({ secretKey }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null); // State to hold image data
  const { user } = useAuth(); // Access user context

  // Convert image file to Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Base64 result
      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert the file to Base64
    });
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!message.trim() && !image) return; // Don't send empty messages

    let media = null;

    if (image) {
      try {
        // Convert the image to Base64
        media = await convertImageToBase64(image);
      } catch (err) {
        console.error("Error converting image to Base64:", err);
        return;
      }
    }

    const encryptedMessage = encryptMessage(message, secretKey);

    try {
      await addDoc(collection(db, "messages"), {
        message: encryptedMessage,
        media, // Store image data as Base64 (media)
        userId: user?.uid || "anonymous", // Use "anonymous" if user is not logged in
        timestamp: serverTimestamp(),
      });

      setMessage(""); // Clear message input
      setImage(null); // Clear image state
    } catch (err) {
      console.error("Error sending message: ", err);
    }
  };

  // Handle image file input change
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the first file from the input
    if (file) {
      setImage(file); // Set the selected image file
    }
  };

  // Handle image paste from clipboard
  const handlePaste = async (e) => {
    const clipboardData = e.clipboardData || e.originalEvent.clipboardData;
    const items = clipboardData.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            setImage(file); // Set the pasted image
          }
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-col w-full space-y-4 relative"
      onPaste={handlePaste} // Handle pasting images
    >
      <div className="flex items-center w-full max-w-sm space-x-2">
        {/* Message input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-teal-500 hover:border-teal-300 shadow-sm focus:shadow"
          placeholder="Type your message..."
        />

        {/* Custom File Upload Button */}
        <div className="relative">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUploadInput"
          />
          {/* Custom Upload Button with Image Icon */}
          <label
            htmlFor="imageUploadInput"
            className="flex items-center justify-center bg-gray-600 text-white p-3 rounded-full cursor-pointer transition hover:bg-gray-500"
            title="Upload an Image"
          >
            📷 {/* Camera Icon */}
          </label>
        </div>

        {/* Send button */}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Send
        </button>
      </div>

      {/* Display selected image preview */}
      {image && (
        <div className="mt-2 flex justify-center">
          <Image
            src={URL.createObjectURL(image)} // Generate the preview URL for the image
            alt="Selected preview"
            width={300} // Set width for the image
            height={200} // Set height for the image
            className="object-contain rounded"
          />
        </div>
      )}
    </form>
  );
};

export default MessageForm;
