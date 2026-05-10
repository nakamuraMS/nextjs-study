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
};

export default function WelcomeEmail({ email }: Props) {
  return (
    <Html>
      <Head />
      <Preview>ご登録ありがとうございます！</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '24px' }}>
              ご登録ありがとうございます 🎉
            </Heading>
            <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.6' }}>
              {email} でご登録いただきました。
            </Text>
            <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.6' }}>
              さっそくダッシュボードにアクセスしてみましょう。
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
              ダッシュボードへ
            </Link>
          </Section>
          <Text style={{ color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
            このメールに心当たりがない場合は無視してください。
          </Text>
        </Container>
      </Body>
    </Html>
  );
}