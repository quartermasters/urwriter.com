"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: string;
  status: string;
  category: string;
  skillsRequired: string[];
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

const writingServices = {
  "Business & Professional Writing": {
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
      </svg>
    ),
    description: "Professional documents and business communications",
    subcategories: {
      "Proposal Writing": [
        "RFP & Tender Proposals",
        "Contract Bids & Government Proposals"
      ],
      "Grant Writing": [
        "Nonprofit Grants",
        "Research & Academic Funding",
        "Startup & Business Grants"
      ],
      "Business Plans & Pitch Decks": [
        "Investor Business Plans",
        "Pitch Deck Design & Writing"
      ],
      "White Papers & Case Studies": [
        "Technical White Papers",
        "Industry Case Studies"
      ],
      "Policy & Procedure Writing": [
        "HR Policies",
        "Compliance Manuals",
        "SOP Documentation"
      ],
      "Tender & Bid Writing": [
        "Technical Volumes",
        "Price Volumes",
        "Compliance Narratives"
      ]
    }
  },
  "Creative & Ghostwriting": {
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    description: "Creative content and storytelling services",
    subcategories: {
      "Ghostwriting": [
        "Books (Fiction / Non-Fiction)",
        "Memoirs & Autobiographies",
        "Speeches & Thought Leadership Articles"
      ],
      "Fiction & Story Writing": [
        "Novels & Short Stories",
        "Script Writing",
        "Character Development"
      ],
      "Poetry & Lyrics": [
        "Music Lyrics",
        "Spoken Word",
        "Custom Poems"
      ],
      "Screenwriting & Playwriting": [
        "Film Scripts",
        "TV Episodes",
        "Theatre Plays"
      ]
    }
  },
  "Marketing & Copywriting": {
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    description: "Sales-focused and marketing content",
    subcategories: {
      "Website Copywriting": [
        "Homepage Copy",
        "Landing Pages",
        "Product Descriptions"
      ],
      "Sales Copywriting": [
        "Ad Campaign Copy",
        "Email Marketing Content",
        "Sales Funnels"
      ],
      "SEO Content Writing": [
        "Blog Articles",
        "Keyword Optimization",
        "Meta Descriptions"
      ],
      "Brand Storytelling": [
        "Brand Voice Development",
        "Company Narratives"
      ],
      "Social Media Writing": [
        "Captions & Posts",
        "Content Calendars"
      ],
      "Press Releases": [
        "Product Launches",
        "Media Announcements"
      ]
    }
  },
  "Technical & Academic Writing": {
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    description: "Research, technical, and educational content",
    subcategories: {
      "Technical Writing": [
        "User Manuals",
        "Product Guides",
        "Process Documentation"
      ],
      "Research Writing": [
        "Academic Papers",
        "Literature Reviews",
        "Market Analysis Reports"
      ],
      "Instructional Writing": [
        "E-Learning Modules",
        "Training Manuals"
      ],
      "Scientific Writing": [
        "Journal Submissions",
        "Research Abstracts"
      ]
    }
  },
  "Editing, Proofreading & Review": {
    icon: (
      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    description: "Content improvement and quality assurance",
    subcategories: {
      "Copy Editing": [
        "Grammar & Style Fixes",
        "Tone & Flow Enhancement"
      ],
      "Proofreading": [
        "Final Error Checks"
      ],
      "Developmental Editing": [
        "Structure & Content Overhaul"
      ],
      "Content Review & Audit": [
        "Quality Checks",
        "SEO & Readability Audit"
      ]
    }
  },
  "Specialized Industry Writing": {
    icon: (
      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    description: "Industry-specific and specialized content",
    subcategories: {
      "Legal Writing": [
        "Contracts & Agreements",
        "Policy Briefs"
      ],
      "Medical Writing": [
        "Regulatory Documentation",
        "Patient Education Materials"
      ],
      "UX Writing": [
        "Microcopy for Apps & Websites",
        "Error & Call-to-Action Text"
      ],
      "Speech Writing": [
        "Corporate & Political Speeches",
        "Motivational Talks"
      ],
      "Grant Evaluation": [
        "Review & Feedback Services"
      ]
    }
  },
  "Translation & Localization": {
    icon: (
      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    description: "Multilingual and cultural adaptation services",
    subcategories: {
      "Transcreation": [
        "Cultural Adaptation for Marketing"
      ],
      "Bilingual Content Creation": [
        "Multilingual Writing Services"
      ],
      "Subtitling & Script Adaptation": [
        "Film & TV Subtitles",
        "E-Learning Localization"
      ]
    }
  }
};

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch jobs when a service is selected
  useEffect(() => {
    if (selectedService) {
      fetchJobsForService(selectedService);
    }
  }, [selectedService]);

  const fetchJobsForService = async (service: string) => {
    setLoading(true);
    try {
      const response = await apiClient.getJobs({
        category: service,
        search: service
      });
      setJobs(response.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = Object.entries(writingServices).filter(([category, data]) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      category.toLowerCase().includes(searchLower) ||
      data.description.toLowerCase().includes(searchLower) ||
      Object.entries(data.subcategories).some(([subcat, services]) =>
        subcat.toLowerCase().includes(searchLower) ||
        services.some(service => service.toLowerCase().includes(searchLower))
      )
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                URWriter
              </Link>
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Pro</span>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-slate-700 hover:text-purple-600 px-3 py-2 font-medium">
                Dashboard
              </Link>
              <Link href="/find-work" className="text-slate-700 hover:text-purple-600 px-3 py-2 font-medium">
                Find Work
              </Link>
              <Link href="/services" className="text-purple-600 px-3 py-2 font-medium border-b-2 border-purple-600">
                Browse Services
              </Link>
              <Link href="/messages" className="text-slate-700 hover:text-purple-600 px-3 py-2 font-medium">
                Messages
              </Link>
            </div>

            {/* Search & Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">Sarah Chen</p>
                  <p className="text-xs text-slate-500">Content Strategist</p>
                </div>
                <img
                  src="/api/placeholder/40/40"
                  alt="Profile"
                  className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Writing Services Marketplace</h1>
          <p className="text-lg text-slate-600 mb-6">
            Discover professional writing services across all industries and specializations
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for writing services, categories, or specializations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map(([categoryName, categoryData]) => (
            <div
              key={categoryName}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Category Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">{categoryData.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{categoryName}</h3>
                      <p className="text-sm text-slate-600 mt-1">{categoryData.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(selectedCategory === categoryName ? null : categoryName)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <svg 
                      className={`h-5 w-5 transform transition-transform ${selectedCategory === categoryName ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              <div className={`transition-all duration-300 ${selectedCategory === categoryName ? 'block' : 'hidden'}`}>
                <div className="p-6 space-y-4">
                  {Object.entries(categoryData.subcategories).map(([subcategoryName, services]) => (
                    <div key={subcategoryName} className="border-l-2 border-purple-200 pl-4">
                      <h4 className="font-medium text-slate-800 mb-2">{subcategoryName}</h4>
                      <ul className="space-y-1">
                        {services.map((service, index) => (
                          <li key={index} className="text-sm text-slate-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                            <button 
                              className="text-left hover:text-purple-600 transition-colors duration-200"
                              onClick={() => setSelectedService(service)}
                            >
                              {service}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    {Object.values(categoryData.subcategories).flat().length} services available
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                      Browse Writers
                    </button>
                    <button className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                      Post Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Job Listings Section */}
        {selectedService && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Jobs for "{selectedService}"</h2>
                <p className="text-slate-600 mt-1">Available opportunities in this category</p>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Filter
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="text-slate-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-600 mb-4">
                  There are currently no open jobs for "{selectedService}". 
                </p>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Create Job Alert
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{job.title}</h3>
                        <p className="text-slate-600 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-green-600">
                          {job.budgetType === 'FIXED' ? `$${job.budget}` : `$${job.budget}/hr`}
                        </p>
                        <p className="text-sm text-slate-500">
                          {job.budgetType === 'FIXED' ? 'Fixed Price' : 'Hourly'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-600">
                          by {job.client.firstName} {job.client.lastName}
                        </span>
                        <span className="text-sm text-slate-400">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {job.skillsRequired.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <span className="text-xs text-slate-500">+{job.skillsRequired.length - 3}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {job.status}
                      </span>
                      
                      <div className="flex space-x-2">
                        <Link 
                          href={`/jobs/${job.id}`}
                          className="px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Submit Proposal
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {jobs.length > 0 && (
                  <div className="text-center pt-6">
                    <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                      Load More Jobs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Writing Service?</h2>
          <p className="text-lg mb-6 opacity-90">
            Can't find exactly what you're looking for? Our expert writers can handle specialized requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Post Custom Project
            </button>
            <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Consult with Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
