export interface CallServiceConfig {
  iceServers?: RTCIceServer[];
}

export interface CallSession {
  id: string;
  leadId: string;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  peerConnection?: RTCPeerConnection;
  status: 'idle' | 'connecting' | 'connected' | 'ended' | 'error';
  startTime?: Date;
  error?: string;
}

class CallingService {
  private sessions: Map<string, CallSession> = new Map();
  private config: CallServiceConfig;

  constructor(config: CallServiceConfig = {}) {
    this.config = {
      iceServers: config.iceServers || [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
  }

  async createPeerConnection(sessionId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({
      iceServers: this.config.iceServers
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.handleIceCandidate(sessionId, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      this.handleTrack(sessionId, event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      this.handleConnectionStateChange(sessionId, pc.connectionState);
    };

    const session = this.sessions.get(sessionId);
    if (session) {
      session.peerConnection = pc;
    }

    return pc;
  }

  private handleIceCandidate(sessionId: string, candidate: RTCIceCandidate): void {
    const session = this.sessions.get(sessionId);
    if (session && session.peerConnection) {
      console.log(`ICE candidate for ${sessionId}:`, candidate);
    }
  }

  private handleTrack(sessionId: string, stream: MediaStream): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.remoteStream = stream;
      session.status = 'connected';
      console.log(`Remote track received for ${sessionId}`);
    }
  }

  private handleConnectionStateChange(sessionId: string, state: RTCPeerConnectionState): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    switch (state) {
      case 'connected':
        session.status = 'connected';
        break;
      case 'disconnected':
      case 'failed':
      case 'closed':
        session.status = 'ended';
        break;
    }
    console.log(`Connection state for ${sessionId}: ${state}`);
  }

  async startOutboundCall(leadId: string, phoneNumber: string): Promise<CallSession> {
    const sessionId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session: CallSession = {
      id: sessionId,
      leadId,
      status: 'connecting',
      startTime: new Date()
    };

    this.sessions.set(sessionId, session);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      session.localStream = stream;

      const pc = await this.createPeerConnection(sessionId);
      
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log(`Outbound call initiated to ${phoneNumber} for lead ${leadId}`);
      console.log('SDP Offer:', offer.sdp);

      return session;
    } catch (error) {
      session.status = 'error';
      session.error = error instanceof Error ? error.message : 'Failed to start call';
      throw error;
    }
  }

  async answerIncomingCall(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.peerConnection) {
      throw new Error('Session not found');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      session.localStream = stream;

      stream.getTracks().forEach(track => {
        session.peerConnection!.addTrack(track, stream);
      });

      const answer = await session.peerConnection.createAnswer();
      await session.peerConnection.setLocalDescription(answer);

      console.log('Incoming call answered');
      console.log('SDP Answer:', answer.sdp);
    } catch (error) {
      session.status = 'error';
      session.error = error instanceof Error ? error.message : 'Failed to answer call';
      throw error;
    }
  }

  async endCall(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    if (session.localStream) {
      session.localStream.getTracks().forEach(track => track.stop());
    }

    if (session.remoteStream) {
      session.remoteStream.getTracks().forEach(track => track.stop());
    }

    if (session.peerConnection) {
      session.peerConnection.close();
    }

    session.status = 'ended';
    console.log(`Call ended: ${sessionId}`);
  }

  toggleMute(sessionId: string, muted: boolean): void {
    const session = this.sessions.get(sessionId);
    if (session?.localStream) {
      session.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
  }

  getSession(sessionId: string): CallSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): CallSession[] {
    return Array.from(this.sessions.values());
  }

  getActiveSessions(): CallSession[] {
    return Array.from(this.sessions.values()).filter(
      s => s.status === 'connecting' || s.status === 'connected'
    );
  }

  cleanup(): void {
    this.sessions.forEach(session => {
      if (session.localStream) {
        session.localStream.getTracks().forEach(track => track.stop());
      }
      if (session.remoteStream) {
        session.remoteStream.getTracks().forEach(track => track.stop());
      }
      if (session.peerConnection) {
        session.peerConnection.close();
      }
    });
    this.sessions.clear();
  }
}

export const callingService = new CallingService();

export const SIMULATED_CALL_DELAY = 2000;
export const SIMULATED_CONNECT_DELAY = 1500;

export async function simulateOutboundCall(leadId: string): Promise<{
  success: boolean;
  stream?: MediaStream;
  error?: string;
}> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    await new Promise(resolve => setTimeout(resolve, SIMULATED_CALL_DELAY));
    await new Promise(resolve => setTimeout(resolve, SIMULATED_CONNECT_DELAY));

    return { success: true, stream };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to access microphone' 
    };
  }
}

export function createSimulatedCallEvents(
  onStatusChange: (status: string) => void,
  onTimer: (seconds: number) => void,
  onEnded: () => void
): { start: () => void; end: () => void; mute: (muted: boolean) => void } {
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let statusTimeout: ReturnType<typeof setTimeout> | null = null;
  let connectTimeout: ReturnType<typeof setTimeout> | null = null;
  let seconds = 0;
  let isActive = false;

  const start = () => {
    isActive = true;
    seconds = 0;
    onStatusChange('calling');
    
    statusTimeout = setTimeout(() => {
      if (!isActive) return;
      onStatusChange('connecting');
      
      connectTimeout = setTimeout(() => {
        if (!isActive) return;
        onStatusChange('connected');
        timerInterval = setInterval(() => {
          seconds++;
          onTimer(seconds);
        }, 1000);
      }, SIMULATED_CONNECT_DELAY);
    }, SIMULATED_CALL_DELAY);
  };

  const end = () => {
    isActive = false;
    if (timerInterval) clearInterval(timerInterval);
    if (statusTimeout) clearTimeout(statusTimeout);
    if (connectTimeout) clearTimeout(connectTimeout);
    onStatusChange('ended');
    onEnded();
  };

  const mute = (muted: boolean) => {
    console.log(`Microphone ${muted ? 'muted' : 'unmuted'}`);
  };

  return { start, end, mute };
}