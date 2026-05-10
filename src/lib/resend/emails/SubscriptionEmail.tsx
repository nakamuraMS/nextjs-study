import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type Props = {
  email: string;
  periodEnd: string;
};

export default function SubscriptionEmail({ email, periodEnd }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Pro プランへのアップグレードが完了しました！</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '24px' }}>
              Pro プランへようこそ 🚀
            </Heading>
            <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.6' }}>
              {email} のアカウントで Pro プランが有効になりました。
            </Text>
            <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.6' }}>
              次回更新日：<strong>{periodEnd}</strong>
            </Text>
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
              style={{
                display: 'inline-block',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '16px',
                marginTop: '16px',
              }}
            >
              ダッシュボードを確認する
            </Link>
          </Section>
          <Text style={{ color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
            プランの管理は{' '}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
              こちら
            </Link>
            から行えます。
          </Text>
        </Container>
      </Body>
    </Html>
  );
}