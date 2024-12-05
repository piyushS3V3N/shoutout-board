import CryptoJS from "crypto-js";
// Encrypt message using the SECRET_KEY from environment variables
export const encryptMessage = (message) => {
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY; // Access the secret key from environment variable
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not set in the environment variables");
  }

  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

// Decrypt message using the SECRET_KEY from environment variables
export const decryptMessage = (ciphertext) => {
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY; // Access the secret key from environment variable
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not set in the environment variables");
  }

  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
