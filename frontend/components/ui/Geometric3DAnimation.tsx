'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Geometric3DAnimation = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center perspective-1000">
      {/* 3D Rotating Wireframe Cube System */}
      <motion.div
        className="relative w-96 h-96 preserve-3d"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          rotateZ: [0, 180, 360]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Core glowing sphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan/20 rounded-full blur-3xl shadow-[0_0_100px_rgba(0,242,254,0.6)]" />

        {/* Outer Orbit Rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={`ring-${ring}`}
            className="absolute top-1/2 left-1/2 w-80 h-80 border-2 border-cyan/10 rounded-full"
            style={{
              x: "-50%",
              y: "-50%",
              rotateX: ring * 60,
              rotateY: ring * 45
            }}
            animate={{
              rotateZ: 360
            }}
            transition={{
              duration: 20 * ring,
              repeat: Infinity,
              ease: "linear"
            }}
          >
             {/* Orbiting particle */}
             <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan rounded-full shadow-[0_0_15px_rgba(0,242,254,1)] -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        ))}

        {/* Geometric Wireframe Cube */}
        <div className="absolute inset-0 preserve-3d">
          <div className="absolute inset-0 border border-cyan/30 bg-cyan/5 shadow-[0_0_30px_rgba(0,242,254,0.1)]" style={{ transform: "translateZ(192px)" }} />
          <div className="absolute inset-0 border border-cyan/30 bg-cyan/5 shadow-[0_0_30px_rgba(0,242,254,0.1)]" style={{ transform: "translateZ(-192px)" }} />
          <div className="absolute inset-0 border border-cyan/30 bg-cyan/5 shadow-[0_0_30px_rgba(0,242,254,0.1)]" style={{ transform: "rotateY(90deg) translateZ(192px)" }} />
          <div className="absolute inset-0 border border-cyan/30 bg-cyan/5 shadow-[0_0_30px_rgba(0,242,254,0.1)]" style={{ transform: "rotateY(-90deg) translateZ(192px)" }} />
          <div className="absolute inset-0 border border-cyan/30 bg-cyan/5 shadow-[0_0_30px_rgba(0,242,254,0.1)]" style={{ transform: "rotateX(90deg) translateZ(192px)" }} />
          <div className="absolute inset-0 border border-cyan/30 bg-cyan/5 shadow-[0_0_30px_rgba(0,242,254,0.1)]" style={{ transform: "rotateX(-90deg) translateZ(192px)" }} />
        </div>
      </motion.div>
    </div>
  );
};
