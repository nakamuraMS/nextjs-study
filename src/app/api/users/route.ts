import { NextResponse } from 'next/server';

export async function GET() {
  const users = [
    { id: 1, name: '田中' },
    { id: 2, name: '鈴木' },
  ];
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  // ここでDBに保存する処理など
  return NextResponse.json({ message: '作成しました', data: body });
}