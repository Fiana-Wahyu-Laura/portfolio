import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { PageLayout } from "../components/ui/layout";

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="w-full max-w-[1160px] mx-auto px-4 md:px-6">
        {/* Header */}
        <section className="py-8 md:py-16">
          <h1 className="font-bold text-[#222a47] text-3xl md:text-[40px] mb-8">
            My Articles
          </h1>
          <p className="font-normal text-[#222a47cc] text-base mb-8">
            Sharing my thoughts and experiences about design, development, and creativity
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-[500px]">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-[#222a47] mb-2">No articles found</h3>
              <p className="text-[#222a47cc]">Try adjusting your search terms</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-[#fbebe3] rounded-[15px] overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-[#222a47cc] mb-4">
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-[#222a47] text-xl mb-4">
                    {article.title}
                  </h3>
                  <p className="text-[#222a47cc] text-base mb-4">
                      {article.content.length > 150 
                        ? `${article.content.substring(0, 150)}...` 
                        : article.content}
                    </p>
                  <button className="w-full h-[40px] md:h-[50px] bg-[#e56815] hover:bg-[#d55a12] text-white rounded-[10px] font-semibold transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="py-8 md:py-16 text-center bg-[#fbebe3] rounded-[15px] px-4 md:px-8">
          <h2 className="font-semibold text-[#222a47] text-2xl md:text-3xl mb-4">
            Subscribe to My Newsletter
          </h2>
          <p className="text-[#222a47cc] text-base md:text-lg mb-8">
            Get notified when I publish new articles and design resources
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-[600px] mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-[40px] md:h-[50px] px-4 rounded-[10px] border border-[#e56815] focus:outline-none focus:ring-2 focus:ring-[#e56815]"
            />
            <button className="h-[40px] md:h-[50px] px-8 bg-[#e56815] hover:bg-[#d55a12] text-white rounded-[10px] font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
