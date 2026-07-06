import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import GlowBackground from "@/components/ui/GlowBackground"; // Import your new component

export const metadata: Metadata = {
  title: "Prayag Dhariwal | Portfolio & Build Hub",
  description: "Personal distribution and storage hub for software builds, system utilities, and academic tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#030407] text-gray-200 min-h-screen flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-400 relative">
        <LoadingScreen />
        <GlowBackground /> {/* Activated interactive mouse gradient */}
        {children}
      </body>
    </html>
  );
}
