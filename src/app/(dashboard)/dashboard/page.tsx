import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton'; // 追加

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 未ログインならログインページへ
  if (!user) redirect('/login');

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">ダッシュボード</h1>
      <LogoutButton /> {/* 追加 */}
      <div className="border rounded-lg p-6 max-w-md">
        <p className="text-sm text-gray-500 mb-1">ログイン中のユーザー</p>
        <p className="font-medium">{user.email}</p>
        <p className="text-sm text-gray-400 mt-1">ID: {user.id}</p>
      </div>
    </main>
  );
}
