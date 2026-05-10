'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Memo = {
  id: string;
  title: string;
  content: string | null;
  created_at: string | null; // ← string から string | null に変更
  updated_at: string | null; // ← 追加
  user_id: string;           // ← 追加
};

export default function MemoDetail({ memo }: { memo: Memo }) {
  const [title, setTitle] = useState(memo.title);
  const [content, setContent] = useState(memo.content ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 更新
  async function handleUpdate() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('memos')
      .update({ title, content })
      .eq('id', memo.id);

    if (!error) {
      setIsEditing(false);
      router.refresh(); // Server Component を再取得
    }
    setLoading(false);
  }

  // 削除
  async function handleDelete() {
    if (!confirm('このメモを削除しますか？')) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from('memos').delete().eq('id', memo.id);
    router.push('/memos');
  }

  return (
    <main className="p-8 max-w-2xl">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold border-b pb-2 outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                編集
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
              >
                削除
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            {memo.created_at
              ? new Date(memo.created_at).toLocaleString('ja-JP')
              : ''}
          </p>
          <p className="whitespace-pre-wrap text-gray-700">{content}</p>
        </div>
      )}
    </main>
  );
}