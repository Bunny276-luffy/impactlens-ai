'use client';

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const Interactive3DCard = ({
  title,
  subtitle,
  image,
  className,
}: {
  title: string;
  subtitle: string;
  image: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Pop out effects for inner elements
  const translateZImage = useTransform(mouseXSpring, () => hovered ? 50 : 0);
  const translateZText = useTransform(mouseXSpring, () => hovered ? 80 : 0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
      className={cn(
        "relative h-[500px] w-full max-w-[400px] preserve-3d perspective-1000 cursor-pointer group",
        className
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-obsidian-card border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-cyan/30 group-hover:shadow-[0_0_40px_rgba(0,242,254,0.2)]">
        
        {/* Dynamic Glare */}
        <motion.div 
          className="absolute inset-0 z-50 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-300"
          style={{
            x: useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "100%"]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "100%"]),
          }}
        />

        {/* Floating Background Image */}
        <motion.div 
          style={{ z: translateZImage }}
          className="absolute inset-4 rounded-2xl overflow-hidden preserve-3d"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-deep via-obsidian-deep/40 to-transparent" />
        </motion.div>

        {/* Floating Text Overlay */}
        <motion.div 
          style={{ z: translateZText }}
          className="absolute bottom-10 left-10 right-10 preserve-3d"
        >
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-cyan-glow border border-cyan/20 text-cyan text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            {subtitle}
          </div>
          <h3 className="text-3xl font-black text-white leading-tight drop-shadow-2xl">
            {title}
          </h3>
        </motion.div>
      </div>
    </motion.div>
  );
};
