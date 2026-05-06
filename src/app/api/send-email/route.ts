import { resend } from '@/lib/resend/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { to, subject, html } = await req.json();

  const { data, error } = await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to,
    subject,
    html,
  });

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}