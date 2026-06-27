import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PageLayout } from "../components/ui/layout";

export default function LandingPage() {
  // Music data
  const musicData = {
    title: "Blue Soda",
    artist: "Fiana",
    coverImage: "/figmaAssets/blue-soda.png",
    audioFile: "/music/blue_soda_KLICKAUD.mp3"
  };

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Create a promise to handle play() which returns a promise
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Error playing audio:", error);
              setError("Failed to play audio. Please try again.");
              setIsPlaying(false);
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio loading
  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle audio error
  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load audio file");
    setIsPlaying(false);
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>, volumeBarWidth: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / volumeBarWidth));
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Format time to MM:SS
  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTime = (x / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle music ended
  const handleMusicEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Update volume on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Navigation links data
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Project", href: "/projects" },
    { name: "Experience", href: "/experience" },
    { name: "Articles", href: "/articles" },
  ];

  // Technical skills data
  const technicalSkills = [
    {
      name: "UI Design",
      percentage: "90%",
      width: "w-[440px]",
      dotPosition: "left-[431px]",
    },
    {
      name: "UX Research",
      percentage: "85%",
      width: "w-[400px]",
      dotPosition: "left-[391px]",
    },
    {
      name: "Product Design",
      percentage: "80%",
      width: "w-[365px]",
      dotPosition: "left-[351px]",
    },
    {
      name: "No Code Tools",
      percentage: "70%",
      width: "w-[310px]",
      dotPosition: "left-[304px]",
    },
    {
      name: "Basic HTML/CSS",
      percentage: "60%",
      width: "w-[270px]",
      dotPosition: "left-[253px]",
    },
  ];

  // Soft skills data
  const softSkills = [
    {
      name: "Communication",
      description: "Explaining design ideas clearly & effectively",
    },
    {
      name: "Empathy",
      description: "Focused on user needs",
    },
    {
      name: "Problem-solving",
      description: "Solution-oriented when facing design constraints",
    },
    {
      name: "Critical Thinking",
      description: "Thinks logically when structuring product flow",
    },
    {
      name: "Adaptability",
      description: "Quick to learn new tools/methodologies",
    },
  ];

  // Tools data
  const tools = [
    { name: "Figma", bgImage: "bg-[url(/figmaAssets/figma.png)]" },
    { name: "Framer", bgImage: "bg-[url(/figmaAssets/framer-logo.png)]" },
    { name: "Image", imgSrc: "/figmaAssets/image.png" },
    { name: "Canva", bgImage: "bg-[url(/figmaAssets/canva.png)]" },
    {
      name: "Visual Studio",
      bgImage: "bg-[url(/figmaAssets/visual-studio.png)]",
    },
  ];

  // Social media links
  const socialLinks = [
    { name: "LinkedIn", bgImage: "bg-[url(/figmaAssets/linkedin.png)]" },
    { name: "Instagram", bgImage: "bg-[url(/figmaAssets/instagram.png)]" },
    { name: "GitHub", bgImage: "bg-[url(/figmaAssets/github.png)]" },
  ];

  const skills = [
    {
      category: "Design",
      items: ["UI Design", "UX Design", "Wireframing", "Prototyping", "Infographic Design", "Motion Graphics"]
    },
    {
      category: "Data Analysis",
      items: ["Dashboard Monitoring", "Data Visualization", "Looker Studio", "Metabase", "Microsoft Excel"]
    },
    {
      category: "Tools",
      items: ["Figma", "Visual Studio Code", "Canva", "CapCut", "Looker Studio", "Metabase", "Excel", "Git", "GitHub"]
    }
  ];

  return (
    <PageLayout>
      <div className="w-full max-w-[1160px] mx-auto px-4 md:px-6 min-h-screen">
        {/* Hero Section */}
        <section className="w-full min-h-[calc(100vh-80px)] bg-[#fbebe3] rounded-[20px] mb-16 relative overflow-hidden">
          <div className="max-w-[1160px] mx-auto py-16 md:py-24 px-8 md:px-12 flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="max-w-[663px] mb-12 md:mb-0 text-center md:text-left">
              <h2 className="font-semibold text-[#e56815] text-2xl md:text-[32px]">
                Hello Everyone 👋, I am
              </h2>
              <h1 className="font-bold text-[#222a47] text-4xl md:text-[64px] mt-4">
                Fiana Wahyu Laura
              </h1>
              <h3 className="font-semibold text-[#222a47] text-xl md:text-[32px] mt-4 leading-relaxed">
                Digital Product Designer & Data Analyst Enthusiast
              </h3>
              <p className="font-normal text-[#222a47cc] text-sm md:text-base mt-6 max-w-[505px] mx-auto md:mx-0 text-justify">
                I&apos;m a Digital Product Designer and an enthusiastic Data Analyst in the making. With a strong foundation in UI/UX design, I gained hands-on experience monitoring data and designing monitoring dashboards during my internship at BPS (Badan Pusat Statistik). I&apos;m a fast learner who adapts easily to new tools and challenges, always excited to dive into something new, whether it&apos;s crafting user-friendly designs or uncovering insights from data.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center mt-8 md:mt-10 h-[45px] w-[140px] md:h-[55px] md:w-[170px] bg-[#e56815] hover:bg-[#d55a12] rounded-[12px] text-white font-semibold transition-all hover:scale-105"
              >
                My Contact
              </Link>
            </div>

            <div className="relative w-[300px] h-[400px] md:w-[444px] md:h-[527px] md:mr-8 lg:mr-16">
              <img
                className="absolute w-[260px] h-[350px] md:w-[400px] md:h-[500px] top-0 left-5 md:left-11 object-cover rounded-[20px] drop-shadow-[0_10px_8px_rgba(0,0,0,0.5)]"
                alt="Fiana profile"
                src="/figmaAssets/pia-edit.png"
              />
              {/* Music Player */}
              <div className="absolute left-0 top-[350px] md:top-[467px] flex items-center w-[240px] md:w-[280px] h-[50px] md:h-[60px] rounded-[10px] bg-[#e56815] group shadow-md hover:shadow-lg transition-shadow">
                <audio
                  ref={audioRef}
                  src={musicData.audioFile}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleMusicEnded}
                  onCanPlay={handleCanPlay}
                  onError={handleError}
                  preload="auto"
                />
                <div className="flex w-full items-center gap-2 px-2">
                  <img
                    className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-[5px] object-cover"
                    alt="Music cover"
                    src={musicData.coverImage}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      className={`text-white hover:text-white/80 ${(isLoading || error) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={togglePlay}
                      disabled={isLoading || !!error}
                    >
                      <img
                        className="w-4 h-4 md:w-5 md:h-5"
                        alt={isPlaying ? 'Pause' : 'Play'}
                        src={isPlaying ? '/figmaAssets/icons8-pause-50.png' : '/figmaAssets/circled-play-button.png'}
                      />
                    </button>
                    <div className="flex items-center gap-1">
                      <span className="text-white text-[8px] md:text-[10px]">{formatTime(currentTime)}</span>
                      <div
                        className={`w-[70px] md:w-[90px] h-[2px] bg-white/30 rounded-full ${!isLoading && !error ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={!isLoading && !error ? handleProgressBarClick : undefined}
                      >
                        <div
                          className="h-full bg-white rounded-full transition-width duration-100"
                          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="relative group">
                      <button
                        className={`text-white hover:text-white/80 ${(isLoading || error) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading || !!error}
                      >
                        <img className="w-4 h-4 md:w-5 md:h-5" alt="Speaker" src="/figmaAssets/speaker.png" />
                      </button>
                      {!isLoading && !error && (
                        <div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[60px] h-[2px] bg-white/30 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleVolumeChange(e, 60)}
                        >
                          <div
                            className="h-full bg-white rounded-full transition-all duration-100"
                            style={{ width: `${volume * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#e56815] opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#e56815] opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </section>

        {/* About Me Section */}
        <section id="about" className="py-12 md:py-20 bg-white rounded-[20px] mb-16 shadow-sm">
          <div className="max-w-[1160px] mx-auto px-4 md:px-0 flex flex-col md:flex-row">
            <div className="relative w-full max-w-[300px] md:w-[339px] h-[350px] md:h-[464px] mx-auto md:mx-0 mb-8 md:mb-0">
              <div className="absolute top-0 left-0 bg-[#e56815] rounded-[20px] w-full h-[300px] md:w-[300px] md:h-[421px] shadow-lg" />
              <img
                className="absolute top-[30px] left-[30px] md:top-[43px] md:left-[39px] w-full max-w-[300px] h-[300px] md:w-[300px] md:h-[421px] object-cover rounded-[20px] shadow-md"
                alt="Fiana portrait"
                src="/figmaAssets/about.jpeg"
              />
            </div>

            <div className="md:ml-[104px] max-w-[719px] pr-4 md:pr-8 lg:pr-12">
              <h2 className="font-bold text-[#222a47] text-2xl md:text-[40px] mb-6">About me</h2>
              <p className="font-normal text-[#222a47cc] text-sm md:text-base mt-6 text-justify">
                With a strong foundation in UI/UX design and hands-on dashboard monitoring experience from my internship at BPS (Badan Pusat Statistik), I also bring a year of experience as a makeup artist, where I learned to connect with all kinds of personalities and stay calm and professional, even when working with clients who didn&apos;t always click with me. That experience shaped me into someone who adapts quickly and thrives in any collaborative environment.
              </p>

              <h2 className="font-bold text-[#222a47] text-2xl md:text-[40px] mt-12 md:mt-16 mb-8">
                Education
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-8 md:mt-[65px] space-y-8 md:space-y-0 px-4 md:px-8 lg:px-12">
                <div className="relative flex flex-col items-center md:w-[280px]">
                  <img
                    className="w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
                    alt="School building"
                    src="/figmaAssets/school-building.png"
                  />
                  <p className="font-normal text-[#222a47] text-lg md:text-xl text-center mt-2">
                    SMA Negeri 1 Toapaya
                    <br />
                    2020-2023
                  </p>
                </div>

                <div className="hidden md:flex items-center mx-4">
                  <div className="w-[25px] h-[25px] bg-[#222a47] rounded-[12.5px]" />
                  <img
                    className="w-[120px] md:w-[195px] h-[5px] mx-2"
                    alt="Timeline"
                    src="/figmaAssets/line-1.svg"
                  />
                  <div className="w-[25px] h-[25px] bg-[#222a47] rounded-[12.5px]" />
                </div>

                <div className="flex flex-col items-center md:w-[280px]">
                  <img
                    className="w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
                    alt="University building"
                    src="/figmaAssets/university-building.png"
                  />
                  <p className="font-normal text-[#222a47] text-lg md:text-xl text-center mt-2 md:mt-7">
                    Universitas Maritim Raja Ali Haji
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skillset Section */}
        <section className="py-12 md:py-20 bg-[#fbebe3] rounded-[20px] mb-16 shadow-sm">
          <div className="max-w-[1160px] mx-auto px-4 md:px-6">
            <h2 className="font-bold text-[#222a47] text-2xl md:text-[40px] mb-12 text-center">
              My Skillset
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {skills.map((skillGroup, index) => (
                <div key={index} className="bg-white p-8 rounded-[15px] shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-[#e56815] text-xl mb-4">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-4 py-2 bg-[#fbebe3] text-[#222a47] rounded-full text-sm font-medium hover:bg-[#e56815] hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="w-full py-16 md:py-24">
          {/* Projects content */}
        </section>

        {/* Articles Section */}
        <section className="w-full py-16 md:py-24">
          {/* Articles content */}
        </section>

        {/* Experience Section */}
        <section className="w-full py-16 md:py-24">
          {/* Experience content */}
        </section>

        {/* Contact Section - Replace with CTA */}
        <section className="w-full py-16 md:py-24 bg-[#fbebe3]">
          <div className="w-full max-w-[1160px] mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-bold text-[#222a47] text-3xl md:text-[40px] mb-4">
                Let's Work Together
              </h2>
              <p className="text-[#222a47cc] text-lg mb-8 max-w-2xl mx-auto">
                Ready to bring your ideas to life? I&apos;m here to help you create amazing digital experiences.
              </p>
              <Link
                to="/contact"
                className="inline-flex h-[55px] px-8 items-center justify-center bg-[#e56815] hover:bg-[#d55a12] text-white rounded-[12px] font-semibold transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
