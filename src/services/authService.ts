import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink as firebaseIsSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, TrustedDevice } from "./firebase";

const TRUSTED_DEVICE_KEY = "m1yuki_trusted_device_token";
const EMAIL_FOR_SIGN_IN_KEY = "m1yuki_email_for_signin";

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const ALLOWED_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

export async function sendAdminMagicLink(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  
  if (ALLOWED_ADMIN_EMAIL && normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
    throw new Error("Unauthorized email address. Magic link request denied.");
  }

  const actionCodeSettings = {
    url: `${window.location.origin}/admin`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, normalizedEmail, actionCodeSettings);
  localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, normalizedEmail);
}

export function isSignInWithEmailLink(url: string = window.location.href): boolean {
  return firebaseIsSignInWithEmailLink(auth, url);
}

export async function verifyAdminMagicLink(url: string = window.location.href): Promise<User | null> {
  if (!isSignInWithEmailLink(url)) return null;

  let email = localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
  if (!email) {
    email = window.prompt("Please enter your admin email for confirmation:");
  }

  if (!email) throw new Error("Email is required for authentication verification.");

  const normalizedEmail = email.trim().toLowerCase();
  if (ALLOWED_ADMIN_EMAIL && normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
    throw new Error("Unauthorized admin user.");
  }

  const result = await signInWithEmailLink(auth, normalizedEmail, url);
  
  if (ALLOWED_ADMIN_EMAIL && result.user.email?.toLowerCase() !== ALLOWED_ADMIN_EMAIL) {
    await signOut(auth);
    throw new Error("Access Denied: Unrecognized email account.");
  }

  localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
  return result.user;
}

export async function verifyDeviceTrust(userId: string): Promise<boolean> {
  const deviceToken = localStorage.getItem(TRUSTED_DEVICE_KEY);
  if (!deviceToken) return false;

  const tokenHash = await hashToken(deviceToken);
  const deviceRef = doc(db, "admin_devices", `${userId}_${tokenHash.substring(0, 16)}`);
  const deviceSnap = await getDoc(deviceRef);

  if (!deviceSnap.exists()) return false;

  const data = deviceSnap.data() as TrustedDevice;
  if (data.tokenHash === tokenHash) {
    await updateDoc(deviceRef, { lastUsedAt: new Date().toISOString() });
    return true;
  }

  return false;
}

export async function registerTrustedDevice(userId: string): Promise<string> {
  const deviceToken = `dt_${crypto.randomUUID()}_${Date.now()}`;
  const tokenHash = await hashToken(deviceToken);
  const deviceRef = doc(db, "admin_devices", `${userId}_${tokenHash.substring(0, 16)}`);

  const deviceData: TrustedDevice = {
    tokenHash,
    createdAt: new Date().toISOString(),
    lastUsedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  await setDoc(deviceRef, deviceData);
  localStorage.setItem(TRUSTED_DEVICE_KEY, deviceToken);
  return deviceToken;
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}