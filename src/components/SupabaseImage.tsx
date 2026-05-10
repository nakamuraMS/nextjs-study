'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

type Props = {
  path: string;
};

export default function SupabaseImage({ path }: Props) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    async function getUrl() {
      const supabase = createClient();
      const { data } = await supabase.storage
        .from('memo-images')
        .createSignedUrl(path, 60 * 60); // 1時間有効

      if (data) setUrl(data.signedUrl);
    }
    getUrl();
  }, [path]);

  if (!url) return <div className="w-full h-48 bg-gray-100 rounded animate-pulse" />;

  return (
    <div className="relative w-full h-48">
      <Image
        src={url}
        alt="メモの画像"
        fill
        className="object-cover rounded"
      />
    </div>
  );
}