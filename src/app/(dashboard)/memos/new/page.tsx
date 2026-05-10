'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function NewMemoPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePath, setImagePath] = useState(''); // 追加
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('memos').insert({
      title,
      content,
      user_id: user.id,
      image_path: imagePath || null, // 追加
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/memos');
    }
    setLoading(false);
  }

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">メモを作成</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="メモの内容を入力"
            rows={6}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* 画像アップロード追加 */}
        <ImageUploadWrapper onUpload={setImagePath} />
        {imagePath && (
          <p className="text-sm text-green-600">✅ 画像がアップロードされました</p>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      </div>
    </main>
  );
}

// ユーザーIDを取得してから ImageUpload に渡すラッパー
function ImageUploadWrapper({ onUpload }: { onUpload: (path: string) => void }) {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  if (!userId) return null;
  return <ImageUpload userId={userId} onUpload={onUpload} />;
}

// useEffect のインポートを追加
import { useEffect } from 'react';