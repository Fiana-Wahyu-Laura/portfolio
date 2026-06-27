import type { Express, Request as ExpressRequest, Response } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { insertArticleSchema, insertProjectSchema, insertExperienceSchema } from "@shared/schema";

// Extend Request type to include user
interface AuthRequest extends ExpressRequest {
  user?: jwt.JwtPayload;
}

const router = Router();

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

// Authentication middleware
const authMiddleware = (req: AuthRequest, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Contact form endpoint
  app.post("/api/contact", async (req: ExpressRequest, res: Response) => {
    try {
      // Validate request body
      const validatedData = contactFormSchema.parse(req.body);

      // Create transporter for sending emails
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'fianawahyulaura@gmail.com',
          pass: process.env.EMAIL_PASS || ''
        }
      });

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER || 'fianawahyulaura@gmail.com',
        to: 'fianawahyulaura@gmail.com',
        subject: `Portfolio Contact: ${validatedData.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.json({ 
        success: true, 
        message: "Thank you for your message! I'll get back to you soon." 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message. Please try again later." 
        });
      }
    }
  });

  // Admin authentication endpoints
  app.post("/api/admin/login", async (req: ExpressRequest, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    try {
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Protected admin routes
  app.get("/api/admin/protected", authMiddleware, (req: AuthRequest, res: Response) => {
    res.json({ message: "Access granted", user: req.user });
  });

  // Articles API
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.post("/api/articles", authMiddleware, async (req, res) => {
    try {
      const article = insertArticleSchema.parse(req.body);
      const created = await storage.createArticle(article);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.put("/api/articles/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = insertArticleSchema.partial().parse(req.body);
      const updated = await storage.updateArticle(id, article);
      if (!updated) return res.status(404).json({ message: "Article not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.delete("/api/articles/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteArticle(id);
      if (!deleted) return res.status(404).json({ message: "Article not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Helper to convert Google Drive URL to direct image URL
  const convertGoogleDriveUrl = (url: string | null | undefined) => {
    if (!url) return url;
    
    if (url.includes('drive.google.com')) {
      // Try to extract ID from /file/d/ID
      const fileMatch = url.match(/\/file\/d\/([^\/\?]+)/);
      if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1000`;
      }
      
      // Try to extract ID from ?id=ID
      const idMatch = url.match(/[\?&]id=([^&]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
      }
    }
    
    return url;
  };

  app.post("/api/projects", authMiddleware, async (req, res) => {
    try {
      const parsedBody = {
        ...req.body,
        image: convertGoogleDriveUrl(req.body.image),
      };
      const project = insertProjectSchema.parse(parsedBody);
      const created = await storage.createProject(project);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedBody = { ...req.body };
      if (parsedBody.image !== undefined) {
        parsedBody.image = convertGoogleDriveUrl(parsedBody.image);
      }
      const project = insertProjectSchema.partial().parse(parsedBody);
      const updated = await storage.updateProject(id, project);
      if (!updated) return res.status(404).json({ message: "Project not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) return res.status(404).json({ message: "Project not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Experience API
  app.get("/api/experience", async (req, res) => {
    try {
      const exp = await storage.getExperiences();
      res.json(exp);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  app.post("/api/experience", authMiddleware, async (req, res) => {
    try {
      const parsedBody = {
        ...req.body,
        image: convertGoogleDriveUrl(req.body.image),
      };
      const exp = insertExperienceSchema.parse(parsedBody);
      const created = await storage.createExperience(exp);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.put("/api/experience/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedBody = { ...req.body };
      if (parsedBody.image !== undefined) {
        parsedBody.image = convertGoogleDriveUrl(parsedBody.image);
      }
      const exp = insertExperienceSchema.partial().parse(parsedBody);
      const updated = await storage.updateExperience(id, exp);
      if (!updated) return res.status(404).json({ message: "Experience not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.delete("/api/experience/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteExperience(id);
      if (!deleted) return res.status(404).json({ message: "Experience not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete experience" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

export default router;
