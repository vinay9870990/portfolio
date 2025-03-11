"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileText, Calendar, Building } from "lucide-react"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineBody,
} from "@/components/ui/timeline"

export default function Resume() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const handleDownload = () => {
    // In a real implementation, this would download the actual resume file
    alert("Resume download functionality would be implemented here")
  }

  return (
    <section id="resume" className="py-16 md:py-24 bg-muted/30">
      <div className="section-container">
        <h2 className="section-title">Resume</h2>
        <p className="section-subtitle">My professional journey and experience in the tech industry.</p>

        <div className="flex justify-center mb-12">
          <Button size="lg" onClick={handleDownload}>
            <Download className="mr-2 h-5 w-5" /> Download Resume
          </Button>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          style={{
            transform: isInView ? "none" : "translateY(20px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
          }}
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" /> Education
              </h3>

              <Timeline>
                <TimelineItem>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon>
                      <Calendar className="h-4 w-4" />
                    </TimelineIcon>
                    <TimelineTitle>Master of Computer Applications (MCA)</TimelineTitle>
                  </TimelineHeader>
                  <TimelineBody>
                    <p className="text-muted-foreground">Graphic Era Hill University, 2024 - Present</p>
                    <p className="mt-2">
                      Specializing in advanced computing concepts with focus on AI, cloud computing, and software
                      development.
                    </p>
                  </TimelineBody>
                </TimelineItem>

                <TimelineItem>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon>
                      <Calendar className="h-4 w-4" />
                    </TimelineIcon>
                    <TimelineTitle>Bachelor of Computer Applications (BCA)</TimelineTitle>
                  </TimelineHeader>
                  <TimelineBody>
                    <p className="text-muted-foreground">Graphic Era Hill University, 2021 - 2024</p>
                    <p className="mt-2">
                      Graduated with honors, focusing on programming fundamentals, data structures, and web development.
                    </p>
                  </TimelineBody>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Building className="mr-2 h-5 w-5 text-primary" /> Experience
              </h3>

              <Timeline>
                <TimelineItem>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon>
                      <Calendar className="h-4 w-4" />
                    </TimelineIcon>
                    <TimelineTitle>Full-stack Developer</TimelineTitle>
                  </TimelineHeader>
                  <TimelineBody>
                    <p className="text-muted-foreground">Unified Mentor Private Limited, Jul 2024 - Oct 2024</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Developed responsive web applications using React.js</li>
                      <li>Implemented RESTful APIs using Node.js and Express</li>
                      <li>Worked with MongoDB for database management</li>
                    </ul>
                  </TimelineBody>
                </TimelineItem>

                <TimelineItem>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon>
                      <Calendar className="h-4 w-4" />
                    </TimelineIcon>
                    <TimelineTitle>Enterprise Resources Planning Specialist</TimelineTitle>
                  </TimelineHeader>
                  <TimelineBody>
                    <p className="text-muted-foreground">Rajan Trading Company, Nov 2024 - Jan 2025</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Implemented and optimized ERP solutions to streamline business operations</li>
  <li>Integrated ERP modules with existing systems for seamless data flow</li>
  <li>Customized ERP functionalities to meet company-specific requirements</li>
  <li>Worked with databases to manage and analyze business data efficiently</li>
  <li>Provided training and support to users for ERP adoption</li>
                    </ul>
                  </TimelineBody>
                </TimelineItem>

                <TimelineItem>
                  <TimelineHeader>
                    <TimelineIcon>
                      <Calendar className="h-4 w-4" />
                    </TimelineIcon>
                    <TimelineTitle>Freelance Developer</TimelineTitle>
                  </TimelineHeader>
                  <TimelineBody>
                    <p className="text-muted-foreground">Self-employed, 2021 - 2022</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Developed custom websites for small businesses</li>
                      <li>Created mobile applications using React Native</li>
                      <li>Implemented database solutions using MySQL and Firebase</li>
                    </ul>
                  </TimelineBody>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

