import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function MemosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 自分のメモだけ取得（RLS が自動でフィルタリング）
  const { data: memos, error } = await supabase
    .from('memos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error(error);

  return (
    <main className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">メモ一覧</h1>
        <Link
          href="/memos/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>

      {memos && memos.length === 0 && (
        <p className="text-gray-500">メモがまだありません</p>
      )}

      <ul className="space-y-3">
        {memos?.map((memo) => (
          <li key={memo.id}>
            <Link
              href={`/memos/${memo.id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="font-bold">{memo.title}</h2>
              {memo.content && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {memo.content}
                </p>
              )}
              <p className="text-gray-400 text-xs mt-2">
                {memo.created_at
                  ? new Date(memo.created_at).toLocaleString('ja-JP')
                  : ''}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}