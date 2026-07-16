'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: any;
  once?: boolean;
}

export function AnimatedText({ text, el: Wrapper = 'p', className, once = true }: AnimatedTextProps) {
  const words = text.split(' ');

  const container: any = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child: any = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
  };

  return (
    <Wrapper className={cn('flex flex-wrap', className)}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-100px" }}
        className="flex flex-wrap"
      >
        {words.map((word, index) => (
          <motion.span variants={child} key={index} className="mr-[0.25em] inline-block">
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
}
