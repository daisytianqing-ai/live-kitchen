import { motion } from 'motion/react';
import { Mic, MicOff, Camera, CameraOff, Hand, Ban, Power } from 'lucide-react';
import { Waveform } from './Waveform';

export function ControlBar({ 
  isConnected, 
  isListening, 
  isCameraOn, 
  isHandsFree,
  onConnect,
  onDisconnect,
  onToggleCamera,
  onToggleHandsFree
}: {
  isConnected: boolean;
  isListening: boolean;
  isCameraOn: boolean;
  isHandsFree: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleCamera: () => void;
  onToggleHandsFree: () => void;
}) {
  return (
    <div className="w-full h-24 bg-morandi-paper/90 backdrop-blur-3xl border-t border-morandi-border px-8 flex items-center justify-between gap-8">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleHandsFree}
          className={`
            p-4 rounded-2xl transition-all duration-300 flex items-center gap-3
            ${isHandsFree ? 'bg-morandi-ochre text-white shadow-sm' : 'bg-white/60 text-morandi-muted border border-morandi-border hover:bg-white'}
          `}
        >
          {isHandsFree ? <Hand size={24} /> : <Ban size={24} />}
          <span className="text-lg font-serif font-bold hidden lg:block">
            {isHandsFree ? 'Hands-Free' : 'Standard'}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCamera}
          className={`
            p-4 rounded-2xl transition-all duration-300
            ${isCameraOn ? 'bg-morandi-ink text-white' : 'bg-white/60 text-morandi-muted border border-morandi-border hover:bg-white'}
          `}
        >
          {isCameraOn ? <Camera size={24} /> : <CameraOff size={24} />}
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isConnected ? onDisconnect : onConnect}
          className={`
            relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
            ${isConnected 
              ? 'bg-morandi-ochre shadow-[0_0_30px_rgba(189,168,142,0.2)]' 
              : 'bg-white/80 text-morandi-muted border-2 border-morandi-border hover:bg-white'}
          `}
        >
          {isConnected ? (
            <div className="flex flex-col items-center">
              <Mic className="text-white" size={28} />
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-morandi-ochre"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>
          ) : (
            <MicOff size={28} />
          )}
        </motion.button>
        {isConnected && <div className="scale-75"><Waveform isActive={isListening} /></div>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-morandi-ochre">Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-morandi-sage animate-pulse' : 'bg-red-300'}`} />
            <span className={`text-xs font-serif font-bold ${isConnected ? 'text-morandi-sage' : 'text-red-300'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isConnected ? onDisconnect : onConnect}
          className={`
            p-4 rounded-2xl transition-all duration-300
            ${isConnected ? 'bg-red-300/10 text-red-300' : 'bg-morandi-sage/10 text-morandi-sage'}
          `}
        >
          <Power size={24} />
        </motion.button>
      </div>
    </div>
  );
}
