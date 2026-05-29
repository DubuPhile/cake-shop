import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath =
  process.env.NODE_ENV === "production"
    ? "/etc/secrets/FirebaseKey.json"
    : "../../FirebaseKey.json";

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "cake-shop-bce38.firebasestorage.app",
  });
}

export const bucket = admin.storage().bucket();
export default admin;
