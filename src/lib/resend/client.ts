import { Resend } from 'resend';
import WelcomeEmail from './emails/WelcomeEmail';
import SubscriptionEmail from './emails/SubscriptionEmail';

export const resend = new Resend(process.env.RESEND_API_KEY ?? 'dummy');

// ウェルカムメール送信
export async function sendWelcomeEmail(email: string) {
  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev', // 独自ドメインなしでテスト可能
    to: email,
    subject: 'ご登録ありがとうございます！',
    react: WelcomeEmail({ email }),
  });

  if (error) console.error('sendWelcomeEmail error:', error);
}

// サブスクリプション完了メール送信
export async function sendSubscriptionEmail(email: string, periodEnd: string) {
  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Pro プランへのアップグレードが完了しました',
    react: SubscriptionEmail({ email, periodEnd }),
  });

  if (error) console.error('sendSubscriptionEmail error:', error);
}