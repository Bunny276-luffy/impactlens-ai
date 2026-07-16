'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, HeartHandshake, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    role: "NGO Admin",
    title: "Global Command",
    color: "from-violet-600 to-fuchsia-600",
    border: "border-violet/30",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    icon: <BarChart3 className="w-8 h-8 text-white" />,
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
    image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80",
    icon: <Users className="w-8 h-8 text-white" />,
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
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    icon: <HeartHandshake className="w-8 h-8 text-white" />,
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
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    icon: <Shield className="w-8 h-8 text-white" />,
    stats: [
      { label: "Anomalies", value: "0" },
      { label: "Access Level", value: "Root" }
    ]
  }
];

export const ExpandableCards = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex w-full h-[500px] gap-2 lg:gap-4 overflow-hidden">
      {CARDS.map((card, i) => {
        const isActive = active === i;
        
        return (
          <motion.div
            key={i}
            onHoverStart={() => setActive(i)}
            onClick={() => setActive(i)}
            layout
            className={cn(
              "relative h-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out border bg-obsidian-card shadow-2xl",
              isActive ? "flex-[4]" : "flex-[1]",
              card.border
            )}
          >
            {/* Background Image */}
            <motion.div 
              className={cn("absolute inset-0 bg-cover bg-center transition-all duration-700", isActive ? "opacity-40 grayscale-0" : "opacity-10 grayscale")}
              style={{ backgroundImage: `url(${card.image})` }}
            />
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-t from-obsidian-card via-obsidian-card/80 to-transparent transition-opacity duration-500", card.color, isActive ? "opacity-60" : "opacity-40")} />
            
            {/* Content Container */}
            <div className={cn(
              "absolute inset-0 p-4 lg:p-6 flex flex-col justify-end transition-all duration-500",
              isActive ? "items-start" : "items-center"
            )}>
              
              {/* Icon & Title Row */}
              <motion.div layout className={cn("flex items-center gap-4", isActive ? "mb-6" : "mb-4 flex-col")}>
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10">
                  {card.icon}
                </div>
                
                {isActive ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{card.role}</div>
                    <h3 className="text-2xl lg:text-3xl font-black text-white">{card.title}</h3>
                  </motion.div>
                ) : (
                  <div className="text-white font-bold -rotate-90 whitespace-nowrap tracking-widest absolute top-1/2 -translate-y-1/2 opacity-50">
                    {card.role}
                  </div>
                )}
              </motion.div>

              {/* Stats Grid (Only visible when active) */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full grid grid-cols-2 gap-4"
                >
                  {card.stats.map((stat, idx) => (
                    <div key={idx} className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4">
                      <div className="text-xs text-text-muted font-bold uppercase mb-1">{stat.label}</div>
                      <div className="text-lg lg:text-xl font-black text-white">{stat.value}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
            
          </motion.div>
        );
      })}
    </div>
  );
};
