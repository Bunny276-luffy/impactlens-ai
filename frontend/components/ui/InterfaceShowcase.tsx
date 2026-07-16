'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, HeartHandshake, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERFACES = [
  {
    id: "admin",
    title: "Global Command Center",
    role: "NGO Admin",
    color: "text-violet",
    bgLight: "bg-violet/10",
    border: "border-violet/20",
    icon: <BarChart3 className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    details: "Real-time telemetry, fund allocation, and predictive modeling."
  },
  {
    id: "volunteer",
    title: "Field Operations App",
    role: "Field Worker",
    color: "text-cyan",
    bgLight: "bg-cyan/10",
    border: "border-cyan/20",
    icon: <Users className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1593113580332-62bce8c367b6?q=80&w=2070&auto=format&fit=crop",
    details: "GPS routing, offline data sync, and instant impact logging."
  },
  {
    id: "donor",
    title: "Transparent Impact Portal",
    role: "Major Donor",
    color: "text-emerald-400",
    bgLight: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    icon: <HeartHandshake className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
    details: "Track exactly where every dollar goes with cryptographic proof."
  },
  {
    id: "security",
    title: "Compliance & Audit",
    role: "Security Officer",
    color: "text-rose-500",
    bgLight: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: <Shield className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop",
    details: "Role-Level Security (RLS) enforcement and complete audit logs."
  }
];

export const InterfaceShowcase = () => {
  const [active, setActive] = useState(INTERFACES[0]);

  return (
    <div className="w-full max-w-[600px] mx-auto flex flex-col gap-6">
      
      {/* Interactive Tabs */}
      <div className="flex flex-wrap gap-2">
        {INTERFACES.map((tab) => {
          const isActive = active.id === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300",
                isActive ? "text-white" : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={cn("absolute inset-0 rounded-full border", tab.bgLight, tab.border)}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className={isActive ? tab.color : "text-text-muted"}>
                  {tab.icon}
                </span>
                {tab.role}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Card */}
      <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-obsidian-card group">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col justify-end p-8"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${active.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-deep via-obsidian-deep/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">{active.title}</h3>
              <p className="text-text-secondary leading-relaxed mb-2">{active.details}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
    </div>
  );
};
