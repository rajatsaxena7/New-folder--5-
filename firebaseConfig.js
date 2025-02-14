const admin = require("firebase-admin");

// Decode Base64 Service Account JSON from Environment Variables
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!serviceAccountBase64) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_BASE64 is missing in environment variables"
  );
}

// Convert Base64 to JSON
const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://varthajanapadanewsapp.firebasestorage.app", // 🔹 Replace with your Firebase bucket name
});

// Export Firebase Storage Bucket
const bucket = admin.storage().bucket();

module.exports = bucket;
