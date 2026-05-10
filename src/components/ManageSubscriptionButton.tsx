'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleManage() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();

    if (!res.ok || !data.url) {
      // エラー内容を画面に表示して原因を特定
      setError(data.error ?? 'エラーが発生しました');
      setLoading(false);
      return;
    }

    router.push(data.url);
  }

  return (
    <div>
      <button
        onClick={handleManage}
        disabled={loading}
        className="px-4 py-2 border rounded hover:bg-gray-50 text-sm disabled:opacity-50"
      >
        {loading ? '処理中...' : 'プランを管理する'}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}