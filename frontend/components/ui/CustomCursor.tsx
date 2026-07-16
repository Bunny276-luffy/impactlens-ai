'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring config for the trailing outer ring
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      {/* Huge subtle ambient glow (Tracks smoothly) */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-64 h-64 rounded-full bg-cyan/10 blur-[80px] pointer-events-none z-[-1] transition-opacity duration-1000",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />
      
      {/* Outer animated trailing ring */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-10 h-10 rounded-full border border-cyan/50 bg-cyan/10 pointer-events-none z-[9999] mix-blend-screen transition-opacity duration-300 hidden md:block",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />
      
    </>
  );
};
