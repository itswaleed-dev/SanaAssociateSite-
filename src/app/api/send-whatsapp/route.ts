import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export const runtime = 'nodejs';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isE164Number(value: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { name, email, message } = payload;
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !message.trim() ||
    name.length > 120 ||
    email.length > 254 ||
    message.length > 3500 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json(
      { success: false, error: 'Please provide a valid name, email, and message.' },
      { status: 400 }
    );
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const senderNumber = process.env.TWILIO_WHATSAPP_NUMBER?.trim();
  const recipientNumber = process.env.MY_WHATSAPP_NUMBER?.trim();

  if (!accountSid || !authToken || !senderNumber || !recipientNumber) {
    return NextResponse.json(
      { success: false, error: 'WhatsApp notifications are not configured on the server.' },
      { status: 503 }
    );
  }

  if (!isE164Number(senderNumber) || !isE164Number(recipientNumber)) {
    return NextResponse.json(
      { success: false, error: 'WhatsApp phone numbers must use E.164 format, such as +14155238886.' },
      { status: 503 }
    );
  }

  const body = [
    'New website contact message',
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Message: ${message.trim()}`,
  ].join('\n');

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      from: `whatsapp:${senderNumber}`,
      to: `whatsapp:${recipientNumber}`,
      body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send WhatsApp contact notification:', error);
    return NextResponse.json(
      { success: false, error: 'Could not send the WhatsApp notification.' },
      { status: 502 }
    );
  }
}
