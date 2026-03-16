import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from "@google/genai";
import { CookingStep, SafetyWarning, Recipe } from './types';

export function useGeminiLive() {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentStep, setCurrentStep] = useState<CookingStep>({
    number: 1,
    text: "Welcome to your Live Kitchen. Say 'Let's start cooking' or show me your ingredients to begin.",
    totalSteps: 0
  });
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [warnings, setWarnings] = useState<SafetyWarning[]>([]);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef<number>(0);

  const addWarning = useCallback((message: string, type: 'danger' | 'warning' = 'warning') => {
    const id = Math.random().toString(36).substr(2, 9);
    setWarnings(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setWarnings(prev => prev.filter(w => w.id !== id));
    }, 5000);
  }, []);

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const connect = useCallback(async () => {
    if (isConnected) return;

    // Request microphone access immediately to stay within user gesture context
    let audioStream: MediaStream;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error("Microphone access denied:", err);
      addWarning("Microphone access is required for voice control.", "danger");
      return;
    }

    // Initialize AudioContexts here (within user gesture)
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
    }
    if (!playbackContextRef.current) {
      playbackContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    
    await audioContextRef.current.resume();
    await playbackContextRef.current.resume();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const sessionPromise = ai.live.connect({
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        systemInstruction: `You are a professional Kitchen Sous-Chef. Your goal is to guide the user PATIENTLY and QUIETLY.
        CRITICAL RULES:
        1. FIRST, ask the user what dish they would like to cook today.
        2. ONCE the user confirms the dish, use 'set_recipe' to provide the full recipe overview (name, ingredients, and all steps).
        3. STAY SILENT unless the user speaks to you or a major safety issue is detected.
        4. NEVER advance to a new step automatically. You MUST ask "Ready for the next step?" and wait for a "Yes" or "Next" command.
        5. DO NOT interpret background kitchen noises (clinking, water running) as speech.
        6. When you do speak, be extremely brief.
        7. Use 'update_step' only when the user explicitly confirms they are moving forward.`,
        tools: [
          {
            functionDeclarations: [
              {
                name: "update_step",
                description: "Update the current cooking step.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    number: { type: Type.NUMBER },
                    text: { type: Type.STRING },
                    totalSteps: { type: Type.NUMBER }
                  },
                  required: ["number", "text", "totalSteps"]
                }
              },
              {
                name: "set_recipe",
                description: "Set the full recipe overview after the user confirms the dish.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    ingredients: { 
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    steps: { 
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["name", "description", "ingredients", "steps"]
                }
              },
              {
                name: "trigger_safety_warning",
                description: "Show a safety warning.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    message: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["danger", "warning"] }
                  },
                  required: ["message", "type"]
                }
              }
            ]
          }
        ]
      },
      callbacks: {
        onopen: () => {
          console.log("Live session opened");
          setIsConnected(true);
          startAudioCapture(sessionPromise, audioStream);
        },
        onmessage: async (message: LiveServerMessage) => {
          console.log("Message received:", message);
          if (message.serverContent?.modelTurn) {
            setTranscript(''); // Clear previous transcript for new turn
            if (message.serverContent.modelTurn.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData) {
                  playAudio(part.inlineData.data);
                }
                if (part.text) {
                  setTranscript(prev => prev + part.text);
                }
              }
            }
          }

          if (message.serverContent?.interrupted) {
            stopAudioPlayback();
          }

          if (message.toolCall) {
            for (const call of message.toolCall.functionCalls) {
              const { name, args, id } = call;
              if (name === "update_step") {
                setCurrentStep(args as any);
              } else if (name === "set_recipe") {
                setRecipe(args as any);
              } else if (name === "trigger_safety_warning") {
                addWarning((args as any).message, (args as any).type);
              }
              
              sessionPromise.then(session => {
                session.sendToolResponse({
                  functionResponses: [{
                    name,
                    id,
                    response: { status: "success" }
                  }]
                });
              });
            }
          }
        },
        onclose: () => {
          console.log("Live session closed");
          setIsConnected(false);
          stopAudioCapture();
        },
        onerror: (error) => {
          console.error("Live API Error:", error);
          setIsConnected(false);
          addWarning("Connection error. Please try again.", "warning");
        }
      }
    });

    sessionRef.current = await sessionPromise;
  }, [isConnected, addWarning]);

  const disconnect = useCallback(() => {
    sessionRef.current?.close();
    setIsConnected(false);
  }, []);

  const startAudioCapture = async (sessionPromise: Promise<any>, stream: MediaStream) => {
    try {
      if (!audioContextRef.current) return;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        const base64Data = arrayBufferToBase64(pcmData.buffer);
        
        sessionPromise.then(session => {
          session.sendRealtimeInput({
            media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        });
      };

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      setIsListening(true);
    } catch (err) {
      console.error("Error capturing audio:", err);
    }
  };

  const stopAudioCapture = () => {
    processorRef.current?.disconnect();
    setIsListening(false);
  };

  const playAudio = async (base64Data: string) => {
    if (!playbackContextRef.current) return;

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    const buffer = playbackContextRef.current.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);
    const source = playbackContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(playbackContextRef.current.destination);

    const startTime = Math.max(playbackContextRef.current.currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;
  };

  const stopAudioPlayback = () => {
    nextStartTimeRef.current = 0;
    playbackContextRef.current?.close();
    playbackContextRef.current = null;
  };

  const sendVideoFrame = useCallback((base64Data: string) => {
    if (sessionRef.current) {
      sessionRef.current.sendRealtimeInput({
        media: { data: base64Data, mimeType: 'image/jpeg' }
      });
    }
  }, []);

  return {
    isConnected,
    isListening,
    transcript,
    currentStep,
    recipe,
    warnings,
    connect,
    disconnect,
    sendVideoFrame
  };
}
