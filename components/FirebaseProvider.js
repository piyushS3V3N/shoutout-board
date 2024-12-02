"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const AuthContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set persistence mode for keeping user logged in across sessions
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Listen to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false); // Stop loading when authentication state is checked
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting persistence: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or message
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a FirebaseProvider");
  }
  return context;
};
