import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageLayout } from "../components/ui/layout";
import { Separator } from "@/components/ui/separator";

interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
  image?: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((error) => console.error("Error fetching experience:", error));
  }, []);

  // Helper to convert Google Drive URL to direct image URL on the fly
  const getRenderImageUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('drive.google.com')) {
      const fileMatch = url.match(/\/file\/d\/([^\/\?]+)/);
      if (fileMatch && fileMatch[1]) return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1000`;
      
      const idMatch = url.match(/[\?&]id=([^&]+)/);
      if (idMatch && idMatch[1]) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
    return url;
  };

  const technicalSkills = [
    { name: "UI Design", percentage: "90%" },
    { name: "UX Design", percentage: "85%" },
    { name: "Web Development", percentage: "75%" },
    { name: "Mobile Design", percentage: "80%" },
    { name: "Prototyping", percentage: "80%" },
    { name: "Data Visualization (Looker Studio & Metabase)", percentage: "75%" },
    { name: "Infographic & Video Editing (Canva & CapCut)", percentage: "85%" }
  ];

  const softSkills = [
    {
      name: "Problem Solving",
      description: "Ability to identify, analyze, and solve complex design challenges effectively."
    },
    {
      name: "Communication",
      description: "Strong verbal and written communication skills for collaborating with teams and stakeholders."
    },
    {
      name: "Time Management",
      description: "Excellent organizational skills and ability to manage multiple projects simultaneously."
    },
    {
      name: "Adaptability",
      description: "A year of experience as a makeup artist taught me to quickly adapt to different personalities and work environments, staying professional in any situation."
    }
  ];

  const tools = [
    { name: "Figma", imgSrc: "/figmaAssets/figma.png" },
    { name: "Visual Studio", imgSrc: "/figmaAssets/visual-studio.png" },
    { name: "Canva", imgSrc: "/figmaAssets/canva.png" },
    { name: "Framer", imgSrc: "/figmaAssets/framer-logo.png" },
    { name: "GitHub", imgSrc: "/figmaAssets/github.png" }
  ];

  return (
    <PageLayout>
      <div className="w-full max-w-[1160px] mx-auto px-4 md:px-6">
        {/* Header */}
        <section className="py-8 md:py-16">
          <h1 className="font-bold text-[#222a47] text-3xl md:text-[40px] mb-8">
            My Experience
          </h1>
          
          <p className="font-normal text-[#222a47cc] text-base mb-8">
            Here's my professional journey and experience in the field of digital product design
          </p>
        </section>

        {/* Experience Timeline */}
        <section className="py-8">
          {experiences.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-[#222a47] mb-2">No experience entries found</h3>
              <p className="text-[#222a47cc]">Experience entries will appear here once added</p>
            </div>
          ) : (
          <div className="space-y-12">
            {experiences.map((exp, index) => (
                <div key={exp.id} className="relative">
                {/* Timeline line */}
                {index !== experiences.length - 1 && (
                  <div className="absolute left-8 md:left-10 top-16 bottom-0 w-0.5 bg-[#e56815]" />
                )}
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Timeline dot */}
                  <div className="flex items-start">
                    <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-[#e56815] flex items-center justify-center shrink-0">
                        <span className="text-white font-semibold text-center text-sm px-2">{exp.duration}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-[10px] shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#222a47]">
                          {exp.position}
                        </h3>
                        <h4 className="text-lg md:text-xl font-semibold text-[#e56815] mt-1">
                          {exp.company}
                        </h4>
                      </div>
                      {exp.image && (
                        <div 
                          className="w-16 md:w-20 h-16 md:h-20 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage(getRenderImageUrl(exp.image!))}
                        >
                          <img
                            src={getRenderImageUrl(exp.image)}
                            alt={exp.company}
                            className="w-full h-full object-contain rounded-lg bg-white shadow-sm border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-base md:text-lg text-[#222a47] mb-6 mt-4">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>

        {/* Skills Section */}
        <section className="bg-white rounded-[20px] shadow-lg py-12 md:py-16 px-6 md:px-12 max-w-[1160px] mx-auto">
          <h2 className="font-bold text-[#222a47] text-3xl md:text-[40px] mb-12 text-center">
            Background Skills & Accomplishment
            </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Technical Skills */}
            <div className="w-full h-full">
              <div className="bg-[#fbebe3] rounded-[20px] p-8 h-full flex flex-col">
                <h3 className="text-2xl font-semibold text-[#222a47] mb-8">Technical Skills</h3>
                <div className="space-y-8 flex-1">
                {technicalSkills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-lg text-[#222a47]">
                        {skill.name}
                        </h4>
                        <span className="font-medium text-[#e56815]">
                        {skill.percentage}
                      </span>
                    </div>
                      <div className="relative h-2 bg-white rounded-full overflow-hidden">
                      <div 
                          className="absolute h-full left-0 bg-[#e56815] rounded-full transition-all duration-1000"
                        style={{ width: skill.percentage }}
                      />
                      </div>
                    </div>
                  ))}
                  </div>
              </div>
            </div>

              {/* Soft Skills */}
            <div className="w-full h-full">
              <div className="bg-[#fbebe3] rounded-[20px] p-8 h-full flex flex-col">
                <h3 className="text-2xl font-semibold text-[#222a47] mb-8">Soft Skills</h3>
                <div className="space-y-6 flex-1">
                {softSkills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-[15px] p-6 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-[#e56815] text-lg mb-2">
                      {skill.name}
                      </h4>
                      <p className="text-[#222a47]">
                      {skill.description}
                    </p>
                  </div>
                ))}
                </div>
              </div>
              </div>
            </div>

          {/* Tools Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-[#222a47] mb-8 text-center">Tools I Use</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center max-w-[900px] mx-auto">
              {tools.map((tool, index) => (
                <div 
                  key={index} 
                  className="group relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#fbebe3] rounded-[15px] shadow-sm hover:shadow-md transition-all p-4 flex items-center justify-center"
                >
                  <img
                    className="w-full h-full object-contain transition-transform group-hover:scale-110"
                    alt={tool.name}
                    src={tool.imgSrc}
                  />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-[#222a47] text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tool.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center items-center">
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-default shadow-2xl bg-white"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
}