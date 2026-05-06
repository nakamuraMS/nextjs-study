import { type NextRequest, NextResponse } from 'next/server';

// 認証ページ実装後に有効化する
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};