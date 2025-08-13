"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Initialize animations when scripts are loaded
    const initAnimations = () => {
      if (typeof window !== 'undefined' && (window as any).Lenis && (window as any).gsap) {
        // Initialize Lenis smooth scrolling
        const lenis = new (window as any).Lenis({ 
          duration: 1.2, 
          smoothWheel: true 
        });
        
        function raf(time: number) { 
          lenis.raf(time); 
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // GSAP animations
        const gsap = (window as any).gsap;
        gsap.registerPlugin((window as any).ScrollTrigger);

        // Initial hero animations
        gsap.set([".hero .kicker", ".headline", ".sub", ".search", ".stats .stat"], {
          opacity: 0, 
          y: 20
        });
        
        const tl = gsap.timeline({ 
          defaults: { ease: "power3.out", duration: 0.8 } 
        });
        
        tl.to(".hero .kicker", { opacity: 1, y: 0 })
          .to(".headline", { opacity: 1, y: 0 }, "-=0.3")
          .to(".sub", { opacity: 1, y: 0 }, "-=0.4")
          .to(".search", { opacity: 1, y: 0 }, "-=0.3")
          .to(".stats .stat", { opacity: 1, y: 0, stagger: 0.06 }, "-=0.4");

        // Scroll-triggered animations
        gsap.utils.toArray([".feature-card", ".step"]).forEach((el: any, i: number) => {
          gsap.from(el, { 
            scrollTrigger: { 
              trigger: el, 
              start: "top 80%" 
            }, 
            y: 24, 
            opacity: 0, 
            duration: 0.8, 
            ease: "power3.out", 
            delay: i * 0.02 
          });
        });

        // 3D tilt effect for cards
        const cards = document.querySelectorAll('[data-tilt]');
        cards.forEach(card => {
          const cardElement = card as HTMLElement;
          cardElement.addEventListener('mousemove', (e) => {
            const r = cardElement.getBoundingClientRect();
            const rx = (e.clientY - r.top - r.height/2) / r.height * -10;
            const ry = (e.clientX - r.left - r.width/2) / r.width * 10;
            cardElement.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
          });
          
          cardElement.addEventListener('mouseleave', () => {
            cardElement.style.transform = 'rotateX(0) rotateY(0)';
            cardElement.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
            setTimeout(() => cardElement.style.transition = '', 600);
          });
        });
      }
    };

    // Delay initialization to ensure scripts are loaded
    setTimeout(initAnimations, 100);
  }, []);

  return (
    <>
      <Script 
        src="https://unpkg.com/@studio-freight/lenis@1.0.38/dist/lenis.min.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="https://unpkg.com/gsap@3/dist/gsap.min.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="https://unpkg.com/gsap@3/dist/ScrollTrigger.min.js" 
        strategy="beforeInteractive" 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden relative">
        {/* Animated background grid */}
        <div className="fixed inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Navigation */}
        <nav className="fixed w-full top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              URWriter
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#talent" className="text-gray-300 hover:text-white transition-colors">Find Talent</a>
              <a href="#work" className="text-gray-300 hover:text-white transition-colors">Find Work</a>
            </div>
            <div className="flex space-x-4">
              <Link href="/signin">
                <button className="px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="hero min-h-screen flex items-center justify-center px-6 relative">
          <div className="max-w-6xl mx-auto text-center">
            <div className="kicker text-blue-400 text-sm uppercase tracking-wider mb-4 font-medium">
              Professional Writing Marketplace
            </div>
            <h1 className="headline text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Hire talent,{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                fast
              </span>
            </h1>
            <p className="sub text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with professional writers, editors, and content creators. 
              Build your dream team with AI-powered matching and seamless collaboration.
            </p>
            
            {/* Search Bar */}
            <div className="search max-w-2xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-2 flex">
                <input 
                  type="text" 
                  placeholder="Search: Grant Writing, Copywriting, Technical Writing..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 outline-none"
                />
                <Link href="/services">
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                    Browse Services
                  </button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="stats grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="stat text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
                <div className="text-gray-400 text-sm">Expert Writers</div>
              </div>
              <div className="stat text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">1M+</div>
                <div className="text-gray-400 text-sm">Projects Completed</div>
              </div>
              <div className="stat text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">4.9/5</div>
                <div className="text-gray-400 text-sm">Client Satisfaction</div>
              </div>
              <div className="stat text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why choose{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  URWriter
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Advanced features designed for modern content creation and collaboration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Matching",
                  description: "Our intelligent algorithm connects you with the perfect writer based on skills, experience, and project requirements.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Real-time Collaboration",
                  description: "Work together seamlessly with built-in messaging, file sharing, and project management tools.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
                {
                  title: "Quality Assurance",
                  description: "Every writer is vetted and verified. Get high-quality content with our satisfaction guarantee.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Secure Payments",
                  description: "Milestone-based payments with escrow protection. Pay only when you're completely satisfied.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                },
                {
                  title: "Content Analytics",
                  description: "Track performance metrics, engagement rates, and ROI for all your content projects.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: "24/7 Support",
                  description: "Get help whenever you need it with our dedicated customer success team.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25A9.75 9.75 0 002.25 12c0 5.384 4.365 9.75 9.75 9.75s9.75-4.366 9.75-9.75S17.635 2.25 12 2.25zM8.625 12a3.375 3.375 0 106.75 0 3.375 3.375 0 00-6.75 0z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="feature-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
                  data-tilt
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">How it works</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get started in minutes with our streamlined process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Post Your Project",
                  description: "Describe your writing needs, set your budget, and specify your timeline."
                },
                {
                  step: "02", 
                  title: "Review Proposals",
                  description: "Get proposals from qualified writers and choose the best fit for your project."
                },
                {
                  step: "03",
                  title: "Collaborate & Pay",
                  description: "Work together through our platform and pay securely upon completion."
                }
              ].map((step, index) => (
                <div key={index} className="step text-center">
                  <div className="text-6xl font-bold text-blue-400/20 mb-4">{step.step}</div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust URWriter for their content needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                  Start Hiring Writers
                </button>
              </Link>
              <button className="px-8 py-4 border border-white/20 text-white rounded-xl text-lg font-medium hover:bg-white/10 transition-colors">
                Become a Writer
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-white/10 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  URWriter
                </div>
                <p className="text-gray-400 max-w-md">
                  The premier marketplace for professional writing services. 
                  Connect with top talent and grow your business.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Find Writers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 URWriter. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
