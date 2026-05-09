'use client';

import { useState } from 'react';

type User = {
  id: number;
  name: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ユーザー一覧を取得
  async function fetchUsers() {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  // ユーザーを作成
  async function handleSubmit() {
    if (!newName.trim()) return;
    setLoading(true);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    const data = await res.json();
    setMessage(data.message);
    setNewName('');
    setLoading(false);
  }

  return (
    <main className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">ユーザー管理</h1>

      {/* ユーザー作成フォーム */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">ユーザーを作成</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="ユーザー名を入力"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            作成
          </button>
        </div>
        {message && (
          <p className="mt-2 text-green-600 text-sm">{message}</p>
        )}
      </section>

      {/* ユーザー一覧 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">ユーザー一覧</h2>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? '取得中...' : '一覧を取得'}
          </button>
        </div>
        {users.length === 0 ? (
          <p className="text-gray-500 text-sm">「一覧を取得」を押してください</p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="border rounded px-4 py-3 flex items-center gap-3">
                <span className="text-gray-400 text-sm">#{user.id}</span>
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}