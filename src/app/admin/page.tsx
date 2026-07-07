'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, Shield, FolderGit2, LogOut, ArrowUpRight, Cpu, Trash2, Layers, RefreshCcw, Search, CheckSquare, Square, EyeOff, Lock, Globe, Link2, UploadCloud, Calendar, Milestone } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Future Concept';
  tech_stack: string[];
  file_url: string;
  version: string;
  icon_url?: string;
  screenshots?: string[];
  is_restricted: boolean;
}

interface RoadmapMilestone {
  id: number;
  step: string;
  title: string;
  location: string;
  description: string;
  status: 'current' | 'upcoming' | 'future';
  sequence_order: number;
}

export default function AdminPortal() {
  // Authentication & Security Timeout States
  const [email] = useState('prayagdhariwal@gmail.com');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTimeoutActive, setSessionTimeoutActive] = useState(false);
  const activityTimer = useRef<NodeJS.Timeout | null>(null);

  // High-End Active Console View Tab Mode
  const [activeConsoleTab, setActiveConsoleTab] = useState<'projects' | 'roadmap'>('projects');

  // Core Form Input Parameters: Projects
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Future Concept'>('Completed');
  const [category, setCategory] = useState('Full-Stack Architecture');
  const [tagsInput, setTagsInput] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [isRestricted, setIsRestricted] = useState(false);

  // Hybrid Asset Attachment Routing Parameters
  const [payloadType, setPayloadType] = useState<'file' | 'link'>('file');
  const [externalLink, setExternalLink] = useState('');

  // File Staging Management States
  const [file, setFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);

  // Core Form Input Parameters: Roadmap
  const [milestoneStep, setMilestoneStep] = useState('01');
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneLocation, setMilestoneLocation] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneStatus, setMilestoneStatus] = useState<'current' | 'upcoming' | 'future'>('upcoming');
  const [milestoneOrder, setMilestoneOrder] = useState(1);

  // Pipeline Data Matrix Tracking States
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [existingProjects, setExistingProjects] = useState<Project[]>([]);
  const [existingMilestones, setExistingMilestones] = useState<RoadmapMilestone[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Selection Matrix & Query Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);

  // 1. Session Initialization and Security Activity Tracker Loop
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        if (typeof window !== 'undefined') {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsAuthenticated(true);
            syncConsoleData();
            resetActivityTimeout();
          }
        }
      } catch (err) {
        console.error("Session initialization fault:", err);
      } finally {
        setCheckingSession(false);
      }
    };
    checkActiveSession();

    const handleUserActivity = () => {
      if (isAuthenticated) resetActivityTimeout();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      if (activityTimer.current) clearTimeout(activityTimer.current);
    };
  }, [isAuthenticated]);

  const resetActivityTimeout = () => {
    if (activityTimer.current) clearTimeout(activityTimer.current);

    // 15-minute inactivity trigger
    activityTimer.current = setTimeout(async () => {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setSessionTimeoutActive(true);
      setExistingProjects([]);
      setExistingMilestones([]);
    }, 900000);
  };

  const syncConsoleData = async () => {
    setFetchingData(true);
    try {
      // Parallel cluster query synchronization
      const [projectsResponse, milestonesResponse] = await Promise.all([
        supabase.from('projects').select('*').order('id', { ascending: false }),
        supabase.from('academic_roadmap').select('*').order('sequence_order', { ascending: true })
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (milestonesResponse.error) throw milestonesResponse.error;

      setExistingProjects(projectsResponse.data || []);
      setExistingMilestones(milestonesResponse.data || []);
    } catch (err: any) {
      console.error("Database cluster query sync dropped:", err.message);
    } finally {
      setFetchingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSessionTimeoutActive(false);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(`Authorization Failed: ${error.message}`);
    } else {
      setIsAuthenticated(true);
      syncConsoleData();
      setPassword('');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUploadStatus('');
    setSelectedProjectIds([]);
  };

  // Native SDK Asset Uploader Stream
  const streamFileAsset = async (bucketPath: string, targetFile: File): Promise<string> => {
    const supabaseUrl = (supabase as any).supabaseUrl;
    if (!supabaseUrl) throw new Error("Missing initialized Supabase destination config.");

    setUploadProgress(45);

    const { error } = await supabase.storage
      .from('project-binaries')
      .upload(bucketPath, targetFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      setUploadProgress(null);
      throw new Error(`Storage gateway rejected payload: ${error.message}`);
    }

    setUploadProgress(100);
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/project-binaries/${bucketPath}`;
    setTimeout(() => setUploadProgress(null), 800);
    return publicUrl;
  };

  // Form Submission Router: Projects Array
  const handleProjectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsLoading(true);
    setUploadProgress(5);
    setUploadStatus('Processing deployment target vectors...');

    try {
      let finalBinaryUrl = '';
      let finalIconUrl = '';
      const finalScreenshotUrls: string[] = [];

      if (!isRestricted) {
        if (payloadType === 'file' && file) {
          setUploadStatus('Streaming target build file package asset...');
          const path = `binaries/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
          finalBinaryUrl = await streamFileAsset(path, file);
        } else if (payloadType === 'link' && externalLink) {
          finalBinaryUrl = externalLink;
        }
      }

      if (iconFile) {
        setUploadStatus('Streaming brand token graphical asset...');
        const path = `icons/${Date.now()}-${iconFile.name.replace(/\s+/g, '_')}`;
        finalIconUrl = await streamFileAsset(path, iconFile);
      }

      if (screenshotFiles.length > 0) {
        for (let i = 0; i < screenshotFiles.length; i++) {
          setUploadStatus(`Streaming interface proof capture [${i + 1}/${screenshotFiles.length}]...`);
          const path = `screenshots/${Date.now()}_idx${i}-${screenshotFiles[i].name.replace(/\s+/g, '_')}`;
          const url = await streamFileAsset(path, screenshotFiles[i]);
          finalScreenshotUrls.push(url);
        }
      }

      const tech_stack = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);

      const { data: matchedProject } = await supabase
        .from('projects')
        .select('*')
        .eq('title', title)
        .maybeSingle();

      if (matchedProject) {
        setUploadStatus(`Injecting semantic version patch [${version}] over target node...`);
        const { error } = await supabase
          .from('projects')
          .update({
            description, status, category, tech_stack, version,
            is_restricted: isRestricted,
            file_url: isRestricted ? '' : (finalBinaryUrl || matchedProject.file_url),
            icon_url: finalIconUrl || matchedProject.icon_url,
            screenshots: finalScreenshotUrls.length > 0 ? finalScreenshotUrls : matchedProject.screenshots
          })
          .eq('id', matchedProject.id);

        if (error) throw error;
        setUploadStatus(`Version pipeline successfully patched to: ${version}`);
      } else {
        setUploadStatus('Registering clean deployment row schema...');
        const { error } = await supabase.from('projects').insert([{
          title, description, status, category, tech_stack, version,
          is_restricted: isRestricted, file_url: isRestricted ? '' : finalBinaryUrl,
          icon_url: finalIconUrl, screenshots: finalScreenshotUrls
        }]);

        if (error) throw error;
        setUploadStatus(`Success! Clean target initialized at version: ${version}`);
      }

      // Input Reset Mapping
      setTitle(''); setDescription(''); setTagsInput(''); setExternalLink('');
      setVersion('1.0.0'); setCategory('Full-Stack Architecture'); setIsRestricted(false);
      setFile(null); setIconFile(null); setScreenshotFiles([]);
      syncConsoleData();
    } catch (err: any) {
      setUploadStatus(`Transmission Fault Triggered: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Form Submission Router: Roadmap Milestones
  const handleRoadmapUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle || !milestoneDescription) return;

    setIsLoading(true);
    setUploadStatus('Injecting milestone track over logistics target vector...');

    try {
      const { data: matchedMilestone } = await supabase
        .from('academic_roadmap')
        .select('*')
        .eq('step', milestoneStep)
        .maybeSingle();

      if (matchedMilestone) {
        const { error } = await supabase
          .from('academic_roadmap')
          .update({
            title: milestoneTitle,
            location: milestoneLocation,
            description: milestoneDescription,
            status: milestoneStatus,
            sequence_order: milestoneOrder
          })
          .eq('id', matchedMilestone.id);

        if (error) throw error;
        setUploadStatus(`Milestone sector [${milestoneStep}] updated successfully.`);
      } else {
        const { error } = await supabase.from('academic_roadmap').insert([{
          step: milestoneStep, title: milestoneTitle, location: milestoneLocation,
          description: milestoneDescription, status: milestoneStatus, sequence_order: milestoneOrder
        }]);

        if (error) throw error;
        setUploadStatus(`New milestone node [${milestoneStep}] initialized cleanly.`);
      }

      setMilestoneTitle(''); setMilestoneLocation(''); setMilestoneDescription('');
      setMilestoneStep((prev) => String(Number(prev) + 1).padStart(2, '0'));
      setMilestoneOrder((prev) => prev + 1);
      syncConsoleData();
    } catch (err: any) {
      setUploadStatus(`Timeline Matrix Fault: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // Table Matrix Helper: Toggle master checkbox select allocation rules
  const handleToggleSelectAll = () => {
    if (selectedProjectIds.length === filteredProjects.length) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(filteredProjects.map(p => p.id));
    }
  };

  // Table Matrix Helper: Toggle selective individual project checkbox states
  const handleToggleSelectProject = (id: number) => {
    if (selectedProjectIds.includes(id)) {
      setSelectedProjectIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedProjectIds(prev => [...prev, id]);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Are you sure you want to terminate deployment: "${project.title}"?`)) return;
    try {
      if (project.file_url && project.file_url.includes('/project-binaries/')) {
        const path = project.file_url.split('/project-binaries/')[1];
        await supabase.storage.from('project-binaries').remove([path]);
      }
      const { error } = await supabase.from('projects').delete().eq('id', project.id);
      if (error) throw error;
      syncConsoleData();
    } catch (err: any) {
      alert(`Deletion Failure: ${err.message}`);
    }
  };

  const handleDeleteMilestone = async (id: number) => {
    if (!confirm("Terminate target academic roadmap milestone vector?")) return;
    try {
      const { error } = await supabase.from('academic_roadmap').delete().eq('id', id);
      if (error) throw error;
      syncConsoleData();
    } catch (err: any) {
      alert(`Timeline Node Error: ${err.message}`);
    }
  };

  const handleBulkPurgeRoutine = async () => {
    if (!confirm(`CRITICAL TERMINAL PURGE OPERATION: Permanently execute erase sequence over [${selectedProjectIds.length}] records?`)) return;
    setFetchingData(true);
    try {
      const targets = existingProjects.filter(p => selectedProjectIds.includes(p.id));
      for (const target of targets) {
        if (target.file_url && target.file_url.includes('/project-binaries/')) {
          const path = target.file_url.split('/project-binaries/')[1];
          await supabase.storage.from('project-binaries').remove([path]);
        }
      }
      await supabase.from('projects').delete().in('id', selectedProjectIds);
      setSelectedProjectIds([]);
      syncConsoleData();
    } catch (err: any) {
      alert(`Bulk Operational Failure: ${err.message}`);
    } finally {
      setFetchingData(false);
    }
  };

  const filteredProjects = existingProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#030407] flex items-center justify-center font-mono text-xs text-gray-600 tracking-widest">
        ESTABLISHING SECURE CONNECTIVITY MESH...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030407] overflow-hidden antialiased px-4">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#1e3a8a_0%,transparent_70%)] opacity-5" />
        <div className="relative z-10 w-full max-w-sm bg-[#080a10] border border-gray-900 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold font-mono tracking-wider text-white">SYSTEM AUTHENTICATION</h1>
            <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">// ROOT ACCESS PORT</p>
          </div>
          {sessionTimeoutActive && (
            <div className="flex items-center gap-2 p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl font-mono text-[10px] text-amber-400">
              <Shield className="w-4 h-4 shrink-0 animate-pulse" />
              <span>LOG: WORKSPACE LOCKED DUE TO INACTIVITY.</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER SECURE ACCESS PASSKEY"
              className="w-full bg-[#030407] border border-gray-950 focus:border-blue-500 rounded-xl px-4 py-3 text-white text-center tracking-widest text-xs font-mono focus:outline-none transition-colors"
              autoFocus
            />
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-mono text-xs font-bold rounded-xl text-white transition-all">
              {isLoading ? 'DECRYPTING COMPILER ACCESS...' : 'DECRYPT SYSTEM INTERFACE'}
            </button>
          </form>
          {errorMsg && <p className="text-center font-mono text-xs text-red-400 bg-red-950/20 p-2 border border-red-900/40 rounded-xl">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020305] bg-grid-pattern text-gray-300 antialiased selection:bg-blue-500/30 selection:text-blue-400">

      {/* Structural Global Navigation Bar Component */}
      <header className="w-full border-b border-gray-900/80 bg-[#06080d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]" />
            <span className="font-bold text-white text-sm tracking-tight font-mono">PD // ARCHITECT CONTROL NODE v3.2.0</span>
          </div>

          {/* Dashboard Module Toggle Switch Matrix */}
          <div className="flex items-center bg-[#030406] border border-gray-900 rounded-xl p-1 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => setActiveConsoleTab('projects')}
              className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${activeConsoleTab === 'projects' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-400'}`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              Repositories
            </button>
            <button
              type="button"
              onClick={() => setActiveConsoleTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${activeConsoleTab === 'roadmap' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-400'}`}
            >
              <Milestone className="w-3.5 h-3.5" />
              Roadmap Timeline
            </button>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 font-mono text-[11px] text-gray-500 hover:text-red-400 border border-gray-900 bg-[#07090e] px-4 py-2 rounded-xl transition-all">
            <LogOut className="w-3 h-3" />
            <span>LOCK SITE</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT AREA CONSOLE SPLIT: INPUT FORM MATRICES */}
          <div className="lg:col-span-7 space-y-6">
            {activeConsoleTab === 'projects' ? (
              // SUB-FORM LAYER 01: REPOSITORY CLUSTER MANAGEMENTS
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5 font-mono">
                    <FolderGit2 className="w-5 h-5 text-blue-400" />
                    Release Core Staging Array
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">Upload project variants and configure system privacy access blocks dynamically.</p>
                </div>

                <form onSubmit={handleProjectUpload} className="bg-[#06080d] border border-gray-900/60 p-6 md:p-8 rounded-2xl space-y-5 shadow-2xl font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">// Target Name (Match to overwrite version)</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Vidhya Security Force App" className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">// Semantic Release Version</label>
                      <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} required placeholder="1.0.0" className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white text-center font-bold focus:outline-none" />
                    </div>
                  </div>

                  <div className="p-4 bg-[#040509] border border-gray-950 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5 max-w-[75%]">
                      <div className="text-white font-bold flex items-center gap-1.5">
                        <Shield className={`w-3.5 h-3.5 ${isRestricted ? 'text-amber-500 animate-pulse' : 'text-gray-500'}`} />
                        Restricted Personal Deployment (Locked Track)
                      </div>
                      <p className="text-[10px] text-gray-600 leading-normal">Flags this target as containing private business databases. Removes public download parameters completely.</p>
                    </div>
                    <button type="button" onClick={() => setIsRestricted(!isRestricted)} className={`px-4 py-2 rounded-xl border text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${isRestricted ? 'bg-amber-950/20 border-amber-900/50 text-amber-400 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.05)]' : 'bg-transparent border-gray-900 text-gray-500'}`}>
                      {isRestricted ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      {isRestricted ? 'RESTRICTED' : 'PUBLIC'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">// Cluster Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer">
                        <option value="Full-Stack Architecture">Full-Stack Architecture</option>
                        <option value="Frontend UI/UX">Frontend UI/UX</option>
                        <option value="Mobile Application Architecture">Mobile Application Architecture</option>
                        <option value="Desktop Utility Build">Desktop Utility Build</option>
                        <option value="System Design & Concept">System Design & Concept</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">// Operational Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer">
                        <option value="Completed">Completed (Allows Active Download)</option>
                        <option value="In Progress">In Progress (Locked Track)</option>
                        <option value="Future Concept">Future Concept (Prototype Canvas)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold">// Logical Operations Blueprint Statement</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="Describe frameworks and guard/owner system operations workflows..." className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none resize-none leading-relaxed" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold">// Technical Architecture Tags</label>
                    <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} required placeholder="Next.js, Tailwind, Supabase" className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none" />
                  </div>

                  <div className={`space-y-3 transition-all ${isRestricted ? 'opacity-30 pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between border-b border-gray-900/60 pb-1.5">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">// Payload Source Channel</span>
                      <div className="flex items-center bg-[#030406] border border-gray-950 p-0.5 rounded-lg">
                        <button type="button" disabled={isRestricted} onClick={() => setPayloadType('file')} className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all uppercase ${payloadType === 'file' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}>
                          <UploadCloud className="w-3 h-3" /> Raw File
                        </button>
                        <button type="button" disabled={isRestricted} onClick={() => setPayloadType('link')} className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all uppercase ${payloadType === 'link' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}>
                          <Link2 className="w-3 h-3" /> External Link
                        </button>
                      </div>
                    </div>

                    {!isRestricted && payloadType === 'link' ? (
                      <div className="space-y-1.5 animate-fadeIn">
                        <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">// External Payload Link Address</label>
                        <input type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} required={!isRestricted && payloadType === 'link'} placeholder="https://github.com/Prayag-5826/.../releases/download/v1.0/App.apk" className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none" />
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">// Binary Payload File</span>
                      <div className={`relative border border-dashed border-gray-900 rounded-xl p-3 text-center truncate transition-opacity ${isRestricted || payloadType === 'link' ? 'opacity-30 pointer-events-none bg-gray-950/50' : 'bg-[#030406]'}`}>
                        <input type="file" accept=".exe,.apk,.zip,.rar" disabled={isRestricted || payloadType === 'link'} onChange={(e) => setFile(e.target.files?.[0] || null)} required={status === 'Completed' && !isRestricted && payloadType === 'file' && !existingProjects.some(p => p.title === title)} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <span className="text-gray-400 text-[10px]">{file ? `📦 ${file.name.substring(0, 12)}...` : isRestricted ? "PAYLOAD LOCKED" : payloadType === 'link' ? "LINK ENGAGED" : "Attach Package"}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">// Brand Token Logo</span>
                      <div className="relative border border-dashed border-gray-900 rounded-xl bg-[#030406] p-3 text-center truncate">
                        <input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <span className="text-emerald-500/80 text-[10px]">{iconFile ? `🎨 ${iconFile.name.substring(0, 12)}...` : "Attach Image"}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">// UI Proof Captures</span>
                      <div className="relative border border-dashed border-gray-900 rounded-xl bg-[#030406] p-3 text-center truncate">
                        <input type="file" accept="image/*" multiple onChange={(e) => setScreenshotFiles(Array.from(e.target.files || []))} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <span className="text-purple-400 text-[10px]">{screenshotFiles.length > 0 ? `🖼️ ${screenshotFiles.length} Added` : "Attach Screen Grid"}</span>
                      </div>
                    </div>
                  </div>

                  {uploadProgress !== null && uploadProgress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>TRANSMITTING CORE MEMORY CHUNK BUFFERS TO STORAGE REMOTES...</span>
                        <span className="text-blue-400 font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#030406] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-350" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <span>{isLoading ? 'TRANSMITTING REPOSITORY RELEASES...' : 'EXECUTE REPOSITORY INJECTION'}</span>
                    {!isLoading && <ArrowUpRight className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            ) : (
              // SUB-FORM LAYER 02: ACADEMIC ROADMAP VECTOR TRACKINGS
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5 font-mono">
                    <Milestone className="w-5 h-5 text-purple-400" />
                    Logistics Timeline Vector Registry
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">Patch, register, or shift tracking statuses on your scholastic timeline nodes seamlessly.</p>
                </div>

                <form onSubmit={handleRoadmapUpload} className="bg-[#06080d] border border-gray-900/60 p-6 md:p-8 rounded-2xl space-y-5 shadow-2xl font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">// Step Identifier Code</label>
                      <input type="text" value={milestoneStep} onChange={(e) => setMilestoneStep(e.target.value)} required placeholder="01" className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white text-center font-bold focus:outline-none focus:border-purple-500/50" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">// Milestone Terminal Title</label>
                      <input type="text" value={milestoneTitle} onChange={(e) => setMilestoneTitle(e.target.value)} required placeholder="BCA Undergraduate Degree Focus" className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">// Campus Node / Target Location</label>
                      <input type="text" value={milestoneLocation} onChange={(e) => setMilestoneLocation(e.target.value)} required placeholder="Target: Christ University, Bangalore" className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">// Timeline Rendering Order</label>
                      <input type="number" value={milestoneOrder} onChange={(e) => setMilestoneOrder(Number(e.target.value))} required min={1} className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white text-center font-bold focus:outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold">// Operational State Tracker</label>
                    <select value={milestoneStatus} onChange={(e) => setMilestoneStatus(e.target.value as any)} className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer">
                      <option value="current">Current Active Cycle (Pulse Beacon)</option>
                      <option value="upcoming">Upcoming Allocated Milestone</option>
                      <option value="future">Future Structural Horizon Goal</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold">// Curricular Blueprint Description</label>
                    <textarea value={milestoneDescription} onChange={(e) => setMilestoneDescription(e.target.value)} required rows={4} placeholder="Summarize technical priorities, examination vectors (NIMCET/GATE), and research targets..." className="w-full bg-[#030406] border border-gray-900 rounded-xl px-4 py-2.5 text-white focus:outline-none resize-none leading-relaxed" />
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <span>{isLoading ? 'COMMITTING TIMELINE STRUCT...' : 'INJECT TIMELINE MILESTONE VECTOR'}</span>
                    {!isLoading && <Calendar className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT AREA CONSOLE SPLIT: LIVE TELEMETRY MATRIX MONITOR */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 font-mono text-xs">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-gray-500" />
                Live Build Manifest
              </h2>
              <p className="text-xs text-gray-500">Structured system compile logs tracking security rules in real time.</p>
            </div>

            <div className="bg-[#040509] border border-gray-900 rounded-2xl p-5 shadow-2xl text-blue-400/80 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-[9px] text-gray-600 tracking-widest font-bold">COMPILER_MIRROR</div>

              {activeConsoleTab === 'projects' ? (
                <div className="space-y-1 text-[11px] animate-fadeIn">
                  <div><span className="text-gray-600">01 //</span> <span className="text-purple-400">const</span> repositoryState = {"{"}</div>
                  <div className="pl-6"><span className="text-amber-500">"target_cluster"</span>: <span className="text-emerald-400">"{title || 'UNASSIGNED'}"</span>,</div>
                  <div className="pl-6"><span className="text-amber-500">"category"</span>: <span className="text-emerald-400">"{category}"</span>,</div>
                  <div className="pl-6"><span className="text-amber-500">"is_restricted"</span>: <span className="text-purple-400">{isRestricted ? 'true' : 'false'}</span>,</div>
                  <div className="pl-6"><span className="text-amber-500">"version"</span>: <span className="text-emerald-400">"{version}"</span>,</div>
                  <div className="pl-6"><span className="text-amber-500">"payload"</span>: <span className="text-emerald-400">{isRestricted ? '"LOCKED"' : (payloadType === 'link' ? '"URI_STREAM"' : '"FILE_BUFFER"')}</span></div>
                  <div>{"};"}</div>
                </div>
              ) : (
                <div className="space-y-1 text-[11px] animate-fadeIn">
                  <div><span className="text-gray-600">01 //</span> <span className="text-purple-400">const</span> logisticsRoadmapNode = {"{"}</div>
                  <div className="pl-6"><span className="text-amber-500">"step_code"</span>: <span className="text-emerald-400">"{milestoneStep}"</span>,</div>
                  <div className="pl-6"><span className="text-amber-500">"node_title"</span>: <span className="text-emerald-400">"{milestoneTitle || 'UNREGISTERED'}"</span>,</div>
                  <div className="pl-6"><span className="text-amber-500">"sequence"</span>: <span className="text-purple-400">{milestoneOrder}</span>,</div>
                  <div className="pl-6"><span className="text-amber-500">"status_tag"</span>: <span className="text-emerald-400">"{milestoneStatus}"</span></div>
                  <div>{"};"}</div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-950 text-[10px] text-gray-600 space-y-1.5">
                <div>&gt;&gt; LOG: Channel connection verified. Security matrix clear.</div>
                {uploadStatus && <div className="text-yellow-500 animate-pulse">&gt;&gt; MONITOR: {uploadStatus}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM AREA CONSOLE: DATA REPOSITORY MANAGEMENT MATRIX TABLES */}
        <div className="space-y-6 pt-4 font-mono text-xs">
          {activeConsoleTab === 'projects' ? (
            // GRID REPOSITORY CONTROL TABLE
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
                    <Layers className="w-5 h-5 text-gray-400" />
                    Active Database Repositories
                  </h2>
                  <p className="text-xs text-gray-500">Select cluster targets to execute bulk clean sequences over row segments.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="QUERY DATA TABLE..." className="bg-[#06080d] border border-gray-900 focus:border-gray-800 rounded-xl pl-9 pr-4 py-2 w-48 text-white focus:outline-none placeholder-gray-700" />
                  </div>

                  <div className="flex items-center bg-[#06080d] border border-gray-900 rounded-xl p-1 text-[10px]">
                    {['ALL', 'Completed', 'In Progress', 'Future Concept'].map((tab) => (
                      <button key={tab} type="button" onClick={() => setStatusFilter(tab)} className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all ${statusFilter === tab ? 'bg-blue-600 text-white font-bold' : 'text-gray-500 hover:text-gray-400'}`}>{tab}</button>
                    ))}
                  </div>

                  {selectedProjectIds.length > 0 && (
                    <button onClick={handleBulkPurgeRoutine} className="flex items-center gap-1.5 text-red-400 border border-red-950/60 bg-red-950/10 hover:bg-red-950/20 px-3 py-2 rounded-xl transition-all font-bold">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>PURGE SELECTED ({selectedProjectIds.length})</span>
                    </button>
                  )}

                  <button onClick={syncConsoleData} disabled={fetchingData} className="flex items-center gap-1.5 border border-gray-900 rounded-xl px-3 py-2 text-gray-400 bg-[#06080d] hover:text-white transition-colors">
                    <RefreshCcw className={`w-3 h-3 ${fetchingData ? 'animate-spin' : ''}`} />
                    <span>RE-SYNC</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#06080d] border border-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse text-[11px] leading-normal">
                  <thead>
                    <tr className="border-b border-gray-950 text-gray-500 uppercase font-bold tracking-wider bg-[#030406]/40 h-12">
                      <th className="pl-5 pr-3 w-10">
                        <button type="button" onClick={handleToggleSelectAll} className="text-gray-600">
                          {selectedProjectIds.length === filteredProjects.length && filteredProjects.length > 0 ? <CheckSquare className="w-4 h-4 text-blue-500" /> : <Square className="w-4 h-4" />}
                        </button>
                      </th>
                      <th className="px-4 font-bold">Release Build Target</th>
                      <th className="px-4 font-bold">Category</th>
                      <th className="px-4 font-bold">Ver. Release</th>
                      <th className="px-4 font-bold">Privacy Tier</th>
                      <th className="px-4 font-bold">Operational Status</th>
                      <th className="pr-6 text-right font-bold w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-950/30">
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-600 tracking-widest uppercase font-bold">// NO ALIGNED PACKETS RETURNED BY SCAN PARAMETERS</td>
                      </tr>
                    ) : (
                      filteredProjects.map((project) => (
                        <tr key={project.id} className={`hover:bg-[#030407]/20 h-14 ${selectedProjectIds.includes(project.id) ? 'bg-blue-950/10' : ''}`}>
                          <td className="pl-5 pr-3">
                            <button type="button" onClick={() => handleToggleSelectProject(project.id)} className="text-gray-600">
                              {selectedProjectIds.includes(project.id) ? <CheckSquare className="w-4 h-4 text-blue-500" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>
                          <td className="px-4 text-white font-bold">
                            <div className="flex items-center gap-3">
                              {project.icon_url ? <img src={project.icon_url} alt="" className="w-6 h-6 rounded-lg object-cover bg-black shrink-0 border border-gray-900" /> : <div className="w-6 h-6 rounded-lg border border-gray-900 bg-gray-950 shrink-0" />}
                              <span className="truncate max-w-[200px]">{project.title}</span>
                            </div>
                          </td>
                          <td className="px-4 text-gray-500 truncate max-w-[150px]">{project.category}</td>
                          <td className="px-4 text-gray-400 font-bold">v{project.version}</td>
                          <td className="px-4">
                            <span className={`inline-flex items-center gap-1.5 font-bold font-mono text-[9px] uppercase ${project.is_restricted ? 'text-amber-500' : 'text-gray-400'}`}>
                              {project.is_restricted ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                              {project.is_restricted ? 'RESTRICTED' : 'OPEN ACCESS'}
                            </span>
                          </td>
                          <td className="px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${project.status === 'Completed' ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30' : project.status === 'In Progress' ? 'text-amber-400 bg-amber-950/20 border border-amber-900/30' : 'text-blue-400 bg-blue-950/20 border border-blue-900/30'}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="pr-6 text-right">
                            <button onClick={() => handleDeleteProject(project)} className="text-gray-600 hover:text-red-400 p-1 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // SCHOLASTIC TIMELINE TIMELINE CONSOLE ROW TABLE
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
                    <Milestone className="w-5 h-5 text-gray-400" />
                    Active Timeline Milestone Segments
                  </h2>
                  <p className="text-xs text-gray-500">Review and erase milestone tracks actively populating your roadmap network vector.</p>
                </div>
                <button onClick={syncConsoleData} disabled={fetchingData} className="flex items-center gap-1.5 border border-gray-900 rounded-xl px-3 py-2 text-gray-400 bg-[#06080d] hover:text-white transition-colors">
                  <RefreshCcw className={`w-3 h-3 ${fetchingData ? 'animate-spin' : ''}`} />
                  <span>RE-SYNC</span>
                </button>
              </div>

              <div className="bg-[#06080d] border border-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse text-[11px] leading-normal">
                  <thead>
                    <tr className="border-b border-gray-950 text-gray-500 uppercase font-bold tracking-wider bg-[#030406]/40 h-12">
                      <th className="pl-6 font-bold w-16">Step</th>
                      <th className="px-4 font-bold">Milestone Node Target</th>
                      <th className="px-4 font-bold">Location Hub</th>
                      <th className="px-4 font-bold">Render Order</th>
                      <th className="px-4 font-bold">Operational Status</th>
                      <th className="pr-6 text-right font-bold w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-950/30">
                    {existingMilestones.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-600 tracking-widest uppercase font-bold">// TIMELINE DATA ROW BUFFER EMPTY</td>
                      </tr>
                    ) : (
                      existingMilestones.map((milestone) => (
                        <tr key={milestone.id} className="hover:bg-[#030407]/20 h-14">
                          <td className="pl-6 text-purple-400 font-bold font-mono">#{milestone.step}</td>
                          <td className="px-4 text-white font-bold tracking-tight">{milestone.title}</td>
                          <td className="px-4 text-gray-400">{milestone.location}</td>
                          <td className="px-4 text-gray-500 font-bold font-mono">Seq_{milestone.sequence_order}</td>
                          <td className="px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${milestone.status === 'current' ? 'text-blue-400 bg-blue-950/20 border border-blue-900/30 animate-pulse' : milestone.status === 'upcoming' ? 'text-purple-400 bg-purple-950/20 border border-purple-900/30' : 'text-gray-500 bg-gray-950 border border-gray-900'}`}>
                              {milestone.status}
                            </span>
                          </td>
                          <td className="pr-6 text-right">
                            <button onClick={() => handleDeleteMilestone(milestone.id)} className="text-gray-600 hover:text-red-400 p-1 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
