import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const PRICE_ID = 'price_1TU6XELBDzSOAg6qkuIhVouT'; // ② でメモした Price ID

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('profile error:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { user_id: user.id },
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error('checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}