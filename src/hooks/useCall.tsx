import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import type { CallState, CallRecord } from '../types';
import { addCallRecord, addCallOutcome } from '../utils/storage';
import { generateId } from '../utils/formatters';
import { twilioService } from '../services/twilio';

interface CallContextType {
  callState: CallState;
  audioLevel: number;
  startCall: (leadId: string, phoneNumber: string) => Promise<boolean>;
  endCall: (outcome?: string, notes?: string) => Promise<{ leadId?: string; duration: number }>;
  toggleMute: () => void;
  resetCall: () => void;
  getFormattedTimer: () => string;
  isActive: boolean;
  isConnected: boolean;
  isMuted: boolean;
}

const CallContext = createContext<CallContextType | null>(null);

export function CallProvider({ children }: { children: ReactNode }) {
  const [callState, setCallState] = useState<CallState>({
    status: 'idle',
    timer: 0,
    muted: false,
  });

  const [audioLevel, setAudioLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cleanupRef = useRef<(() => void)[]>([]);

  const startTimer = useCallback(() => {
    startTimeRef.current = new Date();
    timerRef.current = setInterval(() => {
      setCallState((prev) => ({ ...prev, timer: prev.timer + 1 }));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setupAudioVisualization = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const animate = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average / 255);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    } catch (error) {
      console.warn('Audio visualization not available:', error);
    }
  }, []);

  const stopAudioVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  const requestMicrophonePermission = useCallback(async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      return stream;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return null;
    }
  }, []);

  const startCall = useCallback(async (leadId: string, phoneNumber: string) => {
    setCallState((prev) => ({ ...prev, status: 'requesting-permission', leadId }));

    const stream = await requestMicrophonePermission();

    if (!stream) {
      setCallState((prev) => ({
        ...prev,
        status: 'error',
        error: 'Microphone permission denied. Please allow microphone access to make calls.',
      }));
      return false;
    }

    mediaStreamRef.current = stream;
    setupAudioVisualization(stream);

    setCallState((prev) => ({ ...prev, stream, status: 'calling' }));

    try {
      const tokenResponse = await fetch('/api/twilio-token');
      const { token } = await tokenResponse.json();

      await twilioService.initialize(token);

      const call = await twilioService.call(phoneNumber);

      const cleanupIncoming = twilioService.onIncoming((incomingCall) => {
        twilioService.answer(incomingCall);
      });

      const cleanupAccept = twilioService.onAccept(() => {
        setCallState((prev) => ({ ...prev, status: 'connected', timer: 0 }));
        startTimer();
      });

      const cleanupDisconnect = twilioService.onDisconnect(() => {
        stopTimer();
        stopAudioVisualization();
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        setCallState({
          status: 'ended',
          timer: 0,
          muted: false,
        });
        startTimeRef.current = null;
      });

      const cleanupError = twilioService.onError((error) => {
        console.error('[Twilio] Call error:', error);
        setCallState((prev) => ({
          ...prev,
          status: 'error',
          error: error.message,
        }));
      });

      cleanupRef.current = [cleanupIncoming, cleanupAccept, cleanupDisconnect, cleanupError];

      return true;
    } catch (error) {
      console.error('[Twilio] Failed to start call:', error);
      setCallState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to start call',
      }));

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      stopAudioVisualization();

      return false;
    }
  }, [requestMicrophonePermission, setupAudioVisualization, startTimer, stopTimer, stopAudioVisualization]);

  const endCall = useCallback(async (outcome?: string, notes?: string) => {
    stopTimer();
    stopAudioVisualization();

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    cleanupRef.current.forEach((cleanup) => cleanup());
    cleanupRef.current = [];

    twilioService.hangup();
    await twilioService.destroy();

    const leadId = callState.leadId;
    const duration = callState.timer;

    if (leadId && callState.status === 'connected') {
      const callRecord: CallRecord = {
        id: generateId('call-'),
        leadId,
        type: 'outgoing',
        status: 'completed',
        startTime: startTimeRef.current?.toISOString() || new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration,
        outcome: outcome || 'Call completed',
        notes,
      };

      addCallRecord(callRecord);
      addCallOutcome(callRecord.outcome || 'Call completed');
    }

    setCallState({
      status: 'ended',
      timer: 0,
      muted: false,
    });

    startTimeRef.current = null;
    setIsMuted(false);

    return { leadId, duration };
  }, [callState.leadId, callState.status, callState.timer, stopTimer, stopAudioVisualization]);

  const toggleMute = useCallback(() => {
    setCallState((prev) => {
      const newMuted = !prev.muted;
      setIsMuted(newMuted);
      twilioService.toggleMute(newMuted);
      return { ...prev, muted: newMuted };
    });
  }, []);

  const resetCall = useCallback(() => {
    stopTimer();
    stopAudioVisualization();

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    cleanupRef.current.forEach((cleanup) => cleanup());
    cleanupRef.current = [];

    twilioService.hangup();

    setCallState({
      status: 'idle',
      timer: 0,
      muted: false,
    });

    startTimeRef.current = null;
    setIsMuted(false);
  }, [stopTimer, stopAudioVisualization]);

  const getFormattedTimer = useCallback(() => {
    const minutes = Math.floor(callState.timer / 60);
    const seconds = callState.timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [callState.timer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      cleanupRef.current.forEach((cleanup) => cleanup());
      twilioService.destroy();
    };
  }, []);

  const value: CallContextType = {
    callState,
    audioLevel,
    startCall,
    endCall,
    toggleMute,
    resetCall,
    getFormattedTimer,
    isActive: callState.status === 'calling' || callState.status === 'connecting' || callState.status === 'connected',
    isConnected: callState.status === 'connected',
    isMuted,
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}