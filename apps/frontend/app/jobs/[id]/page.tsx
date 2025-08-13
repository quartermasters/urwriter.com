"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: string;
  status: string;
  category: string;
  skillsRequired: string[];
  requirements: string;
  deliverables: string;
  timeline: string;
  createdAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating?: number;
    totalJobs?: number;
  };
}

interface Proposal {
  id: string;
  freelancerId: string;
  coverLetter: string;
  proposedBudget: number;
  proposedTimeline: string;
  status: string;
  createdAt: string;
  freelancer: {
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating?: number;
  };
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    coverLetter: "",
    proposedBudget: "",
    proposedTimeline: ""
  });

  useEffect(() => {
    fetchJobDetails();
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      const [jobResponse, proposalsResponse] = await Promise.all([
        apiClient.getJob(params.id as string),
        apiClient.getProposals(params.id as string)
      ]);
      
      setJob(jobResponse);
      setProposals(proposalsResponse);
      
      // Check if current user already submitted a proposal
      if (user && proposalsResponse.some((p: Proposal) => p.freelancerId === user.id)) {
        setProposalSubmitted(true);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiClient.createProposal({
        jobId: params.id,
        coverLetter: proposalForm.coverLetter,
        proposedBudget: Number(proposalForm.proposedBudget),
        proposedTimeline: proposalForm.proposedTimeline
      });
      
      setProposalSubmitted(true);
      setShowProposalForm(false);
      fetchJobDetails(); // Refresh to show new proposal
    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Job Not Found</h1>
          <Link href="/services" className="text-purple-600 hover:text-purple-700">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/services" className="text-purple-600 hover:text-purple-700 flex items-center mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                  <div className="flex items-center space-x-4 text-slate-600">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {job.category}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {job.budgetType === 'FIXED' ? `$${job.budget}` : `$${job.budget}/hr`}
                  </div>
                  <div className="text-slate-500">
                    {job.budgetType === 'FIXED' ? 'Fixed Price' : 'Hourly Rate'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {job.skillsRequired.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <div className={`px-3 py-1 inline-block rounded-full text-sm ${
                job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {job.status}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Project Description</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed">{job.description}</p>
              </div>
            </div>

            {/* Requirements & Deliverables */}
            {(job.requirements || job.deliverables) && (
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-8">
                {job.requirements && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Requirements</h3>
                    <p className="text-slate-700">{job.requirements}</p>
                  </div>
                )}
                {job.deliverables && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Deliverables</h3>
                    <p className="text-slate-700">{job.deliverables}</p>
                  </div>
                )}
              </div>
            )}

            {/* Proposals Section (for client view) */}
            {user?.id === job.client.id && (
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Proposals ({proposals.length})
                </h2>
                {proposals.length === 0 ? (
                  <p className="text-slate-600">No proposals submitted yet.</p>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-slate-900">
                              {proposal.freelancer.firstName} {proposal.freelancer.lastName}
                            </h4>
                            <div className="text-sm text-slate-600">
                              Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              ${proposal.proposedBudget}
                            </div>
                            <div className="text-sm text-slate-600">
                              {proposal.proposedTimeline}
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-700 text-sm">{proposal.coverLetter}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">About the Client</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                  {job.client.firstName[0]}{job.client.lastName[0]}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-slate-900">
                    {job.client.firstName} {job.client.lastName}
                  </div>
                  {job.client.rating && (
                    <div className="text-sm text-slate-600">
                      {job.client.rating}/5 ({job.client.totalJobs || 0} jobs)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-600">Timeline</div>
                  <div className="font-medium">{job.timeline || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Proposals</div>
                  <div className="font-medium">{proposals.length}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {user && user.id !== job.client.id && job.status === 'OPEN' && (
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6">
                {proposalSubmitted ? (
                  <div className="text-center">
                    <div className="text-green-600 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-600">Proposal submitted successfully!</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowProposalForm(true)}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Submit Proposal
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Proposal Form Modal */}
        {showProposalForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Submit Proposal</h2>
                <button
                  onClick={() => setShowProposalForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitProposal} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={proposalForm.coverLetter}
                    onChange={(e) => setProposalForm({...proposalForm, coverLetter: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Explain why you're the perfect fit for this project..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Proposed Budget ($)
                  </label>
                  <input
                    type="number"
                    value={proposalForm.proposedBudget}
                    onChange={(e) => setProposalForm({...proposalForm, proposedBudget: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Your proposed budget"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Proposed Timeline
                  </label>
                  <input
                    type="text"
                    value={proposalForm.proposedTimeline}
                    onChange={(e) => setProposalForm({...proposalForm, proposedTimeline: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="e.g., 7 days, 2 weeks"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowProposalForm(false)}
                    className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
