'use client';
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

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

export const HorizontalScrollCarousel = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-obsidian border-y border-white/5">
      <div className="sticky top-20 flex h-[calc(100vh-80px)] items-center overflow-hidden">
        <div className="absolute left-8 md:left-24 top-12 z-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Field Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-cyan">Visualized</span></h2>
          <p className="text-text-secondary max-w-xl">Scroll to explore real-world outcomes powered by our telemetry engine.</p>
        </div>
        <motion.div style={{ x }} className="flex gap-8 px-8 md:px-24 mt-24">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }: { card: typeof cards[0] }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[60vh] min-h-[400px] w-[80vw] min-w-[300px] sm:min-w-[400px] md:min-w-[600px] max-w-[900px] overflow-hidden rounded-3xl bg-neutral-200 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-8 left-8 z-20">
        <p className="text-4xl font-black uppercase text-white backdrop-blur-md px-4 py-2 bg-white/10 rounded-xl border border-white/20">
          {card.title}
        </p>
      </div>
    </div>
  );
};
