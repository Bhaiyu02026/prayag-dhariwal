'use client';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 1. Ensure the component is fully loaded in the browser first
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Run the countdown only after mounting is successful
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 200);
          return 100;
        }
        return prev + 5; // Increases by 5% every loop
      });
    }, 30); // Smooth update rate

    return () => clearInterval(interval);
  }, [mounted]);

  // If the browser hasn't initialized the file yet, keep it hidden
  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0c10] text-white">
      <div className="w-64 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs tracking-widest text-gray-500">
          <span>PD // SYSTEM INITIALIZE</span>
          <span className="text-blue-400 font-bold">{progress}%</span>
        </div>

        <div className="h-[2px] w-full bg-gray-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
