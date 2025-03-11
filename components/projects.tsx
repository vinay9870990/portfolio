"use client"

import { useState, useRef } from "react"
import { useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, ExternalLink, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample projects data
const projects = [
  {
    id: "1",
    title: "Face Recognition Attendance System",
    description: "An AI-powered attendance system using facial recognition technology to automate attendance tracking.",
    fullDescription:
      "This system uses advanced facial recognition algorithms to identify students and mark their attendance automatically. It integrates with existing student databases and provides real-time reporting.",
    category: "ai",
    image: "/placeholder.svg?height=300&width=600",
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
    image: "/placeholder.svg?height=300&width=600",
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
    image: "/placeholder.svg?height=300&width=600",
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
    image: "/placeholder.svg?height=300&width=600",
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
    image: "/placeholder.svg?height=300&width=600",
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
    image: "/placeholder.svg?height=300&width=600",
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

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const filteredProjects = activeTab === "all" ? projects : projects.filter((project) => project.category === activeTab)

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">My Projects</h2>
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Explore my portfolio of projects showcasing my technical skills and problem-solving abilities.
        </p>

        <Tabs defaultValue="all" className="w-full max-w-3xl mx-auto mb-12">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="ai" onClick={() => setActiveTab("ai")}>
              AI/ML
            </TabsTrigger>
            <TabsTrigger value="web" onClick={() => setActiveTab("web")}>
              Web
            </TabsTrigger>
            <TabsTrigger value="mobile" onClick={() => setActiveTab("mobile")}>
              Mobile
            </TabsTrigger>
            <TabsTrigger value="other" onClick={() => setActiveTab("other")}>
              Other
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{
            transform: isInView ? "none" : "translateY(20px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
          }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={project.image || "/placeholder.svg?height=192&width=384"}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge variant="outline">{project.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          {project.githubUrl && (
            <Button variant="outline" size="icon" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline" size="icon" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <Eye className="mr-2 h-4 w-4" /> Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{project.title}</DialogTitle>
              <DialogDescription>{project.category} Project</DialogDescription>
            </DialogHeader>
            <div className="relative h-64 w-full mt-4">
              <Image
                src={project.image || "/placeholder.svg?height=256&width=768"}
                alt={project.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="space-y-4 mt-4">
              <p>{project.fullDescription || project.description}</p>

              <div>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {project.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tech Stack:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {project.githubUrl && (
                  <Button asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> View Code
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

