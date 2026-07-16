'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['100%', '0%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['100%', '0%']);
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.1, 0.3, 0.1]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
      }}
      className={cn('relative preserve-3d perspective-1000 group cursor-pointer', className)}
    >
      {/* Glow behind */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-cyan-violet opacity-0 group-hover:opacity-30 blur-xl transition duration-500 transform translate-z-[-50px]"></div>
      
      {/* Content */}
      <div className="relative w-full h-full transform translate-z-10 bg-obsidian-card border border-border-default rounded-2xl overflow-hidden backdrop-blur-xl">
        {children}
      </div>
    </motion.div>
  );
}
