"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { useFirebase } from "@/lib/firebase-provider"

// Define the Project type
export type Project = {
  id: string
  title: string
  description: string
  fullDescription?: string
  category: string
  image?: string
  technologies: string[]
  features?: string[]
  githubUrl?: string
  liveUrl?: string
}

// Sample projects data (fallback if Firebase fetch fails)
const sampleProjects: Project[] = [
  {
    id: "1",
    title: "Face Recognition Attendance System",
    description: "An AI-powered attendance system using facial recognition technology to automate attendance tracking.",
    fullDescription:
      "This system uses advanced facial recognition algorithms to identify students and mark their attendance automatically. It integrates with existing student databases and provides real-time reporting.",
    category: "ai",
    technologies: ["Python", "OpenCV", "TensorFlow", "Flask", "MySQL"],
    features: [
      "Facial recognition-based check-in/out",
      "Integration with student databases",
      "Real-time reporting and analytics",
    ],
    githubUrl: "https://github.com/yourusername/face-recognition-attendance",
    liveUrl: "https://demo-face-recognition.example.com",
  },
  {
    id: "2",
    title: "College ERP System",
    description: "A centralized system for managing student records, attendance, academic details, and faculty data.",
    fullDescription:
      "This comprehensive ERP system streamlines college administration by providing a unified platform for managing all aspects of student and faculty data, academic records, and administrative processes.",
    category: "web",
    technologies: ["Java", "Spring Boot", "PostgreSQL", "React.js"],
    features: ["Student and faculty dashboard", "Attendance and exam record management", "Secure access control"],
    githubUrl: "https://github.com/yourusername/college-erp",
    liveUrl: "https://college-erp-demo.example.com",
  },
  {
    id: "3",
    title: "Game Contest Website",
    description:
      "An online platform where users can participate in gaming competitions, track scores, and rank on leaderboards.",
    fullDescription:
      "This platform allows gamers to join tournaments, compete with others, and track their performance on global leaderboards. It features real-time score updates and social sharing capabilities.",
    category: "web",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
    features: [
      "User registration and profile management",
      "Tournament hosting and leaderboard system",
      "Real-time score updates",
    ],
    githubUrl: "https://github.com/yourusername/game-contest",
    liveUrl: "https://game-contest.example.com",
  },
  {
    id: "4",
    title: "Smart City Solution",
    description: "A secure citizen complaint & feedback platform for better urban governance.",
    fullDescription:
      "This platform enables citizens to submit complaints and feedback about city services and infrastructure issues. Government officials can track, manage, and resolve these issues efficiently.",
    category: "web",
    technologies: ["Python", "Django", "PostgreSQL", "React.js"],
    features: [
      "Secure complaint submission system",
      "Real-time issue tracking",
      "Data analytics for governance improvement",
    ],
    githubUrl: "https://github.com/yourusername/smart-city",
    liveUrl: "https://smart-city-demo.example.com",
  },
  {
    id: "5",
    title: "Fintech Tax Management Platform",
    description: "A centralized system for tax filing, processing, and compliance tracking.",
    fullDescription:
      "This platform simplifies tax management for individuals and businesses by automating tax calculations, facilitating secure filing, and ensuring compliance with tax regulations.",
    category: "web",
    technologies: ["Java", "Spring Boot", "MySQL", "React.js"],
    features: ["Secure tax filing", "Automated compliance checks", "Dashboard for tracking tax status"],
    githubUrl: "https://github.com/yourusername/tax-management",
    liveUrl: "https://tax-platform.example.com",
  },
  {
    id: "6",
    title: "GIS & Machine Learning Project",
    description: "A system integrating geospatial data with ML algorithms for predictive analysis.",
    fullDescription:
      "This innovative system combines geographic information systems (GIS) with machine learning to analyze spatial data and make predictions for urban planning, environmental monitoring, and resource management.",
    category: "ai",
    technologies: ["Python", "TensorFlow", "QGIS", "Flask"],
    features: [
      "Geospatial data processing",
      "Machine learning-based pattern detection",
      "Interactive data visualization",
    ],
    githubUrl: "https://github.com/yourusername/gis-ml-project",
    liveUrl: "https://gis-ml-demo.example.com",
  },
]

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { db } = useFirebase()

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Try to fetch from Firebase
        const projectsCollection = collection(db, "projects")
        const projectsSnapshot = await getDocs(projectsCollection)

        if (!projectsSnapshot.empty) {
          const projectsList = projectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Project[]

          setProjects(projectsList)
        } else {
          // If no data in Firebase, use sample data
          setProjects(sampleProjects)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
        setError(error as Error)
        // Fallback to sample data
        setProjects(sampleProjects)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [db])

  return { projects, loading, error }
}

