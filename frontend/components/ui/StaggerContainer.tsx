'use client';
import { motion } from 'framer-motion';

export function StaggerContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 200, damping: 20 }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
