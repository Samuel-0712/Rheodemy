"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, Play, Star, Clock, Headphones, FileText, CheckCircle2 } from 'lucide-react';

const MOCK_COURSES = [
  {
    id: 1,
    type: 'video',
    title: 'Mastering TypeScript',
    author: 'Alex Chen',
    rating: 4.9,
    duration: '120m',
    rate: '$0.12/min',
    cap: null,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    description: 'Learn advanced patterns, strict mode, and how to build robust enterprise applications.',
  },
  {
    id: 2,
    type: 'ebook',
    title: 'The 10x Designer Handbook',
    author: 'Sarah Doe',
    rating: 4.8,
    duration: '~4h read',
    rate: '$0.05/min',
    cap: '$15.00',
    image: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=1974&auto=format&fit=crop',
    description: 'A definitive guide to systems thinking, layout architecture, and rapid prototyping.',
  },
  {
    id: 3,
    type: 'audio',
    title: 'Y Combinator: Startup School (Audio)',
    author: 'Y Combinator',
    rating: 5.0,
    duration: '8h 20m',
    rate: '$0.02/min',
    cap: '$5.00',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1974&auto=format&fit=crop',
    description: "Listen to the world's best startup advice while commuting or running.",
  }
];

export default function LearnerDashboard() {
  const [filter, setFilter] = useState('all');

  const filteredCourses = MOCK_COURSES.filter(course => {
    if (filter === 'all') return true;
    return course.type === filter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Content</h1>
          <p className="text-muted mt-2 text-sm max-w-md">
            Pay only for the minutes you actively learn. Once you hit the price cap, the content is yours forever.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search topics, formats, creators..." 
            className="w-full bg-card border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm placeholder:text-muted"
          />
        </div>
      </div>

      {/* Format Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'all' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-muted hover:text-foreground'
          }`}
        >
          All Content
        </button>
        <button 
          onClick={() => setFilter('video')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            filter === 'video' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-muted hover:text-foreground'
          }`}
        >
          <Play className="w-3 h-3" /> Video Courses
        </button>
        <button 
          onClick={() => setFilter('ebook')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            filter === 'ebook' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-muted hover:text-foreground'
          }`}
        >
          <FileText className="w-3 h-3" /> Written & PDFs
        </button>
        <button 
          onClick={() => setFilter('audio')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            filter === 'audio' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-muted hover:text-foreground'
          }`}
        >
          <Headphones className="w-3 h-3" /> Audio & Podcasts
        </button>
        <button 
          onClick={() => setFilter('quiz')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            filter === 'quiz' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-muted hover:text-foreground'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" /> Quizzes (Free)
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {filteredCourses.map((course) => (
          <Link href={`/dashboard/learner/course/${course.id}`} key={course.id} className="bg-[#0A0A0A] rounded-2xl overflow-hidden hover:border-primary/30 transition-colors group cursor-pointer border border-white/5 flex flex-col relative">
            <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-md flex items-center gap-2 border border-white/10">
               {course.type === 'video' && <Play className="w-3 h-3 text-white" />}
               {course.type === 'ebook' && <FileText className="w-3 h-3 text-white" />}
               {course.type === 'audio' && <Headphones className="w-3 h-3 text-white" />}
               <span className="text-[10px] font-bold text-white tracking-widest uppercase">{course.type}</span>
            </div>
            <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center border-b border-white/5 group-hover:border-primary/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
              <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col relative z-20">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-base leading-tight">{course.title}</h3>
                <div className="flex flex-col items-end gap-1">
                   <span className="bg-primary/10 text-primary text-[10px] font-mono px-2 py-1 rounded border border-primary/20 whitespace-nowrap">{course.rate}</span>
                   {course.cap && <span className="text-[9px] text-muted uppercase tracking-wider">Cap: {course.cap}</span>}
                </div>
              </div>
              <p className="text-sm text-muted line-clamp-2 flex-1">{course.description}</p>
              <div className="flex items-center justify-between text-xs text-muted font-medium pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-primary" /> {course.rating.toFixed(1)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                </div>
                <div>{course.author}</div>
              </div>
            </div>
          </Link>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted">
            <p>No content available for this format yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
