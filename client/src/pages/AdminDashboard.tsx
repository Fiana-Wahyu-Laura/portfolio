import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { PageLayout } from "../components/ui/layout";
import { Alert } from "@/components/ui/alert";
import { useLocation } from "wouter";

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
}

interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
  image?: string;
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
}

interface ProfileSettings {
  profileImage: string;
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    linkedin: string;
    github: string;
    instagram: string;
  };
  skills: string[];
  resume: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("articles");
  const [message, setMessage] = useState({ type: "", text: "" });

  // States for data
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Helper to convert Google Drive URL to direct image URL for both submission and rendering
  const convertGoogleDriveUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('drive.google.com')) {
      const fileMatch = url.match(/\/file\/d\/([^\/\?]+)/);
      if (fileMatch && fileMatch[1]) return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1000`;
      
      const idMatch = url.match(/[\?&]id=([^&]+)/);
      if (idMatch && idMatch[1]) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
    return url;
  };

  // States for forms
  const [articleForm, setArticleForm] = useState({ title: "", content: "" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", image: "", technologies: "" });
  const [experienceForm, setExperienceForm] = useState({ company: "", position: "", duration: "", description: "", image: "" });

  // States for edit mode
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);

  // Use effect to load data
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const fetchData = async () => {
    try {
      const [artRes, projRes, expRes] = await Promise.all([
        fetch("/api/articles"),
        fetch("/api/projects"),
        fetch("/api/experience")
      ]);
      if (artRes.ok) setArticles(await artRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Show success/error message
  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // CRUD Functions for Articles
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.content) {
      showMessage("error", "Please fill all required fields");
      return;
    }

    try {
      if (editingArticleId) {
        const res = await fetch(`/api/articles/${editingArticleId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(articleForm)
        });
        if (!res.ok) throw new Error("Failed to update");
        showMessage("success", "Article updated successfully");
      } else {
        const newArticle = { ...articleForm, date: new Date().toISOString().split('T')[0] };
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(newArticle)
        });
        if (!res.ok) throw new Error("Failed to add");
        showMessage("success", "Article added successfully");
      }
      setArticleForm({ title: "", content: "" });
      setEditingArticleId(null);
      fetchData();
    } catch (error) {
      showMessage("error", "An error occurred");
    }
  };

  const editArticle = (article: Article) => {
    setArticleForm({ title: article.title, content: article.content });
    setEditingArticleId(article.id);
  };

  const deleteArticle = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const res = await fetch(`/api/articles/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete");
        showMessage("success", "Article deleted successfully");
        fetchData();
      } catch (error) {
        showMessage("error", "An error occurred");
      }
    }
  };

  // CRUD Functions for Projects
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      showMessage("error", "Please fill all required fields");
      return;
    }



    const projectPayload = {
      ...projectForm,
      image: convertGoogleDriveUrl(projectForm.image),
      technologies: projectForm.technologies.split(',').map(tech => tech.trim())
    };

    try {
      if (editingProjectId) {
        const res = await fetch(`/api/projects/${editingProjectId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(projectPayload)
        });
        if (!res.ok) throw new Error("Failed to update");
        showMessage("success", "Project updated successfully");
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(projectPayload)
        });
        if (!res.ok) throw new Error("Failed to add");
        showMessage("success", "Project added successfully");
      }
      setProjectForm({ title: "", description: "", image: "", technologies: "" });
      setEditingProjectId(null);
      fetchData();
    } catch (error) {
      showMessage("error", "An error occurred");
    }
  };

  const editProject = (project: Project) => {
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : (project.technologies || "")
    });
    setEditingProjectId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete");
        showMessage("success", "Project deleted successfully");
        fetchData();
      } catch (error) {
        showMessage("error", "An error occurred");
      }
    }
  };

  // CRUD Functions for Experience
  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceForm.company || !experienceForm.position) {
      showMessage("error", "Please fill all required fields");
      return;
    }

    const expPayload = {
      ...experienceForm,
      image: convertGoogleDriveUrl(experienceForm.image),
    };

    try {
      if (editingExperienceId) {
        const res = await fetch(`/api/experience/${editingExperienceId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(expPayload)
        });
        if (!res.ok) throw new Error("Failed to update");
        showMessage("success", "Experience updated successfully");
      } else {
        const res = await fetch("/api/experience", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(expPayload)
        });
        if (!res.ok) throw new Error("Failed to add");
        showMessage("success", "Experience added successfully");
      }
      setExperienceForm({ company: "", position: "", duration: "", description: "", image: "" });
      setEditingExperienceId(null);
      fetchData();
    } catch (error) {
      showMessage("error", "An error occurred");
    }
  };

  const editExperience = (experience: Experience) => {
    setExperienceForm({
      company: experience.company,
      position: experience.position,
      duration: experience.duration,
      description: experience.description,
      image: experience.image || ""
    });
    setEditingExperienceId(experience.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteExperience = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        const res = await fetch(`/api/experience/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete");
        showMessage("success", "Experience deleted successfully");
        fetchData();
      } catch (error) {
        showMessage("error", "An error occurred");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setLocation("/");
  };

  return (
    <PageLayout>
      <div className="w-full max-w-[1160px] mx-auto px-4 md:px-6">
        <div className="py-8 md:py-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-[#222a47]">
            Admin Dashboard
          </h1>
            <Button 
              onClick={handleLogout}
              className="bg-[#e56815] hover:bg-[#d55a12] text-white"
            >
              Logout
            </Button>
            </div>

          {message.text && (
            <Alert 
              variant={message.type === "error" ? "destructive" : "default"} 
              className="mb-6"
            >
              {message.text}
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white rounded-[12px] p-1 space-x-2">
              <TabsTrigger value="articles" className="rounded-[8px] px-4 py-2">Articles</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-[8px] px-4 py-2">Projects</TabsTrigger>
              <TabsTrigger value="experience" className="rounded-[8px] px-4 py-2">Experience</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add/Edit Article</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleArticleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="mt-1"
                        placeholder="Article title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={articleForm.content}
                        onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        className="mt-1"
                        placeholder="Article content"
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="bg-[#e56815] hover:bg-[#d55a12] text-white">
                      {editingArticleId ? "Update Article" : "Add Article"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {articles.map(article => (
                  <Card key={article.id}>
                    <CardHeader>
                      <CardTitle>{article.title}</CardTitle>
                      <p className="text-sm text-gray-500">{article.date}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{article.content}</p>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => editArticle(article)}
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button 
                          onClick={() => deleteArticle(article.id)}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add/Edit Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="projectTitle">Title</Label>
                      <Input
                        id="projectTitle"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="mt-1"
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectDescription">Description</Label>
                      <Textarea
                        id="projectDescription"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="mt-1"
                        placeholder="Project description"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectImage">Image URL</Label>
                      <Input
                        id="projectImage"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        className="mt-1"
                        placeholder="Image URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectTechnologies">Technologies (comma-separated)</Label>
                      <Input
                        id="projectTechnologies"
                        value={projectForm.technologies}
                        onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                        className="mt-1"
                        placeholder="React, TypeScript, Tailwind"
                      />
                    </div>
                    <Button type="submit" className="bg-[#e56815] hover:bg-[#d55a12] text-white">
                      {editingProjectId ? "Update Project" : "Add Project"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {projects.map(project => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2">{project.description}</p>
                      {project.image && (
                        <img 
                          src={convertGoogleDriveUrl(project.image)} 
                          alt={project.title} 
                          className="w-full h-48 object-cover rounded-lg mb-2"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-[#fbebe3] text-[#e56815] rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => editProject(project)}
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button 
                          onClick={() => deleteProject(project.id)}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add/Edit Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleExperienceSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={experienceForm.company}
                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                        className="mt-1"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={experienceForm.position}
                        onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                        className="mt-1"
                        placeholder="Job position"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={experienceForm.duration}
                        onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                        className="mt-1"
                        placeholder="e.g., 2023-2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expDescription">Description</Label>
                      <Textarea
                        id="expDescription"
                        value={experienceForm.description}
                        onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                        className="mt-1"
                        placeholder="Job description"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expImage">Image URL (Optional)</Label>
                      <Input
                        id="expImage"
                        value={experienceForm.image}
                        onChange={(e) => setExperienceForm({ ...experienceForm, image: e.target.value })}
                        className="mt-1"
                        placeholder="Image URL or Google Drive link"
                      />
                    </div>
                    <Button type="submit" className="bg-[#e56815] hover:bg-[#d55a12] text-white">
                      {editingExperienceId ? "Update Experience" : "Add Experience"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {experiences.map(experience => (
                  <Card key={experience.id}>
                    <CardHeader>
                      <CardTitle>{experience.position}</CardTitle>
                      <p className="text-[#e56815] font-medium">{experience.company}</p>
                      <p className="text-sm text-gray-500">{experience.duration}</p>
                    </CardHeader>
                    <CardContent>
                      {experience.image && (
                        <img 
                          src={convertGoogleDriveUrl(experience.image)} 
                          alt={experience.company} 
                          className="w-16 h-16 object-contain rounded mb-4 bg-white"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <p className="mb-4">{experience.description}</p>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => editExperience(experience)}
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button 
                          onClick={() => deleteExperience(experience.id)}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                  </div>
            </TabsContent>
          </Tabs>
                </div>
    </div>
    </PageLayout>
  );
}
