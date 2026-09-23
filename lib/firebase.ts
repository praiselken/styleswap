import { initializeApp, getApps, getApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const useEmulators = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "true";

function required(name: string, value: string | undefined) {
  // The emulators accept any non-empty config, so don't demand real credentials.
  if (useEmulators) return value || "demo-value";

  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill in the Firebase config.`
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: required("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: required("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: required("NEXT_PUBLIC_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: required("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: required("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: required("NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

// Prevent re-initialising on hot reload (Next dev mode)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Point every SDK at the local emulator suite. Guarded by a module-level flag
// because these throw if called twice, and Next's dev server re-evaluates
// modules on hot reload.
declare global {
  var __firebaseEmulatorsConnected: boolean | undefined;
}

if (useEmulators && !globalThis.__firebaseEmulatorsConnected) {
  globalThis.__firebaseEmulatorsConnected = true;

  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

export default app;
