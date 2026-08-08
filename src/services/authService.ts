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

export async function sendAdminMagicLink(email: string): Promise<void> {
  const actionCodeSettings = {
    url: `${window.location.origin}/admin`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email);
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

  const result = await signInWithEmailLink(auth, email, url);
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