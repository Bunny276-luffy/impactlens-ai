'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, HeartHandshake, Shield } from "lucide-react";

const INTERFACES = [
  {
    id: "admin",
    title: "Global Command Center",
    role: "NGO Admin",
    color: "from-violet to-fuchsia-600",
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    details: "Real-time telemetry, fund allocation, and predictive modeling."
  },
  {
    id: "volunteer",
    title: "Field Operations App",
    role: "Field Worker",
    color: "from-cyan to-blue-600",
    icon: <Users className="w-6 h-6 text-white" />,
    image: "https://images.unsplash.com/photo-1593113580332-62bce8c367b6?q=80&w=2070&auto=format&fit=crop",
    details: "GPS routing, offline data sync, and instant impact logging."
  },
  {
    id: "donor",
    title: "Transparent Impact Portal",
    role: "Major Donor",
    color: "from-emerald-400 to-teal-600",
    icon: <HeartHandshake className="w-6 h-6 text-white" />,
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
    details: "Track exactly where every dollar goes with cryptographic proof."
  },
  {
    id: "security",
    title: "Compliance & Audit",
    role: "Security Officer",
    color: "from-rose-500 to-red-700",
    icon: <Shield className="w-6 h-6 text-white" />,
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop",
    details: "Role-Level Security (RLS) enforcement and complete audit logs."
  }
];

export const FlipBookInterfaces = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INTERFACES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[600px] h-[500px] preserve-3d perspective-1000 mx-auto">
      {INTERFACES.map((iface, index) => {
        // Is this page already flipped over to the left?
        const isFlipped = index < currentIndex;
        // Is this the currently visible right-side page?
        const isCurrent = index === currentIndex;
        // Is this a future page stacked underneath?
        const isUpcoming = index > currentIndex;
        
        return (
          <motion.div
            key={iface.id}
            initial={false}
            animate={{
              rotateY: isFlipped ? -180 : 0,
              z: isUpcoming ? (currentIndex - index) * 10 : 0,
              opacity: isFlipped ? 0 : 1,
            }}
            transition={{
              duration: 1.2,
              type: "spring",
              bounce: 0.2
            }}
            style={{ 
              transformOrigin: "left center",
              zIndex: INTERFACES.length - index,
            }}
            className={`absolute top-0 right-0 w-[95%] h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-obsidian-card cursor-pointer`}
            onClick={() => {
              if (isCurrent && currentIndex < INTERFACES.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else if (index === INTERFACES.length - 1 && isCurrent) {
                setCurrentIndex(0); // Reset
              }
            }}
          >
            {/* Page Content */}
            <div className="absolute inset-0 bg-obsidian-deep/80 z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 z-0 mix-blend-luminosity"
              style={{ backgroundImage: `url(${iface.image})` }}
            />
            
            <div className="relative z-20 p-8 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${iface.color} shadow-lg`}>
                  {iface.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider">{iface.role}</h4>
                  <h3 className="text-xl font-bold text-white">{iface.title}</h3>
                </div>
              </div>

              {/* Fake UI Skeleton specific to the role */}
              <div className="flex-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 p-4 flex flex-col gap-4">
                <div className="h-6 w-1/3 bg-white/10 rounded-md" />
                <div className="flex gap-4">
                  <div className="h-20 flex-1 bg-white/5 rounded-lg" />
                  <div className="h-20 flex-1 bg-white/5 rounded-lg" />
                  <div className="h-20 flex-1 bg-white/5 rounded-lg" />
                </div>
                <div className="flex-1 bg-white/5 rounded-lg w-full mt-2 flex items-center justify-center">
                  <p className="text-text-secondary font-medium text-center px-6">{iface.details}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-center text-sm font-bold text-text-muted">
                <span>Page {index + 1} of {INTERFACES.length}</span>
                <span className="text-cyan animate-pulse">Click to flip &rarr;</span>
              </div>
            </div>
            
            {/* The binding/spine shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 to-transparent z-30" />
          </motion.div>
        );
      })}
    </div>
  );
};
