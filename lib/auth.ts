import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { ensureUserProfile } from "./users";

/**
 * Returns the current user, signing in anonymously if nobody is signed in.
 *
 * Anonymous sessions give listings a real, stable sellerId before the login
 * and registration screens exist. When those land, linking a credential to the
 * anonymous account keeps the same uid, so listings created now stay attached
 * to their seller.
 */
export function ensureSignedIn(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
          return;
        }

        signInAnonymously(auth).catch((error) => {
          unsubscribe();
          reject(error);
        });
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

/** Notifies `callback` of the signed-in user, treating anonymous sessions as signed out. */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user && !user.isAnonymous ? user : null);
  });
}

/**
 * Registers a new account. If the current session is anonymous, links the
 * credential to it instead of creating a fresh user, so any listings already
 * published under that anonymous uid stay attached to the new account.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  name: string
): Promise<User> {
  const current = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);
  let user: User;

  if (current?.isAnonymous) {
    try {
      user = (await linkWithCredential(current, credential)).user;
    } catch (error) {
      // Someone already owns this email — fall through to a normal sign-up,
      // which surfaces the "already in use" error the same way it would if
      // there had been no anonymous session at all.
      if (!(error instanceof FirebaseError) || error.code !== "auth/email-already-in-use") {
        throw error;
      }
      user = (await createUserWithEmailAndPassword(auth, email, password)).user;
    }
  } else {
    user = (await createUserWithEmailAndPassword(auth, email, password)).user;
  }

  await updateProfile(user, { displayName: name });
  await ensureUserProfile(user.uid, name);
  return user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export function signOutUser(): Promise<void> {
  return signOut(auth);
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account already exists for that email — try logging in instead.",
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/weak-password": "Choose a password with at least 6 characters.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts — please wait a moment and try again.",
};

export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? "Something went wrong. Please try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
