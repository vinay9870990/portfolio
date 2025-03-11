"use server"

import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8zTEVaUlzt_2yBCiFbr1x4PLAcXLLilI",
  authDomain: "portfolio-7b282.firebaseapp.com",
  projectId: "portfolio-7b282",
  storageBucket: "portfolio-7b282.firebasestorage.app",
  messagingSenderId: "409826359452",
  appId: "1:409826359452:web:33dfb0583c07ec555a5559",
  measurementId: "G-WHD2PZ42P0",
}

// Initialize Firebase for server actions
const app = initializeApp(firebaseConfig, "server-action")
const db = getFirestore(app)

// Send contact form data to Firebase
export async function sendContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const contactsRef = collection(db, "contacts")
    await addDoc(contactsRef, {
      ...formData,
      createdAt: serverTimestamp(),
      status: "unread",
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending contact form:", error)
    throw new Error("Failed to send message")
  }
}

// Admin functions (protected by authentication)
export async function getContactMessages() {
  // This would be protected by authentication in a real implementation
  // For now, we'll just return a placeholder
  return { messages: [] }
}

