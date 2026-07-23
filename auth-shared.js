// =====================================================================
// AUTH-SHARED.JS — module Firebase Auth partagé entre index.html et
// compte.html. Comme les deux pages sont sur le même domaine et
// utilisent le même projet Firebase, l'utilisateur connecté sur l'une
// est automatiquement reconnu comme connecté sur l'autre (persistance
// locale gérée nativement par Firebase Auth).
// =====================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  linkWithPopup,
  unlink,
  browserLocalPersistence,
  setPersistence
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// Votre configuration Firebase (identique sur les deux pages)
const firebaseConfig = {
  apiKey: "AIzaSyB3ZQdUpqVcKy_q658r6HAnxww2e0vqGVg",
  authDomain: "thesavagerebels-a807c.firebaseapp.com",
  projectId: "thesavagerebels-a807c",
  storageBucket: "thesavagerebels-a807c.firebasestorage.app",
  messagingSenderId: "575856596567",
  appId: "1:575856596567:web:ef224c07276f9df7613512"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Persistance locale : la session reste active tant que l'utilisateur
// ne se déconnecte pas explicitement, et est partagée par toutes les
// pages du même domaine (index.html <-> compte.html).
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Fournisseurs OAuth disponibles
const providers = {
  google: new GoogleAuthProvider(),
  facebook: new FacebookAuthProvider(),
  github: new GithubAuthProvider(),
  yahoo: new OAuthProvider('yahoo.com'),
  microsoft: new OAuthProvider('microsoft.com'),
  apple: new OAuthProvider('apple.com')
};

export {
  auth,
  providers,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  linkWithPopup,
  unlink
};
