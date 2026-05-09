'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setError('');
    setMessage('');

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.session) {
      // メール確認OFFの場合 → セッションがすぐ返るのでリダイレクト
      router.push('/dashboard');
    } else {
      // メール確認ONの場合 → メール送信メッセージを表示
      setMessage('確認メールを送信しました。メールを確認してください。');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">アカウント作成</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '処理中...' : 'アカウント作成'}
          </button>
        </div>

        <p className="mt-4 text-sm text-center text-gray-600">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}