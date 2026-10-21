import type { VercelRequest, VercelResponse } from '@vercel/node';
import { VoiceResponse } from 'twilio/lib/twiml/VoiceResponse';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const to = req.body?.To;

  const voiceResponse = new VoiceResponse();

  if (to) {
    const dial = voiceResponse.dial({ callerId: process.env.TWILIO_CALLER_ID });
    if (to.startsWith('client:')) {
      dial.client(to.replace('client:', ''));
    } else {
      dial.number(to);
    }
  } else {
    voiceResponse.say('Invalid call configuration');
  }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(voiceResponse.toString());
}