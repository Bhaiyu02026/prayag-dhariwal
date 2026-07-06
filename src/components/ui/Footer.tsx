import { Mail, ShieldAlert } from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-900 bg-[#050608] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Left Side: Professional Copyright & System Tag */}
        <div className="flex items-center gap-3 text-xs font-mono text-gray-500 order-3 md:order-1">
          <ShieldAlert className="w-4 h-4 text-gray-600" />
          <span>© {new Date().getFullYear()} PRAYAG DHARIWAL. ALL ASSETS SECURE.</span>
        </div>

        {/* Center: High-End Icon Grid Control */}
        <div className="flex items-center gap-4 order-1 md:order-2">

          {/* GitHub Icon Link */}
          <a
            href="https://github.com/Prayag-5826"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-[#0b0d14] border border-gray-900 hover:border-blue-500/40 hover:bg-[#101422] transition-all duration-300 shadow-sm"
          >
            <FaGithub className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
          </a>

          {/* Instagram Icon Link */}
          <a
            href="https://www.instagram.com/prayagdhariwal02/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-[#0b0d14] border border-gray-900 hover:border-blue-500/40 hover:bg-[#101422] transition-all duration-300 shadow-sm"
          >
            <FaInstagram className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
          </a>

          {/* Email Icon Link */}
          <a
            href="mailto:prayagdhariwal@gmail.com"
            aria-label="Send Email"
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-[#0b0d14] border border-gray-900 hover:border-blue-500/40 hover:bg-[#101422] transition-all duration-300 shadow-sm"
          >
            <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
          </a>

        </div>

        {/* Right Side: Network Status Badges */}
        <div className="flex items-center gap-6 text-xs font-mono text-gray-500 order-2 md:order-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">LOC //</span>
            <span className="text-gray-400 font-medium">INDORE, IN</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-900 hidden sm:block" />
          <span className="text-emerald-500 flex items-center gap-1.5 font-semibold tracking-wider bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded-md text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            PIPELINE OPERATIONAL
          </span>
        </div>

      </div>
    </footer>
  );
}
