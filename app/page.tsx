import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Resume from "@/components/resume"
import Contact from "@/components/contact"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Projects />
      <Resume />
      <Contact />
      <Toaster />
    </main>
  )
}

