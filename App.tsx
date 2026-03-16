import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGeminiLive } from './useGeminiLive';
import { InstructionHeader } from './components/InstructionHeader';
import { ControlBar } from './components/ControlBar';
import { SafetyToast } from './components/SafetyToast';
import { RecipeSidebar } from './components/RecipeSidebar';
import { ChefHat, CameraOff } from 'lucide-react';

export default function App() {
  const {
    isConnected,
    isListening,
    transcript,
    currentStep,
    recipe,
    warnings,
    connect,
    disconnect,
    sendVideoFrame
  } = useGeminiLive();

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Camera handling
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: 640, height: 480 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error starting camera:", err);
        setIsCameraOn(false);
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    }

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [isCameraOn]);

  // Send frames to Gemini
  useEffect(() => {
    if (!isCameraOn || !isConnected) return;

    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.drawImage(videoRef.current, 0, 0, 640, 480);
          const base64Data = canvasRef.current.toDataURL('image/jpeg', 0.5).split(',')[1];
          sendVideoFrame(base64Data);
        }
      }
    }, 2000); // 0.5 FPS for stability

    return () => clearInterval(interval);
  }, [isCameraOn, isConnected, sendVideoFrame]);

  return (
    <div className="h-screen bg-morandi-bg text-morandi-ink font-sans selection:bg-morandi-ochre/30 overflow-hidden flex flex-col relative">
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
        <SafetyToast warnings={warnings} />
        
        {/* Header / Nav */}
      <AnimatePresence>
        {!isHandsFree && (
          <motion.header 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 64, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 flex items-center justify-between border-b border-morandi-border bg-white/40 backdrop-blur-xl z-40 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-morandi-ochre rounded-2xl shadow-sm">
                <ChefHat className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold tracking-tight leading-none">LIVE KITCHEN</h2>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-morandi-ochre">Gemini Sous-Chef</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-morandi-sage animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-morandi-muted">System Active</span>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar">
          <InstructionHeader step={currentStep} isHandsFree={isHandsFree} />
          
          {transcript && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-morandi-border shadow-sm"
            >
              <p className="text-xs font-serif italic text-morandi-muted mb-1">Sous-Chef says:</p>
              <p className="text-lg font-serif font-medium leading-relaxed">{transcript}</p>
            </motion.div>
          )}
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold italic text-morandi-ochre uppercase tracking-widest">Visual Context</h3>
              <div className="h-px flex-1 ml-4 bg-morandi-border" />
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {/* Camera View */}
              <div className={`
                relative aspect-video rounded-[3rem] overflow-hidden bg-morandi-paper/40 border border-morandi-border shadow-sm
                ${!isCameraOn ? 'flex items-center justify-center' : ''}
              `}>
                <AnimatePresence>
                  {isCameraOn ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover grayscale-[0.2] contrast-[1.02]"
                      />
                      <div className="absolute top-8 left-8 flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-morandi-border">
                        <div className="w-2 h-2 bg-morandi-sage rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-morandi-ink">Recognition Active</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-morandi-muted/40">
                      <CameraOff size={64} strokeWidth={1} />
                      <p className="text-lg font-serif italic">Camera is off</p>
                    </div>
                  )}
                </AnimatePresence>
                <canvas ref={canvasRef} width={640} height={480} className="hidden" />
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Sidebar */}
        <RecipeSidebar recipe={recipe} />
      </main>

      {/* Footer Controls */}
      <footer className="z-50">
        <ControlBar 
          isConnected={isConnected}
          isListening={isListening}
          isCameraOn={isCameraOn}
          isHandsFree={isHandsFree}
          onConnect={connect}
          onDisconnect={disconnect}
          onToggleCamera={() => setIsCameraOn(!isCameraOn)}
          onToggleHandsFree={() => setIsHandsFree(!isHandsFree)}
        />
      </footer>
    </div>
    </div>
  );
}
