'use client';

import { motion } from "framer-motion";
import { BarChart3, Users, HeartHandshake, Shield } from "lucide-react";

const CARDS = [
  {
    role: "NGO Admin",
    title: "Global Command",
    color: "from-violet-600 to-fuchsia-600",
    border: "border-violet/30",
    shadow: "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
    icon: <BarChart3 className="w-12 h-12 text-white mb-4" />,
    stats: [
      { label: "Active Field Units", value: "244" },
      { label: "Fund Efficiency", value: "94%" }
    ]
  },
  {
    role: "Field Worker",
    title: "Operations App",
    color: "from-cyan-500 to-blue-600",
    border: "border-cyan/30",
    shadow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    icon: <Users className="w-12 h-12 text-white mb-4" />,
    stats: [
      { label: "Offline Sync", value: "Ready" },
      { label: "Tasks Today", value: "12" }
    ]
  },
  {
    role: "Major Donor",
    title: "Impact Portal",
    color: "from-emerald-400 to-teal-600",
    border: "border-emerald-400/30",
    shadow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]",
    icon: <HeartHandshake className="w-12 h-12 text-white mb-4" />,
    stats: [
      { label: "Total Donated", value: "$1.2M" },
      { label: "Lives Impacted", value: "14,500" }
    ]
  },
  {
    role: "Security Officer",
    title: "Audit & Compliance",
    color: "from-rose-500 to-red-700",
    border: "border-rose-500/30",
    shadow: "shadow-[0_0_30px_rgba(244,63,94,0.3)]",
    icon: <Shield className="w-12 h-12 text-white mb-4" />,
    stats: [
      { label: "Anomalies", value: "0" },
      { label: "Access Level", value: "Root" }
    ]
  }
];

export const HoverFanOut = () => {
  return (
    <div className="relative w-full max-w-[400px] h-[500px] mx-auto group perspective-1000 mt-10">
      
      {/* Interactive Helper Text */}
      <motion.div 
        className="absolute -top-12 left-1/2 -translate-x-1/2 text-cyan font-bold uppercase tracking-widest text-sm opacity-50 group-hover:opacity-0 transition-opacity"
      >
        Hover to fan out
      </motion.div>

      {CARDS.map((card, i) => {
        // Calculations to create a perfect hand-fan effect
        const total = CARDS.length;
        const middle = (total - 1) / 2; // 1.5 for 4 cards
        const offset = i - middle; // -1.5, -0.5, 0.5, 1.5

        return (
          <motion.div
            key={i}
            className={`absolute inset-0 rounded-3xl border bg-obsidian-deep overflow-hidden ${card.border} transition-shadow duration-300 group-hover:${card.shadow}`}
            initial={{ 
              rotateZ: offset * 3, // Slight initial messy stack
              y: Math.abs(offset) * 5, 
              x: offset * 2,
              z: i * -5,
              scale: 0.95
            }}
            whileHover={{ 
              rotateZ: offset * 12, // Fan out wide
              y: Math.abs(offset) * -20, // Push outer cards up
              x: offset * 60, // Spread horizontally
              scale: 1.05,
              z: i * 20
            }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            style={{ 
              transformOrigin: "bottom center",
              zIndex: i 
            }}
          >
            {/* Card Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-20 z-0`} />
            
            {/* Card Content */}
            <div className="relative z-10 p-8 h-full flex flex-col">
              <div className="flex-1">
                {card.icon}
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                  {card.role}
                </div>
                <h3 className="text-3xl font-black text-white leading-tight">
                  {card.title}
                </h3>
              </div>

              {/* Fake UI Stats */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                {card.stats.map((stat, idx) => (
                  <div key={idx} className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4">
                    <div className="text-xs text-text-muted font-bold uppercase mb-1">{stat.label}</div>
                    <div className="text-xl font-black text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-deep to-transparent opacity-50 z-0 pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
};
