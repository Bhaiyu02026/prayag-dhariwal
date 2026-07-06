'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '#repository', label: 'Projects' },
    { href: '#roadmap', label: 'Roadmap' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800/60 bg-[#030407]/90 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl p-1"
        >
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)] transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-blue-400 animate-ping opacity-20" />
          </div>

          <div className="font-mono text-lg font-bold tracking-[2px] text-white group-hover:text-blue-400 transition-colors">
            PRAYAG<span className="text-blue-500">.</span>DHARIWAL
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 font-mono text-sm tracking-widest uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-4 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md
                ${pathname === link.href
                  ? 'text-blue-400 after:absolute after:bottom-3 after:left-0 after:h-0.5 after:w-full after:bg-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Control Panel Button */}
          <Link
            href="/admin"
            className="group relative px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-[0.985]"
          >
            <span className="relative z-10 flex items-center gap-2">
              CONTROL PANEL
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6h12M6 12h12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-gray-800/60 bg-[#030407]/95 backdrop-blur-xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-8 space-y-6 font-mono text-sm uppercase tracking-widest">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block py-3 transition-colors ${pathname === link.href ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all active:scale-[0.985]"
          >
            CONTROL PANEL
          </Link>
        </div>
      </div>
    </nav>
  );
}
