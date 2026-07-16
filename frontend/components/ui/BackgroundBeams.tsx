'use client';
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-obsidian-deep z-0" />
      <div className="absolute top-0 w-full h-full bg-grid z-0 mix-blend-overlay opacity-20" />
      
      {/* Optimized blobs - lower blur and hardware accelerated */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-cyan-glow blur-[80px] rounded-full animate-float mix-blend-screen opacity-40 z-0 will-change-transform" />
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-violet-glow blur-[100px] rounded-full animate-float-delayed mix-blend-screen opacity-30 z-0 will-change-transform" />
      
      {/* Beams */}
      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan to-transparent opacity-[0.15] transform -translate-x-1/2" />
    </div>
  );
};
