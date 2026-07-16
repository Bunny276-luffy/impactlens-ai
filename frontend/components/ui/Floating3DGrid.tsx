'use client';
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const Floating3DGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  
  const rotateX = useTransform(smoothProgress, [0, 1], ["60deg", "20deg"]);
  const translateZ = useTransform(smoothProgress, [0, 1], ["-200px", "50px"]);
  const translateY = useTransform(smoothProgress, [0, 1], ["100px", "-100px"]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[40vh] min-h-[300px] w-full bg-obsidian-deep overflow-hidden flex items-center justify-center border-b border-white/5 perspective-1000"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian-deep z-10 pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl text-center z-20">
         <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-4 drop-shadow-2xl">
            Infinite Data Dimensions
         </h2>
         <p className="text-xl text-cyan tracking-widest uppercase font-bold">
            Explore the ecosystem
         </p>
      </div>

      <motion.div 
        style={{
          rotateX,
          translateZ,
          y: translateY
        }}
        className="w-[150%] h-[150%] absolute top-[-25%] left-[-25%] preserve-3d"
      >
        <div className="absolute inset-0 bg-grid opacity-30 animate-float" />
        
        {/* Floating geometric elements (Deterministic for SSR Hydration) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const width = (i * 17) % 100 + 50;
          const height = (i * 23) % 100 + 50;
          const left = (i * 37) % 100;
          const top = (i * 41) % 100;
          const transZ = (i * 53) % 200;
          const duration = (i * 7) % 10 + 10;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                left: `${left}%`,
                top: `${top}%`,
                translateZ: `${transZ}px`,
              }}
              animate={{
                y: [0, -30, 0],
                rotateY: [0, 180, 360],
                rotateX: [0, 180, 360],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          );
        })}
      </motion.div>
    </section>
  );
};
