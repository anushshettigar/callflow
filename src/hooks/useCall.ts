import { useState, useCallback, useRef, useEffect } from 'react';
import type { CallState, CallRecord } from '../types';
import { addCallRecord, getCallOutcomes, addCallOutcome } from '../utils/storage';
import { formatDuration, generateId } from '../utils/formatters';

export function useCall() {
  const [callState, setCallState] = useState<CallState>({
    status: 'idle',
    timer: 0,
    muted: false
  });
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const startTimer = useCallback(() => {
    startTimeRef.current = new Date();
    timerRef.current = setInterval(() => {
      setCallState(prev => ({ ...prev, timer: prev.timer + 1 }));
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
          autoGainControl: true
        } 
      });
      return stream;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return null;
    }
  }, []);

  const startCall = useCallback(async (leadId: string) => {
    setCallState(prev => ({ ...prev, status: 'requesting-permission', leadId }));
    
    const stream = await requestMicrophonePermission();
    
    if (!stream) {
      setCallState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: 'Microphone permission denied. Please allow microphone access to make calls.' 
      }));
      return false;
    }

    mediaStreamRef.current = stream;
    setCallState(prev => ({ ...prev, stream, status: 'calling' }));
    
    setupAudioVisualization(stream);
    
    setTimeout(() => {
      setCallState(prev => ({ ...prev, status: 'connecting' }));
      
      setTimeout(() => {
        setCallState(prev => ({ 
          ...prev, 
          status: 'connected', 
          timer: 0 
        }));
        startTimer();
      }, 1500);
    }, 2000);
    
    return true;
  }, [requestMicrophonePermission, setupAudioVisualization, startTimer]);

  const endCall = useCallback(async (outcome?: string, notes?: string) => {
    stopTimer();
    stopAudioVisualization();
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
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
        notes
      };
      
      addCallRecord(callRecord);
      addCallOutcome(callRecord.outcome || 'Call completed');
    }
    
    setCallState({
      status: 'ended',
      timer: 0,
      muted: false
    });
    
    startTimeRef.current = null;
    
    return { leadId, duration };
  }, [callState.leadId, callState.status, callState.timer, stopTimer, stopAudioVisualization]);

  const toggleMute = useCallback(() => {
    setCallState(prev => {
      const newMuted = !prev.muted;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach(track => {
          track.enabled = !newMuted;
        });
      }
      return { ...prev, muted: newMuted };
    });
  }, []);

  const resetCall = useCallback(() => {
    stopTimer();
    stopAudioVisualization();
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    setCallState({
      status: 'idle',
      timer: 0,
      muted: false
    });
    
    startTimeRef.current = null;
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
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    callState,
    audioLevel,
    startCall,
    endCall,
    toggleMute,
    resetCall,
    getFormattedTimer,
    isActive: callState.status === 'calling' || callState.status === 'connecting' || callState.status === 'connected',
    isConnected: callState.status === 'connected'
  };
}