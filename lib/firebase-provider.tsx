"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, type User } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

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

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Create context
type FirebaseContextType = {
  auth: ReturnType<typeof getAuth>
  db: ReturnType<typeof getFirestore>
  storage: ReturnType<typeof getStorage>
  user: User | null
  loading: boolean
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

// Provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <FirebaseContext.Provider value={{ auth, db, storage, user, loading }}>{children}</FirebaseContext.Provider>
}

// Hook to use the Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

