import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import MemoList from '@/components/MemoList';

export default async function MemosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 初期データをサーバーで取得
  const { data: memos } = await supabase
    .from('memos')
    .select('id, title, content, created_at')
    .order('created_at', { ascending: false });

  return (
    <main className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">メモ一覧</h1>
          {/* リアルタイム接続中を表示 */}
          <p className="text-xs text-green-500 mt-1">● リアルタイム接続中</p>
        </div>
        <Link
          href="/memos/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>

      {/* 初期データを渡してリアルタイム対応リストを表示 */}
      <MemoList initialMemos={memos ?? []} />
    </main>
  );
}