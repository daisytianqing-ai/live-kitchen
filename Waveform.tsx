import { motion } from 'motion/react';

export function Waveform({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-orange-500 rounded-full"
          animate={isActive ? {
            height: [10, 40, 15, 35, 10],
          } : {
            height: 4,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
