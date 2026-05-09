// 'use client' が「ない」のがServer Component

type Post = {
  id: number;
  title: string;
  body: string;
};

// サーバー側で実行される（ブラウザには届かない）
async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  return res.json();
}

// async がついたコンポーネント = Server Component だけの特権
export default async function PostsPage() {
  const posts = await getPosts(); // ← awaitを直接使える！

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">投稿一覧</h1>
      <p className="text-sm text-gray-500 mb-6">
        ※ このデータはサーバー側で取得されています
      </p>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border rounded-lg p-4">
            <h2 className="font-bold">{post.title}</h2>
            <p className="mt-1 text-gray-600 text-sm">{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}