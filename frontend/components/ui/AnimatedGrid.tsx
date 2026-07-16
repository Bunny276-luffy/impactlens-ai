'use client';
import { motion } from 'framer-motion';

export const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-1000 z-0">
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-deep via-transparent to-obsidian-deep z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian-deep via-transparent to-obsidian-deep z-10" />
      
      <motion.div
        animate={{
          translateY: [0, 50],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }}
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-grid opacity-20 mix-blend-screen"
        style={{
          transformOrigin: "top center",
          rotateX: "60deg"
        }}
      />
      
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan shadow-[0_0_10px_rgba(0,242,254,1)]"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * 800,
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{
            y: [null, Math.random() * -200],
            opacity: [null, Math.random() * 0.8 + 0.2, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};
