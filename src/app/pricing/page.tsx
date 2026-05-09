'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
    });
    const { url } = await res.json();
    router.push(url); // Stripe の決済画面へ遷移
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="border rounded-xl p-8 max-w-sm w-full shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Pro Plan</h1>
        <p className="text-gray-500 text-sm mb-6">すべての機能が使えます</p>

        <div className="mb-6">
          <span className="text-4xl font-bold">¥1,000</span>
          <span className="text-gray-500 text-sm"> / 月</span>
        </div>

        <ul className="space-y-2 mb-8 text-sm text-gray-600">
          <li>✅ 機能 A が使える</li>
          <li>✅ 機能 B が使える</li>
          <li>✅ 優先サポート</li>
        </ul>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '処理中...' : '今すぐ始める'}
        </button>

        <p className="mt-3 text-xs text-center text-gray-400">
          テストカード: 4242 4242 4242 4242
        </p>
      </div>
    </main>
  );
}