import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendSubscriptionEmail } from '@/lib/resend/client';

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

  // console.log('webhook event type:', event.type); // どのイベントが届いているか

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const item = sub.items.data[0];

      console.log('sub.customer:', sub.customer);
      console.log('item:', item);

      const customer = await stripe.customers.retrieve(sub.customer as string);
      console.log('customer:', customer);

      if (customer.deleted) {
        console.log('customer deleted, skip');
        break;
      }

      const userId = customer.metadata.user_id;
      console.log('userId:', userId);

      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert({
          id: sub.id,
          user_id: userId,
          status: sub.status,
          price_id: item.price.id,
          // Unix タイムスタンプ → ISO 8601 文字列に変換
          current_period_end: new Date(item.current_period_end * 1000)
      });

      if (upsertError) {
        console.error('upsert error:', upsertError); // ← ここが重要
      } else {
        console.log('subscription saved successfully');

        // サンクスメール送信を追加
        const periodEnd = new Date(item.current_period_end * 1000)
          .toLocaleDateString('ja-JP');
        await sendSubscriptionEmail(customer.email!, periodEnd);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await supabase.from('subscriptions').delete().eq('id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}