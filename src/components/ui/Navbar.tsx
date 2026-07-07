'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Terminal, ShieldCheck, Cpu, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [sessionActive, setSessionActive] = useState(false);

  const navLinks = [
    { href: '#repository', label: 'Projects' },
    { href: '#roadmap', label: 'Roadmap' },
  ];

  // 1. Monitor layout scroll bounds to shift opacity parameters dynamically
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Track viewport bounds to highlight the section currently in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Scan local page elements cleanly
    ['repository', 'roadmap'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 3. Trace auth security tokens to change status badges in real-time
  useEffect(() => {
    const traceAuthSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionActive(!!session);
    };
    traceAuthSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionActive(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 font-mono text-xs ${isScrolled
          ? 'border-gray-900 bg-[#030407]/80 backdrop-blur-md h-16 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'border-transparent bg-transparent h-20'
        }`}
    >
      <div className="mx-auto max-w-7xl h-full px-6 flex items-center justify-between">

        {/* Logo Element with Custom Core Pulse */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none rounded-xl p-1">
          <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-gray-900 bg-black shrink-0 shadow-[0_0_10_rgba(59,130,246,0.2)] transition-transform duration-300 group-hover:scale-105">
            <img src="/icon.png" alt="PD Core Logo" className="w-full h-full object-cover" />
          </div>

          <div className="text-[13px] font-bold tracking-[2px] text-white group-hover:text-blue-400 transition-colors uppercase">
            PRAYAG<span className="text-blue-500">.</span>DHARIWAL
          </div>
        </Link>

        {/* Desktop Navigation Links Panel */}
        <div className="hidden md:flex items-center gap-8 tracking-widest uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 transition-colors duration-200 hover:text-white font-medium
                ${activeSection === link.href
                  ? 'text-blue-400 font-bold after:absolute after:-bottom-5 after:left-0 after:h-[2px] after:w-full after:bg-blue-500 after:shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Secure Architect Control Panel Trigger Anchor */}
          <Link
            href="/admin"
            className={`group relative px-4 py-2.5 rounded-xl border font-bold tracking-wider transition-all flex items-center gap-2 overflow-hidden ${sessionActive
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                : 'bg-[#06080d] border-gray-900 text-gray-400 hover:text-white hover:border-blue-900/40'
              }`}
          >
            {sessionActive ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
            )}
            <span>{sessionActive ? 'ACCESS NODE ACTIVE' : 'CONTROL PANEL'}</span>
            <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        </div>

        {/* Mobile Menu Action Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl border border-gray-950 bg-[#06080d]/40 text-gray-500 hover:text-white hover:border-gray-900 transition-all focus:outline-none"
          aria-label="Toggle Navigation Tray"
        >
          {isOpen ? <X className="w-4 h-4 animate-fadeIn" /> : <Menu className="w-4 h-4 animate-fadeIn" />}
        </button>
      </div>

      {/* Mobile Drawer Menu Overlays */}
      <div
        className={`md:hidden border-b border-gray-900/80 bg-[#030407]/95 backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-2xl ${isOpen ? 'max-h-72 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
      >
        <div className="px-6 py-6 space-y-5 tracking-widest uppercase border-t border-gray-950">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block py-1.5 font-medium transition-colors ${activeSection === link.href ? 'text-blue-400 font-bold' : 'text-gray-500 hover:text-white'}`}
            >
              // {link.label}
            </Link>
          ))}

          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className={`w-full py-3 rounded-xl font-bold tracking-widest text-center flex items-center justify-center gap-2 border transition-all ${sessionActive
                ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-transparent'
              }`}
          >
            {sessionActive ? <ShieldCheck className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
            {sessionActive ? 'ACCESS NODE ACTIVE' : 'DECRYPT CONTROL PANEL'}
          </Link>
        </div>
      </div>
    </nav>
  );
}
