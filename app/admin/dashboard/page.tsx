"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFirebase } from "@/lib/firebase-provider"
import { signOut } from "firebase/auth"
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Loader2, LogOut, Plus, Trash, Edit, Eye, MessageSquare, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/lib/hooks/use-projects"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects")
  const [projects, setProjects] = useState<Project[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { auth, db, storage, user, loading: authLoading } = useFirebase()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !user) {
      router.push("/admin")
    } else if (user) {
      fetchData()
    }
  }, [user, authLoading, router])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch projects
      const projectsSnapshot = await getDocs(collection(db, "projects"))
      const projectsList = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[]
      setProjects(projectsList)

      // Fetch contacts
      const contactsSnapshot = await getDocs(collection(db, "contacts"))
      const contactsList = contactsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setContacts(contactsList)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/admin")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="projects" className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" /> Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Projects</h2>
              <AddProjectDialog onProjectAdded={fetchData} />
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onDelete={fetchData} onEdit={fetchData} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Contact Messages</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : contacts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">No messages yet.</CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{contact.subject}</CardTitle>
                          <CardDescription>
                            From: {contact.name} ({contact.email})
                          </CardDescription>
                        </div>
                        <Badge variant={contact.status === "unread" ? "default" : "outline"}>
                          {contact.status === "unread" ? "Unread" : "Read"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{contact.message}</p>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, "contacts", contact.id), {
                                status: contact.status === "unread" ? "read" : "unread",
                              })
                              fetchData()
                            } catch (error) {
                              console.error("Error updating message status:", error)
                            }
                          }}
                        >
                          Mark as {contact.status === "unread" ? "Read" : "Unread"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            try {
                              await deleteDoc(doc(db, "contacts", contact.id))
                              fetchData()
                              toast({
                                title: "Message deleted",
                                description: "The message has been deleted successfully",
                              })
                            } catch (error) {
                              console.error("Error deleting message:", error)
                              toast({
                                title: "Error",
                                description: "Failed to delete message",
                                variant: "destructive",
                              })
                            }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProjectCard({ project, onDelete, onEdit }) {
  const { db } = useFirebase()
  const { toast } = useToast()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      setDeleting(true)
      try {
        await deleteDoc(doc(db, "projects", project.id))
        toast({
          title: "Project deleted",
          description: "The project has been deleted successfully",
        })
        onDelete()
      } catch (error) {
        console.error("Error deleting project:", error)
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        })
      } finally {
        setDeleting(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{project.title}</span>
          <Badge>{project.category}</Badge>
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`#projects-${project.id}`} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4" />
            </a>
          </Button>
          <EditProjectDialog project={project} onProjectEdited={onEdit} />
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AddProjectDialog({ onProjectAdded }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "web",
    technologies: "",
    features: "",
    githubUrl: "",
    liveUrl: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { db, storage } = useFirebase()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ""

      // Upload image if selected
      if (imageFile) {
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`)
        const snapshot = await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      // Prepare project data
      const projectData = {
        title: formData.title,
        description: formData.description,
        fullDescription: formData.fullDescription,
        category: formData.category,
        technologies: formData.technologies.split(",").map((tech) => tech.trim()),
        features: formData.features.split(",").map((feature) => feature.trim()),
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl,
        image: imageUrl,
        createdAt: serverTimestamp(),
      }

      // Add to Firestore
      await addDoc(collection(db, "projects"), projectData)

      toast({
        title: "Project added",
        description: "The project has been added successfully",
      })

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        fullDescription: "",
        category: "web",
        technologies: "",
        features: "",
        githubUrl: "",
        liveUrl: "",
      })
      setImageFile(null)
      setOpen(false)
      onProjectAdded()
    } catch (error) {
      console.error("Error adding project:", error)
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>Fill in the details to add a new project to your portfolio.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="web">Web</option>
                <option value="ai">AI/ML</option>
                <option value="mobile">Mobile</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              className="min-h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Authentication, Real-time updates"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/yourusername/project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://project-demo.example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditProjectDialog({ project, onProjectEdited }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    fullDescription: project.fullDescription || "",
    category: project.category,
    technologies: project.technologies.join(", "),
    features: project.features?.join(", ") || "",
    githubUrl: project.githubUrl || "",
    liveUrl: project.liveUrl || "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { db, storage } = useFirebase()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = project.image || ""

      // Upload new image if selected
      if (imageFile) {
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`)
        const snapshot = await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      // Prepare project data
      const projectData = {
        title: formData.title,
        description: formData.description,
        fullDescription: formData.fullDescription,
        category: formData.category,
        technologies: formData.technologies.split(",").map((tech) => tech.trim()),
        features: formData.features.split(",").map((feature) => feature.trim()),
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl,
        image: imageUrl,
        updatedAt: serverTimestamp(),
      }

      // Update in Firestore
      await updateDoc(doc(db, "projects", project.id), projectData)

      toast({
        title: "Project updated",
        description: "The project has been updated successfully",
      })

      setOpen(false)
      onProjectEdited()
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update the details of your project.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Project Title</Label>
              <Input id="edit-title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="web">Web</option>
                <option value="ai">AI/ML</option>
                <option value="mobile">Mobile</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Short Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-fullDescription">Full Description</Label>
            <Textarea
              id="edit-fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              className="min-h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-technologies">Technologies (comma-separated)</Label>
              <Input
                id="edit-technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-features">Features (comma-separated)</Label>
              <Input id="edit-features" name="features" value={formData.features} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-githubUrl">GitHub URL</Label>
              <Input id="edit-githubUrl" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-liveUrl">Live Demo URL</Label>
              <Input id="edit-liveUrl" name="liveUrl" value={formData.liveUrl} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image">Project Image</Label>
            {project.image && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">Current image: {project.image.split("/").pop()}</p>
              </div>
            )}
            <Input id="edit-image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

