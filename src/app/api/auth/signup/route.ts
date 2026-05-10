import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/resend/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // サインアップ成功時にウェルカムメール送信
  if (data.user) {
    await sendWelcomeEmail(email);
  }

  return NextResponse.json({ user: data.user });
}