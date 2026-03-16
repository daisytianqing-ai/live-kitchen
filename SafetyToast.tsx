import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { SafetyWarning } from '../types';

export function SafetyToast({ warnings }: { warnings: SafetyWarning[] }) {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-4 w-full max-w-md px-4">
      <AnimatePresence>
        {warnings.map((warning) => (
          <motion.div
            key={warning.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
              flex items-center gap-4 p-6 rounded-2xl shadow-xl border-2
              ${warning.type === 'danger' 
                ? 'bg-red-50 border-red-200 text-red-900' 
                : 'bg-morandi-ochre border-morandi-border text-white'}
            `}
          >
            <div className={`p-3 rounded-full ${warning.type === 'danger' ? 'bg-red-500 text-white' : 'bg-white text-morandi-ochre'}`}>
              {warning.type === 'danger' ? <ShieldAlert size={32} /> : <AlertTriangle size={32} />}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-serif font-bold uppercase tracking-wider mb-1">
                {warning.type === 'danger' ? 'Attention!' : 'Warning'}
              </h3>
              <p className="text-lg font-medium leading-tight">{warning.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
