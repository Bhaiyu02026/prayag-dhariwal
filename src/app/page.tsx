'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import Navbar from '@/components/ui/Navbar';
import RoadmapNode from '@/components/ui/RoadmapNode';
import Footer from '@/components/ui/Footer';
import { Cpu, Shield, Lock, Globe, ArrowUpRight, FolderGit2, Eye, X, ChevronLeft, ChevronRight, Layers, Milestone, Calendar } from 'lucide-react';

interface RoadmapMilestone {
  id: number;
  step: string;
  title: string;
  location: string;
  description: string;
  status: 'current' | 'upcoming' | 'future';
  sequence_order: number;
}

export default function PortfolioHome() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [timelineMilestones, setTimelineMilestones] = useState<RoadmapMilestone[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);
  const [uiLoading, setUiLoading] = useState(true);

  // Synchronize both database clusters on client node mount
  useEffect(() => {
    async function syncSystemNodes() {
      let uploadedProjects: any[] = [];
      let uploadedMilestones: any[] = [];

      try {
        // Parallel multi-cluster data fetch
        const [projectsResponse, roadmapResponse] = await Promise.all([
          supabase
            .from('projects')
            .select('id, title, description, status, category, tech_stack, file_url, version, icon_url, screenshots, is_restricted')
            .order('id', { ascending: false }),
          supabase
            .from('academic_roadmap')
            .select('id, step, title, location, description, status, sequence_order')
            .order('sequence_order', { ascending: true })
        ]);

        if (projectsResponse.error) console.error('❌ [Supabase Projects Sync Failure]:', projectsResponse.error);
        else if (projectsResponse.data) uploadedProjects = projectsResponse.data;

        if (roadmapResponse.error) console.error('❌ [Supabase Roadmap Sync Failure]:', roadmapResponse.error);
        else if (roadmapResponse.data) uploadedMilestones = roadmapResponse.data;

      } catch (catchErr) {
        console.error('💥 [Critical Server Crash Catch]:', catchErr);
      }

      // Static backup placeholders if database tables are unseeded or offline
      const staticProjects: any[] = [
        {
          id: "vidhya-security",
          title: "Vidhya Security Force App",
          description: "A secure multi-dashboard workspace application structuring unique validation workflows for Guards, Supervisors, and Owners.",
          status: "In Progress",
          category: "Full-Stack Architecture",
          tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
          version: "1.0.0",
          is_restricted: true
        },
        {
          id: "bean-bloom",
          title: "Bean & Bloom Hub",
          description: "A premium, viewport-optimized storytelling interface designed for an elite coffee house collective located at Apollo Premier, Vijay Nagar.",
          status: "In Progress",
          category: "Frontend UI/UX",
          tech_stack: ["React", "Tailwind CSS", "Framer Motion"],
          version: "1.0.0",
          is_restricted: false
        },
        {
          id: "ecopath-infra",
          title: "ECOPATH Infrastructure Core",
          description: "A sustainable smart-city concept blueprinting modular highway architectures that actively integrate carbon-absorbing materials.",
          status: "Future Concept",
          category: "System Design & Concept",
          tech_stack: ["Research", "Sustainability"],
          version: "0.1.0",
          is_restricted: false
        }
      ];

      const staticMilestones: RoadmapMilestone[] = [
        { id: 1, step: "01", title: "Class 12 (Computer Science)", location: "Indore", description: "Building strong foundations in logical programming structures, advanced algorithms, and data system operations.", status: "current", sequence_order: 1 },
        { id: 2, step: "02", title: "BCA Undergraduate Degree", location: "Target: Christ University", description: "Studying core computational frameworks, software design paradigms, and professional communication strategies.", status: "upcoming", sequence_order: 2 },
        { id: 3, step: "03", title: "NIMCET Examination Tracker", location: "National Level Entrance", description: "Targeting top-tier NIT campuses through rigorous mathematics and analytical problem-solving preparation.", status: "upcoming", sequence_order: 3 },
        { id: 4, step: "04", title: "MCA Degree & GATE Preparation", location: "Top NIT // IIT Entrance Focus", description: "Mastering advanced computer systems theory while securing top placement goals in the national GATE CS exam.", status: "upcoming", sequence_order: 4 },
        { id: 5, step: "05", title: "Ph.D. in Software Engineering", location: "Doctorate Research Node", description: "Completing terminal academic research focused on massive infrastructure scaling, optimization, and system modularity.", status: "future", sequence_order: 5 }
      ];

      // Merge dynamic records safely over fallback arrays
      const uploadedTitles = new Set(uploadedProjects.map(p => p.title.toLowerCase()));
      const uniqueStaticProjects = staticProjects.filter(p => !uploadedTitles.has(p.title.toLowerCase()));
      setAllProjects([...uploadedProjects, ...uniqueStaticProjects] as Project[]);

      if (uploadedMilestones.length > 0) {
        setTimelineMilestones(uploadedMilestones);
      } else {
        setTimelineMilestones(staticMilestones);
      }

      setUiLoading(false);
    }
    syncSystemNodes();
  }, []);

  const categoryFilters = [
    { label: 'ALL BUILD TARGETS', value: 'ALL' },
    { label: 'FULL-STACK', value: 'Full-Stack Architecture' },
    { label: 'FRONTEND UI/UX', value: 'Frontend UI/UX' },
    { label: 'MOBILE APPS', value: 'Mobile Application Architecture' },
    { label: 'SYSTEM BLUEPRINTS', value: 'System Design & Concept' }
  ];

  const filteredProjects = allProjects.filter(project => {
    if (activeFilter === 'ALL') return true;
    return project.category === activeFilter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#020305] bg-grid-pattern selection:bg-blue-500/20 text-gray-400 font-sans antialiased tracking-normal">
      <Navbar />

      {/* Hero Header Area with Spatial Mesh Glow */}
      <header className="relative w-full max-w-7xl mx-auto px-6 pt-40 pb-28 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/[0.02] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-indigo-600/[0.02] rounded-full blur-[130px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#090d16] border border-blue-900/30 px-4 py-1.5 rounded-xl font-mono text-[10px] tracking-widest text-blue-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              SYSTEM ARCHITECTURE NODE // SECURE_ONLINE
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold text-white tracking-tight leading-[0.95]">
              Prayag Dhariwal
            </h1>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
              Software systems engineer specialized in constructing transactional data engines, robust execution builds, and low-profile user environments. Focused on a structured academic lifecycle track spanning a{' '}
              <span className="text-white font-semibold">BCA at Christ University</span>, clearing national{' '}
              <span className="text-white font-semibold">NIMCET computational targets</span>, cracking the{' '}
              <span className="text-white font-semibold">GATE CS matrix</span>, and establishing a terminal{' '}
              <span className="text-blue-400 font-bold">Ph.D. Research Core in Software Engineering Architecture</span>.
            </p>
          </div>

          <div className="lg:col-span-4 w-full bg-[#06080d]/60 border border-gray-900/80 p-6 rounded-2xl space-y-4 font-mono text-[11px] shadow-2xl relative group backdrop-blur-md">
            <div className="text-gray-600 uppercase tracking-widest text-[9px] font-bold border-b border-gray-950 pb-2 flex justify-between items-center">
              <span>// OPERATIONAL SPECIFICATION</span>
              <span className="text-emerald-500">SYS_OK</span>
            </div>
            <div className="flex justify-between border-b border-gray-950/40 pb-2">
              <span className="text-gray-500">AGE RUNTIME:</span>
              <span className="text-white font-bold tracking-wide">17 Years Old</span>
            </div>
            <div className="flex justify-between border-b border-gray-950/40 pb-2">
              <span className="text-gray-500">ACADEMIC FRAME:</span>
              <span className="text-emerald-400 font-bold tracking-wide">Class 12 (CS)</span>
            </div>
            <div className="flex justify-between border-b border-gray-950/40 pb-2">
              <span className="text-gray-500">NODE LOCATION:</span>
              <span className="text-white font-bold tracking-wide">Indore, India</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">CORE FOCUS:</span>
              <span className="text-blue-400 font-bold tracking-wide">Application Logic</span>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Repository Section */}
      <section id="repository" className="w-full max-w-7xl mx-auto px-6 py-20 scroll-mt-10">
        <div className="border-t border-gray-900/60 pt-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-2 border-l-2 border-blue-500 pl-2.5">// PERSISTENT STORAGE DATA</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Project Development Matrix</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-500 max-w-md font-normal leading-relaxed">
              Click any repository node tracking layout matrix cards to review UI screenshot proofs, active staging versions, and download parameters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-10 font-mono text-[10px] border-b border-gray-950 pb-6">
            <span className="text-gray-600 uppercase font-bold mr-2">// Filter Target:</span>
            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg tracking-wider uppercase transition-all border ${
                  activeFilter === filter.value
                    ? 'bg-blue-950/40 border-blue-800/80 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                    : 'bg-transparent border-gray-900/80 text-gray-500 hover:border-gray-800 hover:text-gray-400'
                }`}
              >
                [ {filter.label} ]
              </button>
            ))}
          </div>

          {uiLoading ? (
            <div className="text-center py-20 font-mono text-xs text-gray-600 tracking-widest animate-pulse">// ACCESSING REMOTE STORAGE CHIPS...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-900 rounded-2xl font-mono text-xs text-gray-600 uppercase tracking-wider">// Zero aligned compilation targets returned by query filter</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => { setSelectedProject(project); setActiveScreenshotIdx(0); }}
                  className="bg-[#05070b] border border-gray-900/80 hover:border-blue-900/40 p-5 rounded-2xl flex flex-col justify-between shadow-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        {project.icon_url ? (
                          <img src={project.icon_url} alt="" className="w-9 h-9 rounded-xl border border-gray-950 object-cover bg-black shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl border border-gray-900 bg-gray-950 flex items-center justify-center shrink-0">
                            <FolderGit2 className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">{project.title}</h4>
                          <span className="text-[10px] text-gray-500 font-mono font-medium block mt-0.5">{project.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-[#0a0f1d] border border-gray-900 px-2 py-0.5 rounded text-gray-400">v{project.version || '1.0.0'}</span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-3 font-normal">{project.description}</p>
                  </div>

                  <div className="mt-5 space-y-4 pt-4 border-t border-gray-950">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack?.slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-[9px] font-mono bg-gray-950 text-gray-500 px-2 py-0.5 rounded border border-gray-900/40">{tech}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between font-mono text-[10px] pt-1">
                      <span className={`inline-flex items-center gap-1 font-bold ${project.is_restricted ? 'text-amber-500/80' : 'text-gray-500'}`}>
                        {project.is_restricted ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {project.is_restricted ? 'RESTRICTED' : 'PUBLIC'}
                      </span>
                      <span className="text-blue-400 font-semibold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex items-center gap-1">
                        <span>Review Node</span>
                        <Eye className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Roadmap Timeline Section (NOW COMPLETELY DYNAMIC) */}
      <section id="roadmap" className="w-full max-w-7xl mx-auto px-6 py-20 scroll-mt-10">
        <div className="border-t border-gray-900/60 pt-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <h2 className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-2 border-l-2 border-purple-500 pl-2.5">// TARGET LOGISTICS VECTOR</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Academic Execution Roadmap</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-500 max-w-md font-normal leading-relaxed font-mono">
              // Sync Status: <span className="text-purple-400">LIVE_POSTGRES_BUFFER</span>. Tracks long-term specialization builds in engineering architecture.
            </p>
          </div>

          {/* Timeline Node Framework Layout */}
          {uiLoading ? (
            <div className="text-center py-12 font-mono text-xs text-gray-600 tracking-widest animate-pulse">// BUFFERING TIMELINE MATRICES...</div>
          ) : (
            <div className="relative border-l border-gray-900/80 ml-4 md:ml-6 space-y-10">
              {timelineMilestones.map((item) => (
                <RoadmapNode
                  key={item.id}
                  step={item.step}
                  title={item.title}
                  location={item.location}
                  description={item.description}
                  status={item.status}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* ==================== PORTFOLIO OVERLAY LIGHTBOX DRAWER MODAL ==================== */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#020305]/80 backdrop-blur-md font-sans animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#06080d] border border-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 scrollbar-thin">

            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white border border-gray-950 p-1.5 rounded-xl bg-gray-950/40 hover:border-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-950 pb-5">
              <div className="flex items-center gap-4">
                {selectedProject.icon_url ? (
                  <img src={selectedProject.icon_url} alt="" className="w-12 h-12 rounded-xl border border-gray-900 object-cover bg-black" />
                ) : (
                  <div className="w-12 h-12 rounded-xl border border-gray-900 bg-gray-950 flex items-center justify-center">
                    <FolderGit2 className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{selectedProject.title}</h3>
                  <div className="flex items-center gap-2 mt-1 font-mono text-[10px]">
                    <span className="text-gray-500">{selectedProject.category}</span>
                    <span className="text-gray-700">//</span>
                    <span className="text-blue-400 font-bold">Release Build Version {selectedProject.version || '1.0.0'}</span>
                  </div>
                </div>
              </div>

              <div className="font-mono text-[10px]">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg uppercase tracking-wider font-bold ${
                  selectedProject.status === 'Completed' ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30' : selectedProject.status === 'In Progress' ? 'text-amber-400 bg-amber-950/20 border border-amber-900/30' : 'text-blue-400 bg-blue-950/20 border border-blue-900/30'
                }`}>
                  {selectedProject.status}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-mono uppercase tracking-widest text-gray-600 font-bold">// Blueprinted System Operation Statement</h5>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-normal">{selectedProject.description}</p>
            </div>

            {selectedProject.screenshots && selectedProject.screenshots.length > 0 ? (
              <div className="space-y-3">
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-gray-600 font-bold">// Framework Interface Capture Proofs Matrix</h5>

                <div className="relative w-full aspect-video bg-black/40 border border-gray-950 rounded-xl overflow-hidden group/carousel flex items-center justify-center">
                  <img
                    src={selectedProject.screenshots[activeScreenshotIdx]}
                    alt="Deployment Capture Grid Capture"
                    className="max-w-full max-h-full object-contain"
                  />

                  {selectedProject.screenshots.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveScreenshotIdx(prev => (prev === 0 ? selectedProject.screenshots!.length - 1 : prev - 1))}
                        className="absolute left-3 p-2 rounded-xl bg-black/60 border border-gray-900 text-gray-400 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveScreenshotIdx(prev => (prev === selectedProject.screenshots!.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 p-2 rounded-xl bg-black/60 border border-gray-900 text-gray-400 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 font-mono text-[9px] text-gray-400 border border-gray-900 rounded-md">
                        {activeScreenshotIdx + 1} / {selectedProject.screenshots.length}
                      </div>
                    </>
                  )}
                </div>

                {selectedProject.screenshots.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {selectedProject.screenshots.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveScreenshotIdx(idx)}
                        className={`w-16 h-10 rounded-lg border overflow-hidden shrink-0 transition-all bg-black ${idx === activeScreenshotIdx ? 'border-blue-500 scale-95 shadow-md' : 'border-gray-950 opacity-40 hover:opacity-70'}`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-950 items-end">
              <div className="space-y-2">
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-gray-600 font-bold">// Engine Integration Core Arrays</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tech_stack?.map((tech, i) => (
                    <span key={i} className="text-[10px] font-mono bg-gray-950 text-gray-400 border border-gray-900 px-2.5 py-1 rounded-xl">{tech}</span>
                  ))}
                </div>
              </div>

              <div>
                {selectedProject.is_restricted ? (
                  <div
                    className="w-full py-3 bg-[#030406] border border-gray-950 text-gray-500 rounded-xl font-mono text-[11px] font-semibold tracking-wider flex items-center justify-center gap-2 cursor-not-allowed select-none"
                    title="This compilation framework references isolated internal infrastructure segments."
                  >
                    <Shield className="w-4 h-4 text-amber-500/80 animate-pulse" />
                    <span>Private Deployment // Locked Track</span>
                  </div>
                ) : selectedProject.file_url ? (
                  <a
                    href={selectedProject.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
                  >
                    <span>Extract Component Payload</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="w-full py-3 bg-[#030406] border border-dashed border-gray-950 text-gray-600 rounded-xl font-mono text-[10px] text-center select-none">
                    // Deployment Binary Pipeline Unassigned For Concept Staging Profiles
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
