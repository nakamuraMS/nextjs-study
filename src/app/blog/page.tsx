import Link from 'next/link';

const posts = [
  { slug: 'nextjs-basics', title: 'Next.js の基本' },
  { slug: 'supabase-intro', title: 'Supabase 入門' },
  { slug: 'tailwind-tips', title: 'Tailwind CSS のコツ' },
];

export default function BlogPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">ブログ</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:underline text-lg"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}