'use client';

import { motion } from "framer-motion";

const cards = [
  {
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    title: "Global Reach",
    id: 1,
  },
  {
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    title: "Data Driven",
    id: 2,
  },
  {
    url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop",
    title: "Community First",
    id: 3,
  },
  {
    url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
    title: "Sustainable Future",
    id: 4,
  },
];

export const StepCarousel = () => {
  return (
    <section className="relative bg-obsidian border-y border-white/5 py-24 px-6 md:px-24">
      <div className="mb-32 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Field Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-cyan">Visualized</span>
        </h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Scroll to explore real-world outcomes. Our telemetry engine tracks every step of the journey.
        </p>
      </div>

      <div className="flex flex-col gap-[20vh] pb-[20vh] relative z-20">
        {cards.map((card, index) => {
          // Calculate a slight rotation and scale for the staggered step effect
          const rotate = index % 2 === 0 ? "rotate(2deg)" : "rotate(-2deg)";
          const topOffset = `calc(20vh + ${index * 20}px)`;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="sticky flex justify-center w-full"
              style={{ top: topOffset }}
            >
              <div
                className="group relative h-[50vh] min-h-[400px] w-full max-w-[1000px] overflow-hidden rounded-3xl bg-neutral-200 shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10"
                style={{ transform: rotate }}
              >
                <div
                  style={{
                    backgroundImage: `url(${card.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110"
                ></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-obsidian-deep/90 via-obsidian-deep/20 to-transparent" />
                
                <div className="absolute bottom-12 left-12 z-20">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan/20 border border-cyan/40 text-cyan font-bold backdrop-blur-md">
                      0{index + 1}
                    </span>
                    <div className="h-px w-12 bg-cyan/40" />
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black uppercase text-white drop-shadow-2xl tracking-tight">
                    {card.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
