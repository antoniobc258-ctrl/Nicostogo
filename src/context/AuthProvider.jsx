// src/context/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

async function ensureUserProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || "",
      email: user.email || "",
      createdAt: serverTimestamp(),
      hasUsedWelcomePromo: false, // 🔥 promo de bienvenida
      segment: "welcome",
    });
  }
  return (await getDoc(ref)).data();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) setProfile(await ensureUserProfile(u));
        else setProfile(null);
        setLoading(false);
      }),
    []
  );

  const loginGoogle = async () => {
    const prov = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, prov);
    const p = await ensureUserProfile(res.user);
    setProfile(p);
  };

  const registerEmail = (email, pass) =>
    createUserWithEmailAndPassword(auth, email, pass);
  const loginEmail = (email, pass) =>
    signInWithEmailAndPassword(auth, email, pass);
  const logout = () => signOut(auth);

  return (
    <Ctx.Provider
      value={{ user, profile, loading, loginGoogle, loginEmail, registerEmail, logout }}
    >
      {children}
    </Ctx.Provider>
  );
}
