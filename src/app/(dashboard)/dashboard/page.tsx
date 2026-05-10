import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import ManageSubscriptionButton from '@/components/ManageSubscriptionButton';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // サブスクリプション状態を取得
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .single();

  // データ取得状態を確認する場合にコメントを外す
  // console.log('subscription:', subscription);
  // console.log('subError:', subError);

  const isActive = subscription?.status === 'active';

  return (
    <main className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <LogoutButton />
      </div>

      {/* ユーザー情報 */}
      <div className="border rounded-lg p-6 mb-4">
        <p className="text-sm text-gray-500 mb-1">ログイン中のユーザー</p>
        <p className="font-medium">{user.email}</p>
      </div>

      {/* サブスクリプション状態 */}
      <div className="border rounded-lg p-6 mb-4">
        <p className="text-sm text-gray-500 mb-2">プラン</p>
        {isActive ? (
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
              ✅ Pro プラン（有効）
            </span>
            <p className="text-sm text-gray-500">
              次回更新日：{subscription?.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString('ja-JP')
                : ''}
            </p>
            <div className="mt-3">
              <ManageSubscriptionButton />
            </div>
          </div>
        ) : (
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-3">
              Free プラン
            </span>
            <div className="mt-3">
              <Link
                href="/pricing"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Pro にアップグレード
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}