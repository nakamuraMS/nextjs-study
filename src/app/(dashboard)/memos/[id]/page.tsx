import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import MemoDetail from '@/components/MemoDetail';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MemoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: memo } = await supabase
    .from('memos')
    .select('*')
    .eq('id', id)
    .single();

  if (!memo) notFound();

  return <MemoDetail memo={memo} />;
}