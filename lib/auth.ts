import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { auth } from "./firebase";

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
