import { Device, Call } from '@twilio/voice-sdk';

type CallEventHandler = (call: Call) => void;

class TwilioService {
  private device: Device | null = null;
  private currentCall: Call | null = null;
  private onIncomingHandlers: CallEventHandler[] = [];
  private onAcceptHandlers: CallEventHandler[] = [];
  private onDisconnectHandlers: CallEventHandler[] = [];
  private onErrorHandlers: ((error: Error) => void)[] = [];

  async initialize(token: string): Promise<void> {
    if (this.device) {
      await this.destroy();
    }

    this.device = new Device(token, {
      allowIncomingWhileBusy: true,
    });

    this.device.on('registered', () => {
      console.log('[Twilio] Device registered, ready for calls');
    });

    this.device.on('unregistered', () => {
      console.log('[Twilio] Device unregistered');
    });

    this.device.on('incoming', (call: Call) => {
      console.log('[Twilio] Incoming call');
      this.currentCall = call;
      this.setupCallEvents(call);
      this.onIncomingHandlers.forEach((h) => h(call));
    });

    this.device.on('error', (error: Error) => {
      console.error('[Twilio] Device error:', error);
      this.onErrorHandlers.forEach((h) => h(error));
    });

    try {
      await this.device.register();
    } catch (error) {
      console.error('[Twilio] Registration failed:', error);
      throw error;
    }
  }

  private setupCallEvents(call: Call): void {
    call.on('accept', () => {
      console.log('[Twilio] Call accepted');
      this.onAcceptHandlers.forEach((h) => h(call));
    });

    call.on('disconnect', () => {
      console.log('[Twilio] Call disconnected');
      this.onDisconnectHandlers.forEach((h) => h(call));
      this.currentCall = null;
    });

    call.on('reject', () => {
      console.log('[Twilio] Call rejected');
      this.currentCall = null;
    });

    call.on('cancel', () => {
      console.log('[Twilio] Call cancelled');
      this.currentCall = null;
    });

    call.on('error', (error: Error) => {
      console.error('[Twilio] Call error:', error);
      this.onErrorHandlers.forEach((h) => h(error));
    });
  }

  async call(phoneNumber: string): Promise<Call> {
    if (!this.device) {
      throw new Error('Device not initialized');
    }

    const call = await this.device.connect({
      params: { To: phoneNumber },
    });

    this.currentCall = call;
    this.setupCallEvents(call);
    return call;
  }

  async answer(incomingCall: Call): Promise<void> {
    await incomingCall.accept();
  }

  hangup(): void {
    if (this.currentCall) {
      this.currentCall.disconnect();
      this.currentCall = null;
    }
  }

  toggleMute(muted: boolean): void {
    if (this.currentCall) {
      this.currentCall.mute(muted);
    }
  }

  onIncoming(handler: CallEventHandler): () => void {
    this.onIncomingHandlers.push(handler);
    return () => {
      this.onIncomingHandlers = this.onIncomingHandlers.filter((h) => h !== handler);
    };
  }

  onAccept(handler: CallEventHandler): () => void {
    this.onAcceptHandlers.push(handler);
    return () => {
      this.onAcceptHandlers = this.onAcceptHandlers.filter((h) => h !== handler);
    };
  }

  onDisconnect(handler: CallEventHandler): () => void {
    this.onDisconnectHandlers.push(handler);
    return () => {
      this.onDisconnectHandlers = this.onDisconnectHandlers.filter((h) => h !== handler);
    };
  }

  onError(handler: (error: Error) => void): () => void {
    this.onErrorHandlers.push(handler);
    return () => {
      this.onErrorHandlers = this.onErrorHandlers.filter((h) => h !== handler);
    };
  }

  async destroy(): Promise<void> {
    if (this.device) {
      this.hangup();
      await this.device.destroy();
      this.device = null;
    }
    this.onIncomingHandlers = [];
    this.onAcceptHandlers = [];
    this.onDisconnectHandlers = [];
    this.onErrorHandlers = [];
  }

  get isRegistered(): boolean {
    return this.device?.state === 'registered';
  }

  get activeCall(): Call | null {
    return this.currentCall;
  }
}

export const twilioService = new TwilioService();