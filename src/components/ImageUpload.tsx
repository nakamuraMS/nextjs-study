'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  userId: string;
  onUpload: (path: string) => void;
};

export default function ImageUpload({ userId, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('5MB 以下のファイルを選択してください');
      return;
    }

    setUploading(true);
    setError('');

    const supabase = createClient();

    // 日本語・スペースを除去してファイル名をサニタイズ
    const ext = file.name.split('.').pop(); // 拡張子だけ取得
    const safeFileName = `${Date.now()}.${ext}`; // タイムスタンプ.拡張子 に変換
    const filePath = `${userId}/${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('memo-images')
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
    } else {
      onUpload(filePath);
    }

    setUploading(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">画像を添付</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-medium
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          disabled:opacity-50"
      />
      {uploading && <p className="text-sm text-gray-500 mt-1">アップロード中...</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}