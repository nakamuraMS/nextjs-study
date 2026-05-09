import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">ありがとうございます！</h1>
        <p className="text-gray-600 mb-6">サブスクリプションが有効になりました</p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ダッシュボードへ
        </Link>
      </div>
    </main>
  );
}