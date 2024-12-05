"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../components/FirebaseProvider";
import { db } from "../../../utils/firebase"; // Firestore functions
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import Image from "next/image"; // Import Image for profile picture
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const UserManagement = () => {
  const { user } = useAuth(); // Get the current user from context
  const [icon, setIcon] = useState(null); // The selected file for icon
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [showUsername, setShowUsername] = useState(false); // To toggle between showing username or user ID
  const [userIcon, setUserIcon] = useState("/default.png"); // Default icon

  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    // Fetch the user data (name and icon) from Firestore on component mount
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "user_info", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || ""); // Set the username from Firestore if exists
          setUserIcon(userData.icon || "/default.png"); // Set the user icon (or default if not set)
          setShowUsername(userData.showUsername || false); // Set the showUsername flag from Firestore
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setError("File size should be less than 5MB.");
        setIcon(null);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        setIcon(null);
        return;
      }
      setError(null);
      setIcon(file);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleShowUsernameChange = (e) => {
    setShowUsername(e.target.checked);
  };

  // Convert image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);

    try {
      // Save both username and profile icon (if changed) to Firestore in the 'user_info' collection
      const updatedData = {
        username: username,
        showUsername: showUsername,
      };

      // If an icon was selected, convert it to base64 and add to Firestore data
      if (icon) {
        const base64Icon = await convertToBase64(icon);
        updatedData.icon = base64Icon;
        setUserIcon(base64Icon); // Update the local state with the new icon URL
      }

      // Update Firestore document for the user
      await setDoc(doc(db, "user_info", user.uid), updatedData, {
        merge: true,
      });

      setLoading(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setLoading(false);
      setError("Failed to update the profile.");
      console.error(err);
    }
  };

  const handleBack = () => {
    router.push("/message-board"); // Navigate back to the message board
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Your Profile</h2>

      {/* Display User Icon */}
      <div className="mt-4 flex items-center space-x-2">
        <Image
          src={userIcon}
          alt="User Avatar"
          width={100} // Set width
          height={100} // Set height
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
        <strong className="text-lg">
          {showUsername ? username || "Anonymous" : user.uid}
        </strong>
      </div>

      {/* Input for username */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          className="w-full p-2 border rounded-md bg-white"
          placeholder="Enter your username"
        />
      </div>

      {/* Checkbox for toggling between showing username or userId */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          id="showUsername"
          checked={showUsername}
          onChange={handleShowUsernameChange}
          className="h-4 w-4 text-blue-500"
        />
        <label htmlFor="showUsername" className="text-sm">
          Show username instead of user ID
        </label>
      </div>

      {/* File input for selecting the icon */}
      <div className="mb-4">
        <label htmlFor="icon" className="block text-sm font-medium mb-1">
          Upload Profile Icon
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="icon"
          className="mb-4"
        />
        {icon && (
          <div>
            <p className="text-sm text-green-500">File selected: {icon.name}</p>
            <Image
              src={URL.createObjectURL(icon)} // Preview the image immediately after selection
              alt="Profile Preview"
              width={100} // Set width
              height={100} // Set height
              className="mt-2 rounded-full border-2 border-gray-300"
            />
          </div>
        )}
      </div>

      {/* Display any error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Save Changes Button for username and icon */}
      <button
        onClick={handleSaveChanges}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 mb-4"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
      <div />
      {/* Back Button to navigate to message board */}
      <button
        onClick={handleBack}
        className="bg-gray-500 text-white p-2 rounded mb-4"
      >
        Back to Message Board
      </button>
    </div>
  );
};

export default UserManagement;
