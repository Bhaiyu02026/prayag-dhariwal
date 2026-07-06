import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import ProjectCard from '@/components/ui/ProjectCard';
import Navbar from '@/components/ui/Navbar';
import RoadmapNode from '@/components/ui/RoadmapNode';
import Footer from '@/components/ui/Footer';

const careerTimeline = [
  {
    step: "01",
    title: "Class 12 (Computer Science)",
    location: "Indore",
    description: "Building strong foundations in logical programming structures, advanced algorithms, and data system operations.",
    status: "current" as const,
  },
  {
    step: "02",
    title: "BCA Undergraduate Degree",
    location: "Target: Christ University",
    description: "Studying core computational frameworks, software design paradigms, and professional communication strategies.",
    status: "upcoming" as const,
  },
  {
    step: "03",
    title: "NIMCET Examination Tracker",
    location: "National Level Entrance",
    description: "Targeting top-tier NIT campuses through rigorous mathematics and analytical problem-solving preparation.",
    status: "upcoming" as const,
  },
  {
    step: "04",
    title: "MCA Degree & GATE Preparation",
    location: "Top NIT // IIT Entrance Focus",
    description: "Mastering advanced computer systems theory while securing top placement goals in the national GATE CS exam.",
    status: "upcoming" as const,
  },
  {
    step: "05",
    title: "Ph.D. in Software Engineering",
    location: "Doctorate Research Node",
    description: "Completing terminal academic research focused on massive infrastructure scaling, optimization, and system modularity.",
    status: "future" as const,
  }
];

export default async function PortfolioHome() {
  const { data: uploadedProjects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch projects:', error);
  }

  const staticProjects: Project[] = [
    {
      id: "vidhya-security",
      title: "Vidhya Security Force App",
      description: "A secure multi-dashboard workspace application structuring unique validation workflows for Guards, Supervisors, and Owners.",
      status: "In Progress",
      category: "Full Stack Development",
      tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"]
    },
    {
      id: "bean-bloom",
      title: "Bean & Bloom Hub",
      description: "A premium, viewport-optimized storytelling interface designed for an elite coffee house collective located at Apollo Premier, Vijay Nagar.",
      status: "In Progress",
      category: "Frontend UI/UX",
      tech_stack: ["React", "Tailwind CSS", "Framer Motion"]
    },
    {
      id: "ecopath-infra",
      title: "ECOPATH Infrastructure Core",
      description: "A sustainable smart-city concept blueprinting modular highway architectures that actively integrate carbon-absorbing materials.",
      status: "Future Concept",
      category: "System Design",
      tech_stack: ["Research", "Sustainability"]
    }
  ];

  const allProjects: Project[] = [...(uploadedProjects || []), ...staticProjects];

  return (
    <div className="flex flex-col min-h-screen bg-[#030407] bg-grid-pattern selection:bg-blue-600/40 text-gray-300 antialiased">
      <Navbar />

      {/* Hero Header Area with Radial Background Glow */}
      <header className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-24 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-20 left-1/3 w-[350px] h-[350px] bg-purple-600/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative z-10">
          {/* Main Context Typography */}
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#0a0f1d] border border-blue-500/20 px-3.5 py-1 rounded-full text-[11px] font-mono tracking-wider text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              SYSTEMS ARCHITECT TRACK
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05]">
              Prayag Dhariwal
            </h1>

            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              Software engineer crafting functional application tools, standalone deployment builds, and refined user interfaces.
              Focused on a systematic engineering roadmap running through a{' '}
              <span className="text-white font-medium">BCA at Christ University</span>, cracking the{' '}
              <span className="text-white font-medium">NIMCET MCA track</span>, passing{' '}
              <span className="text-white font-medium">GATE</span>, and finishing academic{' '}
              <span className="text-blue-400 font-semibold">Ph.D. Software Engineering Research</span>.
            </p>
          </div>

          {/* Clean Informational Matrix Card */}
          <div className="bg-[#090b11] border border-gray-900/80 p-6 rounded-2xl space-y-4 font-mono text-xs shadow-2xl relative group hover:border-blue-900/50 transition-all duration-300">
            <div className="text-gray-600 uppercase tracking-widest text-[9px] font-bold">// USER STATUS MATRIX</div>

            <div className="flex justify-between border-b border-gray-950 pb-2.5">
              <span className="text-gray-500">AGE OPERATIONAL:</span>
              <span className="text-gray-200 font-bold">17 Years Old</span>
            </div>
            <div className="flex justify-between border-b border-gray-950 pb-2.5">
              <span className="text-gray-500">ACADEMIC PHASE:</span>
              <span className="text-emerald-400 font-bold">Class 12 (CS)</span>
            </div>
            <div className="flex justify-between border-b border-gray-950 pb-2.5">
              <span className="text-gray-500">NODE LOCATION:</span>
              <span className="text-gray-200 font-bold">Indore, India</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">CORE FOCUS:</span>
              <span className="text-blue-400 font-bold">Application Logic</span>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <section id="repository" className="w-full max-w-7xl mx-auto px-6 py-20 scroll-mt-10">
        <div className="border-t border-gray-900/60 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-14">
            <div>
              <h2 className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-2">// DATA STORAGE</h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">Project Download Center</h3>
            </div>
            <p className="text-sm text-gray-400 max-w-md md:text-right font-normal leading-relaxed">
              Standalone application installers, binary build formats (`.exe` / `.apk`), and live workspace asset targets stored securely on remote file blocks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section id="roadmap" className="w-full max-w-7xl mx-auto px-6 py-20 scroll-mt-10">
        <div className="border-t border-gray-900/60 pt-20">
          <div className="mb-16">
            <h2 className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-2">// DIRECTION VECTOR</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">Academic Execution Timeline</h3>
          </div>

          {/* Timeline Node Framework */}
          <div className="relative border-l-2 border-gray-900 ml-4 md:ml-6 space-y-8">
            {careerTimeline.map((item, index) => (
              <RoadmapNode
                key={index}
                step={item.step}
                title={item.title}
                location={item.location}
                description={item.description}
                status={item.status}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
