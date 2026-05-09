type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">{slug}</h1>
      <p className="text-gray-600">
        このページのURLパラメータ： <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
      </p>
    </main>
  );
}