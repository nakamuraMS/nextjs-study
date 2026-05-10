'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type Memo = {
  id: string;
  title: string;
  content: string | null;
  created_at: string | null;
};

type Props = {
  initialMemos: Memo[]; // Server Component から初期データを受け取る
};

export default function MemoList({ initialMemos }: Props) {
  const [memos, setMemos] = useState<Memo[]>(initialMemos);

  useEffect(() => {
    const supabase = createClient();

    // Realtime チャンネルを購読
    const channel = supabase
      .channel('memos-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT・UPDATE・DELETE すべて監視
          schema: 'public',
          table: 'memos',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // 新しいメモを先頭に追加
            // 重複追加を防ぐ
            setMemos((prev) => {
                if (prev.some((memo) => memo.id === payload.new.id)) return prev;
                return [payload.new as Memo, ...prev];
            });
            
          }

          if (payload.eventType === 'UPDATE') {
            // 該当メモを更新
            setMemos((prev) =>
              prev.map((memo) =>
                memo.id === payload.new.id ? (payload.new as Memo) : memo
              )
            );
          }

          if (payload.eventType === 'DELETE') {
            // 該当メモを削除
            setMemos((prev) =>
              prev.filter((memo) => memo.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // クリーンアップ（ページ離脱時に購読を解除）
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (memos.length === 0) {
    return <p className="text-gray-500">メモがまだありません</p>;
  }

  return (
    <ul className="space-y-3">
      {memos.map((memo) => (
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
  );
}