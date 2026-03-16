import { motion, AnimatePresence } from 'motion/react';
import { CookingStep } from '../types';

export function InstructionHeader({ step, isHandsFree }: { step: CookingStep, isHandsFree: boolean }) {
  const progress = step.totalSteps > 0 ? (step.number / step.totalSteps) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-morandi-ochre font-serif italic text-xl">
            {step.totalSteps > 0 ? "Step by step..." : "Welcome..."}
          </span>
          <h1 className="text-morandi-ink font-serif font-bold text-5xl lg:text-6xl tracking-tight leading-none">
            {step.totalSteps > 0 ? (
              <>Step {step.number} <span className="text-morandi-ochre/50">/ {step.totalSteps}</span></>
            ) : (
              "Get Started"
            )}
          </h1>
        </div>
        
        {step.totalSteps > 0 && (
          <div className="flex flex-col items-end gap-3 w-64">
            <div className="flex justify-between w-full text-sm font-bold uppercase tracking-widest text-morandi-ochre">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-morandi-paper rounded-full overflow-hidden border border-morandi-border">
              <motion.div 
                className="h-full bg-morandi-ochre"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className={`
        relative p-6 rounded-[2rem] bg-white/40 border border-morandi-border backdrop-blur-sm shadow-sm
        ${isHandsFree ? 'py-10' : ''}
      `}>
        <AnimatePresence mode="wait">
          <motion.p
            key={step.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              font-serif font-medium text-morandi-ink leading-tight
              ${isHandsFree ? 'text-5xl lg:text-6xl' : 'text-3xl lg:text-4xl'}
            `}
          >
            {step.text}
          </motion.p>
        </AnimatePresence>
        
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-morandi-ochre/20 rounded-tl-3xl" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-morandi-ochre/20 rounded-br-3xl" />
      </div>
    </div>
  );
}
