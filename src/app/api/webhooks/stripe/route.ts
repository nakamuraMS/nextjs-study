import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body, signature, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const item = sub.items.data[0]; // ← アイテムから取得
      await supabase.from('subscriptions').upsert({
        id: sub.id,
        user_id: sub.metadata.user_id,
        status: sub.status,
        price_id: item.price.id,
        current_period_end: item.current_period_end, // ← ここを変更
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from('subscriptions').delete().eq('id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}