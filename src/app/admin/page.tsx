'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, Shield, FolderGit2, LogOut, ArrowUpRight, Cpu } from 'lucide-react';

export default function AdminPortal() {
  // Authentication states
  const [email] = useState('prayagdhariwal@gmail.com');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Storage and Database Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Future Concept'>('Completed');
  const [category, setCategory] = useState('Desktop UI');
  const [tagsInput, setTagsInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // 1. Monitor active session status during app mount
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        if (typeof window !== 'undefined') {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      } finally {
        setCheckingSession(false);
      }
    };
    checkActiveSession();
  }, []);

  // 2. Login verification via secure Supabase pipeline
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(`Authorization Failed: ${error.message}`);
    } else {
      setIsAuthenticated(true);
      setPassword('');
    }
    setIsLoading(false);
  };

  // 3. Clear sessions securely
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUploadStatus('');
  };

  // 4. File submission workflow routine
  const handleFormUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !file) {
      setUploadStatus('Missing required form data fields.');
      return;
    }

    setIsLoading(true);
    setUploadStatus('Uploading build target to Supabase Storage...');

    try {
      const fileExt = file.name.split('.').pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const bucketPath = `binaries/${uniqueName}`;

      const { error: storageError } = await supabase.storage
        .from('project-binaries')
        .upload(bucketPath, file);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-binaries')
        .getPublicUrl(bucketPath);

      const tech_stack = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);

      const { error: dbError } = await supabase.from('projects').insert([
        {
          title,
          description,
          status,
          category,
          tech_stack,
          file_url: publicUrl
        }
      ]);

      if (dbError) throw dbError;

      setUploadStatus('Success! Build asset successfully pushed to your repository.');
      setTitle('');
      setDescription('');
      setTagsInput('');
      setFile(null);
    } catch (err: any) {
      setUploadStatus(`Transmission Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#030407] flex items-center justify-center font-mono text-xs text-gray-600 tracking-widest">
        ESTABLISHING SECURE CONNECTIVITY MESH...
      </div>
    );
  }

  // ==================== SCREEN A: PREMIUM SIGN IN TERMINAL ====================
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030407] overflow-hidden antialiased px-4">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#1e3a8a_0%,transparent_70%)] opacity-5" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-[#0a0f1d]">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-mono font-bold text-xl tracking-tighter">PD</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">ADMIN VAULT</h1>
            <p className="mt-2 text-gray-500 font-mono text-[10px] tracking-widest">SUPABASE USER STATE PORTAL</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#080a10] border border-gray-900 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                VERIFIED MESH CHANNEL
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">ACCESS PASSPHRASE</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full bg-[#030407] border border-gray-950 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-800 font-mono focus:outline-none transition-colors duration-200"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-900/10 flex items-center justify-center gap-2"
              >
                {isLoading ? 'DECRYPTING...' : 'UNLOCK VAULT PIPELINE'}
              </button>

              {errorMsg && (
                <div className="text-red-400 text-xs font-mono bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-center">
                  {errorMsg}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==================== SCREEN B: MASTER CONTROL DEPLOYMENT WORKSPACE (RE-DESIGNED) ====================
  return (
    <div className="min-h-screen bg-[#020305] bg-grid-pattern text-gray-300 antialiased selection:bg-blue-500/30 selection:text-blue-400">

      {/* Upper Status Ribbon Control Node */}
      <header className="w-full border-b border-gray-900/80 bg-[#06080d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <Cpu className="w-3 h-3 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-white text-sm tracking-tight">PD // CORE CONSOLE</span>
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest hidden sm:inline-block">// v2.0.46 PRODUCTION</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-[#090d16] border border-gray-900 px-3 py-1.5 rounded-lg font-mono text-[10px] text-gray-400">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>AUTH NODE STATE: SECURE_ROOT</span>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 font-mono text-[11px] text-gray-400 hover:text-red-400 border border-gray-900 hover:border-red-950 bg-[#07090e] px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm"
            >
              <LogOut className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              <span>LOCK SYSTEM</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame Workspace Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT 7-COLUMNS: THE DATA MANAGEMENT MANIFEST FORM ENGINE */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <FolderGit2 className="w-5 h-5 text-blue-400" />
                Register New Build Target
              </h2>
              <p className="text-xs text-gray-500">Inject code package releases directly into your global Supabase PostgreSQL cluster rows.</p>
            </div>

            <form onSubmit={handleFormUpload} className="bg-[#06080d] border border-gray-900/60 p-6 md:p-8 rounded-2xl space-y-6 shadow-2xl relative group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase font-bold">// Project Name</label>
                  <input
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                    placeholder="e.g., Vidhya Security Shield"
                    className="w-full bg-[#030406] border border-gray-900/80 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-800 focus:outline-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase font-bold">// System Category</label>
                  <input
                    type="text" value={category} onChange={(e) => setCategory(e.target.value)} required
                    placeholder="e.g., Mobile Application Architecture"
                    className="w-full bg-[#030406] border border-gray-900/80 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-800 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase font-bold">// Operational Logic Profile</label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                  placeholder="Detail the framework scope, database parameters, and access tier layout parameters of this specific release build..."
                  className="w-full bg-[#030406] border border-gray-900/80 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-800 focus:outline-none transition-all duration-200 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase font-bold">// Deployment State</label>
                  <select
                    value={status} onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#030406] border border-gray-900/80 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="Completed">Completed (Allows Active Download)</option>
                    <option value="In Progress">In Progress (Locked Track)</option>
                    <option value="Future Concept">Future Concept (Design Prototype)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase font-bold">// Technology Tags (Comma Separated)</label>
                  <input
                    type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} required
                    placeholder="Next.js, Supabase, Tailwind, TypeScript"
                    className="w-full bg-[#030406] border border-gray-900/80 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-800 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase font-bold">// Payload Binary Build Asset File</label>
                <div className="relative w-full rounded-xl bg-[#030406] border border-dashed border-gray-900/80 hover:border-blue-500/30 transition-all p-4 text-center">
                  <input
                    type="file"
                    accept=".exe,.apk,.zip,.rar"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required={status === 'Completed'}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-gray-400 font-medium">
                      {file ? `📦 Target Attached: ${file.name}` : "Click window area or drop package asset file to queue"}
                    </div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-wide">
                      Accepting formats: .EXE // .APK // .ZIP // .RAR
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold text-sm py-3.5 px-4 rounded-xl text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  isLoading
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-900/20 active:scale-[0.99]'
                }`}
              >
                <span>{isLoading ? 'TRANSMITTING REPOSITORY BINARY PACKETS...' : 'EXECUTE REPOSITORY INJECTION'}</span>
                {!isLoading && <ArrowUpRight className="w-4 h-4" />}
              </button>

              {uploadStatus && (
                <div className={`p-3 rounded-xl text-center text-xs font-mono border ${
                  uploadStatus.includes('Success')
                    ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-400'
                    : 'bg-blue-950/10 border-blue-900/30 text-blue-400'
                }`}>
                  {uploadStatus}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT 5-COLUMNS: REAL-TIME CONSOLE BUILD MANIFEST MIRROR */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-gray-500" />
                Live Build Manifest
              </h2>
              <p className="text-xs text-gray-500">Structured system state array string output mirroring the database inputs.</p>
            </div>

            <div className="bg-[#040509] border border-gray-900 rounded-2xl p-5 shadow-2xl font-mono text-[11px] leading-relaxed text-gray-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-[9px] text-gray-600 tracking-widest font-bold font-mono">
                JSON_MIRROR
              </div>

              <div className="space-y-1.5 text-blue-400/80">
                <div><span className="text-gray-600">01 //</span> <span className="text-purple-400">const</span> pipelineMetaData = &#133;</div>
                <div className="pl-4 text-gray-300">{"{"}</div>
                <div className="pl-8"><span className="text-amber-500">"id"</span>: <span className="text-emerald-400">"{title ? title.toLowerCase().replace(/\s+/g, '-') : 'auto-generated'}"</span>,</div>
                <div className="pl-8"><span className="text-amber-500">"title"</span>: <span className="text-emerald-400">"{title || 'Undefined Core'}"</span>,</div>
                <div className="pl-8"><span className="text-amber-500">"category"</span>: <span className="text-emerald-400">"{category || 'Unassigned Cluster'}"</span>,</div>
                <div className="pl-8"><span className="text-amber-500">"description"</span>: <span className="text-emerald-400">"{description ? `${description.substring(0, 45)}...` : 'Awaiting profile text inputs...'}"</span>,</div>
                <div className="pl-8"><span className="text-amber-500">"status"</span>: <span className="text-purple-400">"{status}"</span>,</div>
                <div className="pl-8">
                  <span className="text-amber-500">"tech_stack"</span>: [
                  {tagsInput ? tagsInput.split(',').map((t, idx) => <span key={idx} className="text-emerald-400">"{t.trim()}"{idx < tagsInput.split(',').length - 1 ? ', ' : ''}</span>) : '"Pending Validation"'}
                  ],
                </div>
                <div className="pl-8"><span className="text-amber-500">"payload_binary"</span>: <span className="text-purple-400">{file ? `"${file.name}"` : 'null'}</span></div>
                <div className="pl-4 text-gray-300">{"}"};</div>
              </div>

              {/* Console logs output segment box decoration */}
              <div className="mt-6 pt-5 border-t border-gray-900 text-gray-600 space-y-1 text-[10px]">
                <div>&gt;&gt; LOG: Pipeline connection stream ready.</div>
                {file && <div className="text-blue-500/70">&gt;&gt; MEMORY_BUFFER: Staging raw file data [{Math.round(file.size / 1024)} KB]</div>}
                {isLoading && <div className="text-yellow-500/70 animate-pulse">&gt;&gt; SYS_STRIKE: Database sync running...</div>}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
