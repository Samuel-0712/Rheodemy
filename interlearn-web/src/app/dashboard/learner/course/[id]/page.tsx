"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Play, Pause, Maximize, Volume2, VolumeX, Settings, CheckCircle2, Activity, Sparkles, Globe2, FileText, Headphones, BookOpen, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const mockCourses = {
  "1": {
    title: "Mastering TypeScript in 2026",
    instructor: "Alex Chen",
    type: "video",
    rate: 0.12,
    modules: [
      { id: 1, title: "Introduction to Advanced Types", duration: "12:14" },
      { id: 2, title: "Utility Types Masterclass", duration: "18:45" },
      { id: 3, title: "Generics deep dive", duration: "24:10" }
    ]
  },
  "2": {
    title: "The 10x Designer Handbook",
    instructor: "Sarah Doe",
    type: "ebook",
    rate: 0.05,
    modules: [
      { id: 1, title: "Systems Thinking", duration: "10 mins read" },
      { id: 2, title: "Layout Architecture", duration: "20 mins read" },
      { id: 3, title: "Rapid Prototyping", duration: "15 mins read" }
    ]
  },
  "3": {
    title: "Y Combinator: Startup School (Audio)",
    instructor: "Y Combinator",
    type: "audio",
    rate: 0.02,
    modules: [
      { id: 1, title: "How to Build the Future", duration: "45:20" },
      { id: 2, title: "Finding Product Market Fit", duration: "38:10" },
      { id: 3, title: "Scaling your team", duration: "52:05" }
    ]
  }
};

export default function CoursePlayerPage() {
  const params = useParams();
  const id = params?.id as string;
  const course = mockCourses[id as keyof typeof mockCourses] || mockCourses["1"];

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRef = course.type === 'audio' ? audioRef : videoRef;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted, but we will ensure the video plays
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("Original (English)");

  // Ebook Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [visitedPages, setVisitedPages] = useState<number[]>([]);
  const isPageNew = !visitedPages.includes(currentPage);

  // Media High-Water Mark State (for skipping/rewinding)
  const [highestTimeReached, setHighestTimeReached] = useState(0);
  const isMediaReplaying = mediaRef.current ? mediaRef.current.currentTime < highestTimeReached - 0.5 : false;

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen().catch(err => console.error(err));
      }
    }
  };

  // Monetization State
  const [streamedSeconds, setStreamedSeconds] = useState(0);
  const ratePerSecond = course.rate / 60; 
  const totalStreamed = streamedSeconds * ratePerSecond;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Meter ONLY runs if playing, is an ebook, AND the page hasn't been read before
    if (isPlaying && course.type === 'ebook' && isPageNew) {
      interval = setInterval(() => {
        setStreamedSeconds(prev => prev + 1);
        setProgress(prev => Math.min(prev + 0.1, 100)); // fake progress for ebook
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, course.type, currentPage, visitedPages, isPageNew]);

  const togglePlay = () => {
    if (course.type === 'ebook') {
      setIsPlaying(!isPlaying);
      return;
    }

    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = mediaRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error("Video playback failed:", error);
            // If autoplay policy blocks it, muting it usually fixes it instantly.
            if (mediaRef.current) {
               mediaRef.current.muted = true;
               setIsMuted(true);
               mediaRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
            }
          });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      const current = mediaRef.current.currentTime;
      const duration = mediaRef.current.duration;
      setProgress((current / duration) * 100);
      
      // High-Water Mark Logic: Only increase streamedSeconds if they are in "new" territory
      if (current > highestTimeReached) {
        setHighestTimeReached(current);
        setStreamedSeconds(Math.floor(current));
      }
    }
  };

  const ebookPages = [
    (
      <div key="p1">
        <div className="border-b border-black/10 pb-8 mb-8">
          <h1 className="text-4xl font-bold font-serif mb-4 text-black">{course.title}</h1>
          <div className="flex items-center gap-4 text-sm text-black/60">
            <span>By {course.instructor}</span>
            <span>•</span>
            <span>Published 2026</span>
          </div>
        </div>
        <p className="text-lg leading-relaxed font-serif text-[#2A2A2A] mb-6">Welcome to the definitive guide. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <div className="p-8 bg-black/5 rounded-2xl border-l-4 border-primary my-10">
          <p className="text-2xl italic font-serif text-black leading-snug">"Design is not just what it looks like and feels like. Design is how it works."</p>
        </div>
        <p className="text-lg leading-relaxed font-serif text-[#2A2A2A]">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      </div>
    ),
    (
      <div key="p2">
        <h2 className="text-2xl font-bold font-serif mt-4 mb-6 text-black">The Foundations of Systems</h2>
        <p className="text-lg leading-relaxed font-serif text-[#2A2A2A] mb-6">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
        <p className="text-lg leading-relaxed font-serif text-[#2A2A2A] mb-6">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    ),
    (
      <div key="p3">
        <h2 className="text-2xl font-bold font-serif mt-4 mb-6 text-black">Rapid Prototyping</h2>
        <p className="text-lg leading-relaxed font-serif text-[#2A2A2A] mb-6">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
        <p className="text-lg leading-relaxed font-serif text-[#2A2A2A] mb-6">Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.</p>
      </div>
    )
  ];

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!visitedPages.includes(currentPage)) {
      setVisitedPages([...visitedPages, currentPage]);
    }
    if (currentPage < ebookPages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!visitedPages.includes(currentPage)) {
      setVisitedPages([...visitedPages, currentPage]);
    }
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex flex-col relative z-10">
      
      {/* Cinematic Top Bar */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/learner" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted hover:text-foreground transition-colors" />
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="font-medium text-sm text-foreground truncate max-w-sm">{course.title}</h1>
        </div>

        {/* Unobtrusive Monetization Tracker */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 shadow-[0_0_15px_rgba(0,212,200,0.05)]">
          <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(0,212,200,0.8)]' : 'bg-muted'}`} />
          <span className="text-xs font-mono text-primary flex items-center gap-1.5">
            Streaming ILP <span className="opacity-50">|</span> ${totalStreamed.toFixed(4)}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div ref={containerRef} className="w-full aspect-video bg-black relative group cursor-pointer" onClick={togglePlay}>
            
            {course.type === 'video' && (
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                preload="auto"
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
            )}

            {course.type === 'audio' && (
              <div className="w-full h-full bg-[#111] flex flex-col items-center justify-center relative">
                {/* Using a reliable HTTPS MP3 for audio demonstration */}
                <audio 
                  ref={audioRef}
                  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
                <div className={`w-32 h-32 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center mb-4 transition-transform duration-1000 ${isPlaying ? 'scale-110 shadow-[0_0_50px_rgba(0,212,200,0.2)]' : 'scale-100'}`}>
                  <Headphones className={`w-12 h-12 text-primary ${isPlaying ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'h-1'}`} style={{ height: isPlaying ? `${Math.random() * 24 + 8}px` : '4px', animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            )}

            {course.type === 'ebook' && (
              <div className="w-full h-full bg-[#FAFAFA] text-[#1A1A1A] p-8 sm:p-12 overflow-y-auto relative cursor-auto" onClick={(e) => e.stopPropagation()}>
                
                {/* Paused Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-[#FAFAFA]/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <button onClick={togglePlay} className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl">
                       <BookOpen className="w-6 h-6" /> Start Reading (Meter Starts)
                    </button>
                  </div>
                )}

                {/* Floating Pause Button & Status when active */}
                {isPlaying && (
                  <div className="absolute bottom-6 right-8 z-30 flex items-center gap-4">
                    {!isPageNew && (
                      <div className="bg-white text-black px-4 py-2 rounded-full border border-black/10 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Re-reading (Meter Paused)</span>
                      </div>
                    )}
                    <button onClick={togglePlay} className="bg-black/90 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-black transition-colors shadow-xl">
                      <Pause className="w-4 h-4 fill-current" /> Pause Reading
                    </button>
                  </div>
                )}

                <div className={`max-w-2xl mx-auto flex flex-col min-h-full pb-24 transition-opacity duration-500 ${!isPlaying ? 'opacity-30 blur-[2px]' : 'opacity-100'}`}>
                  {/* Page Content */}
                  <div className="flex-1">
                    {ebookPages[currentPage]}
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="pt-12 mt-12 border-t border-black/10 flex items-center justify-between">
                    <button 
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-black/60 hover:text-black hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-sm font-mono text-black/40">Page {currentPage + 1} of {ebookPages.length}</span>
                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage === ebookPages.length - 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-black/60 hover:text-black hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Large Center Play Button (Visible when paused, only for media) */}
            {!isPlaying && course.type !== 'ebook' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="pointer-events-auto w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(0,212,200,0.3)] transition-transform hover:scale-110 cursor-pointer"
                >
                  <Play className="w-8 h-8 ml-1" />
                </button>
              </div>
            )}
            
            {/* Custom Premium Controls (Hidden for Ebooks) */}
            {course.type !== 'ebook' && (
              <div 
                className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 pt-24 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                onClick={(e) => e.stopPropagation()} // Prevent toggling when interacting with controls
              >
                
                {/* Timeline */}
                <div className="w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer relative group/timeline hover:h-2 transition-all">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary rounded-full pointer-events-none transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(0,212,200,0.5)] opacity-0 group-hover/timeline:opacity-100 transition-opacity" />
                  </div>
                  {/* Invisible Range Input for Drag-Scrubbing */}
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={(e) => {
                      const percentage = Number(e.target.value) / 100;
                      if (mediaRef.current && course.type !== 'ebook') {
                        mediaRef.current.currentTime = percentage * mediaRef.current.duration;
                        // Optimistically update progress for smooth dragging
                        setProgress(Number(e.target.value));
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Controls Container */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={togglePlay} className="text-white hover:text-primary transition-colors z-10">
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                    </button>
                    <button onClick={toggleMute} className="text-white hover:text-primary transition-colors z-10">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-xs font-mono text-white/70 flex items-center gap-3">
                      <span>{Math.floor((mediaRef.current?.currentTime || 0) / 60)}:{(Math.floor(mediaRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
                      
                      {/* Media Re-listening Indicator */}
                      {isMediaReplaying && (
                        <span className="bg-white/10 text-white px-2 py-1 rounded-md text-[10px] font-sans font-semibold tracking-wider flex items-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          Re-watching (Free)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={(e) => { e.stopPropagation(); alert('Settings coming in Phase 2!'); }} 
                      className="text-white hover:text-primary transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={toggleFullscreen} 
                      className="text-white hover:text-primary transition-colors"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Under Video Content */}
          <div className="p-8 max-w-5xl mx-auto w-full space-y-12">
            
            {/* Course Title & Instructor */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">1. {course.modules[0].title}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4 text-sm text-muted">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">{course.instructor[0]}</div>
                  <span className="text-foreground font-medium">{course.instructor}</span>
                  <span>•</span>
                  <span>Rate: ${course.rate}/min</span>
                </div>
                
                {/* AI Language Selector */}
                <div className="flex items-center gap-3">
                  {language !== "Original (English)" && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#c084fc] bg-[#c084fc]/10 px-2.5 py-1 rounded-full border border-[#c084fc]/20 animate-in fade-in zoom-in duration-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Translated
                    </span>
                  )}
                  <div className="relative">
                    <Globe2 className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="pl-9 pr-8 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer hover:bg-white/5"
                    >
                      <option value="Original (English)">English (Original)</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Escrow Visualization */}
            <div className="p-6 rounded-xl border border-primary/20 bg-primary/[0.02] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                 <Activity className="w-32 h-32 text-primary" />
               </div>
               
               <div className="relative z-10 space-y-6">
                 <div className="flex items-center justify-between">
                   <h3 className="text-xs uppercase tracking-widest font-semibold text-primary flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,212,200,0.8)]" />
                     Live Payment Split
                   </h3>
                   <span className="font-mono text-sm text-foreground">Total Streamed: ${(totalStreamed).toFixed(4)}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 80% Creator */}
                    <div className="p-4 rounded-lg bg-[#0A0A0A] border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-colors">
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                        <Activity className="w-16 h-16 text-primary" />
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Creator (80%)</p>
                      <p className="font-mono text-lg text-foreground relative z-10">${(totalStreamed * 0.80).toFixed(4)}</p>
                    </div>
                    {/* 15% Platform */}
                    <div className="p-4 rounded-lg bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Rheodemy (15%)</p>
                      <p className="font-mono text-lg text-foreground">${(totalStreamed * 0.15).toFixed(4)}</p>
                    </div>
                    {/* 5% NGO */}
                    <div className="p-4 rounded-lg bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Bursary Fund (5%)</p>
                      <p className="font-mono text-lg text-foreground">${(totalStreamed * 0.05).toFixed(4)}</p>
                    </div>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Sidebar Modules */}
        <div className="w-full lg:w-96 border-l border-white/5 bg-[#0A0A0A] flex flex-col h-[calc(100vh-64px)] lg:sticky lg:top-16">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">Course Modules</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            
            {course.modules.map((module, index) => (
              <div 
                key={module.id} 
                className={`p-3 rounded-lg flex gap-4 cursor-pointer group transition-colors ${
                  index === 0 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'border border-transparent hover:border-white/5 hover:bg-white/[0.02]'
                }`}
              >
                 <div className="mt-1">
                   {index === 0 ? (
                     <CheckCircle2 className="w-4 h-4 text-primary" />
                   ) : (
                     <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-white/40 flex items-center justify-center text-[8px] text-muted">
                       {module.id}
                     </div>
                   )}
                 </div>
                 <div>
                   <h4 className={`text-sm font-medium ${index === 0 ? 'text-primary' : 'text-foreground group-hover:text-white transition-colors'}`}>
                     {module.id}. {module.title}
                   </h4>
                   <p className="text-xs text-muted font-mono mt-1">
                     {module.duration} {index === 0 ? '• Playing' : ''}
                   </p>
                 </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
