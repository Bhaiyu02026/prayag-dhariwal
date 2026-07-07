'use client';

import { Mail, Terminal, ShieldAlert, Cpu, GitBranch, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-900 bg-[#04060a] mt-32 pt-16 pb-12 font-mono text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-6 space-y-12">

        {/* Top Tier: Multi-Column Operational Index Map */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-950">

          {/* Brand Vector Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold tracking-wider text-[13px]">
              <Cpu className="w-4 h-4 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
              <span>PD // ARCHITECT CORE</span>
            </div>
            <p className="text-gray-600 font-sans text-xs leading-relaxed max-w-sm font-normal">
              A high-performance portfolio index tracking localized applications, compiled binary frameworks, and secure multi-role database clusters.
            </p>
          </div>

          {/* Quick Mapping Vectors */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">// SYSTEM OVERVIEW</span>
            <ul className="space-y-2 text-gray-400 font-medium">
              <li>
                <a href="#repository" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span>&gt; Project Manifests</span>
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span>&gt; Academic Timeline</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Infrastructure Endpoints */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">// DEV UTILITIES</span>
            <ul className="space-y-2 text-gray-400 font-medium">
              <li>
                <a
                  href="https://github.com/Bhaiyu02026/prayag-dhariwal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>Main Repository Link</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-700" />
                </a>
              </li>
              <li>
                <span className="text-gray-600 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-blue-500/70" />
                  <span>Branch: production // main</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Tier: System Status & Copyright Blocks */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 pt-2">

          {/* Left Block: Core Integrity Token */}
          <div className="flex items-center gap-3 order-3 lg:order-1 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-gray-700 shrink-0" />
            <span className="tracking-wide text-gray-600">
              © {currentYear} <span className="text-gray-400 font-bold">PRAYAG DHARIWAL</span>. SYSTEM INTEGRITY VERIFIED.
            </span>
          </div>

          {/* Center Block: Elevated Communication Ports */}
          <div className="flex items-center gap-3 order-1 lg:order-2">

            {/* GitHub Portal */}
            <a
              href="https://github.com/Prayag-5826"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile Interface"
              className="group flex items-center justify-center w-9 h-9 rounded-xl bg-[#07090e] border border-gray-900/60 hover:border-blue-500/40 hover:bg-[#0c101d] hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300"
            >
              <FaGithub className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </a>

            {/* Instagram Portal */}
            <a
              href="https://www.instagram.com/prayagdhariwal02/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Social Link"
              className="group flex items-center justify-center w-9 h-9 rounded-xl bg-[#07090e] border border-gray-900/60 hover:border-blue-500/40 hover:bg-[#0c101d] hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300"
            >
              <FaInstagram className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </a>

            {/* Direct Email Link */}
            <a
              href="mailto:prayagdhariwal@gmail.com"
              aria-label="Transmit Secure Email Communication"
              className="group flex items-center justify-center w-9 h-9 rounded-xl bg-[#07090e] border border-gray-900/60 hover:border-blue-500/40 hover:bg-[#0c101d] hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300"
            >
              <Mail className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </a>

          </div>

          {/* Right Block: Live Target Telemetry Matrix */}
          <div className="flex items-center gap-5 text-[11px] order-2 lg:order-3 text-gray-600">
            <div className="flex items-center gap-1.5">
              <span>LOC //</span>
              <span className="text-gray-400 font-bold tracking-wide">INDORE, IN</span>
            </div>
            <div className="h-3.5 w-[1px] bg-gray-900" />
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold tracking-wider bg-emerald-950/20 border border-emerald-900/30 px-3 py-1 rounded-xl text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              REMOTE PIPELINE SYNCED
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
