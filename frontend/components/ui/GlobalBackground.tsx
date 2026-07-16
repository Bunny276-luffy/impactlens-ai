'use client';
import { motion } from 'framer-motion';

export const GlobalBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-obsidian pointer-events-none">
      {/* Ambient animated mesh gradient orbs - INTENSIFIED */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet/40 blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-pink-500/20 blur-[90px]"
      />
      
      
      {/* Intense animated floating dust particles */}
      {Array.from({ length: 60 }).map((_, i) => {
        // Deterministic pseudo-random values to prevent hydration errors
        const left = (i * 29) % 100;
        const top = (i * 13) % 100;
        const duration = (i * 11) % 15 + 10;
        const delay = (i * 7) % 5;
        const opacity = ((i * 19) % 60 + 20) / 100; // Increased opacity
        
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan shadow-[0_0_15px_rgba(0,242,254,0.8)] mix-blend-screen"
            style={{
              left: `${left}vw`,
              top: `${top}vh`,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, (i % 2 === 0 ? 50 : -50), 0],
              opacity: [0, opacity, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};
