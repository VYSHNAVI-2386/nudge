import admin from "firebase-admin";

let initialized = false;

function init() {
  if (initialized || !process.env.FIREBASE_PROJECT_ID) return;
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  initialized = true;
}

export async function sendPushNotification(token: string, payload: { title: string; body: string }) {
  try {
    init();
    await admin.messaging().send({ token, notification: payload });
  } catch (err) {
    console.error("FCM error:", err);
  }
}