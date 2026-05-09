import { stripe } from '@/lib/stripe/client';
import { NextResponse } from 'next/server';

const PRICE_ID = 'price_xxxxxxxxxx'; // ③ でメモした Price ID に書き換える

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    // Supabase 実装後にここでユーザーIDを渡す
    // metadata: { user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}