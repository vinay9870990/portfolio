"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Code, Database, Cloud, Shield, Server, Brain, Award, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const skills = [
  {
    category: "Programming Languages",
    items: ["C", "C++", "Java", "Python"],
    icon: <Code className="h-6 w-6 text-primary" />,
  },
  {
    category: "Backend Development",
    items: ["Node.js", "Django", "Spring Boot"],
    icon: <Server className="h-6 w-6 text-primary" />,
  },
  {
    category: "Databases",
    items: ["MySQL", "PostgreSQL", "MongoDB"],
    icon: <Database className="h-6 w-6 text-primary" />,
  },
  {
    category: "AI & ML",
    items: ["TensorFlow", "Scikit-learn", "OpenCV"],
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
  {
    category: "Cloud Platforms",
    items: ["AWS", "Google Cloud", "Azure"],
    icon: <Cloud className="h-6 w-6 text-primary" />,
  },
  {
    category: "Cybersecurity & DevOps",
    items: ["Docker", "Kubernetes", "CI/CD"],
    icon: <Shield className="h-6 w-6 text-primary" />,
  },
]

const interests = [
  "AI & Machine Learning",
  "Backend System Architecture",
  "Geographic Information Systems (GIS) with AI",
  "Fintech & Secure Digital Solutions",
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="section-container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">
          Get to know my background, skills, and what drives me in the world of technology.
        </p>

        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12"
          style={{
            transform: isInView ? "none" : "translateY(20px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
          }}
        >
          <div>
            <h3 className="text-2xl font-bold mb-6">Education</h3>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  MCA (Master of Computer Applications)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Currently pursuing my Master's degree with a focus on advanced computing concepts.
                </p>
                <h4 className="font-semibold mb-2">Relevant Coursework:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Software Engineering</li>
                  <li>Data Structures</li>
                  <li>AI & ML</li>
                  <li>Cloud Computing</li>
                  <li>Cybersecurity</li>
                </ul>
              </CardContent>
            </Card>

            <h3 className="text-2xl font-bold mt-12 mb-6">Certifications & Achievements</h3>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Professional Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">AWS Certified Developer</p>
                      <p className="text-sm text-muted-foreground">Amazon Web Services</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">TensorFlow Developer Certificate</p>
                      <p className="text-sm text-muted-foreground">Google</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Java Programming Certification</p>
                      <p className="text-sm text-muted-foreground">Oracle</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {skill.icon}
                      {skill.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skill.items.map((item, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="text-2xl font-bold mt-12 mb-6">Interests</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

