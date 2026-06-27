import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/articles", label: "Articles" },
    { path: "/experience", label: "Experience" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-[#fdf6f2]">
      <header className="sticky top-0 z-50 w-full py-4 md:py-0">
        <nav className="relative w-full max-w-[1160px] h-16 md:h-20 mx-auto bg-white rounded-[10px] shadow-[0px_4px_4px_#00000040] flex items-center justify-between px-4 md:px-6">
          <Link to="/" className="font-semibold text-[#e56815] text-xl md:text-2xl">
            FianaWL
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-normal text-[#222a47] text-lg hover:text-[#e56815] transition-colors ${
                  isActive(link.path) ? "text-[#e56815]" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin/login">
              <Button 
                className="h-[50px] w-[115px] bg-[#222a47] hover:bg-[#1a1f39] rounded-[10px] text-white font-semibold transition-colors"
              >
                Admin Panel
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-[10px] mt-2 p-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-normal text-[#222a47] text-lg hover:text-[#e56815] transition-colors ${
                    isActive(link.path) ? "text-[#e56815]" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link to="/admin/login">
                  <Button 
                    className="w-full h-12 bg-[#222a47] hover:bg-[#1a1f39] rounded-[10px] text-white font-semibold transition-colors"
                  >
                    Admin Panel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">{children}</main>

      {/* Footer */}
      <footer className="w-full h-[147px] bg-[#e56815] mt-auto">
        {/* Footer content */}
      </footer>
    </div>
  );
}; 