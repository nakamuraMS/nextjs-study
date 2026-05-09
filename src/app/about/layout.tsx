export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* about系ページだけに出るサイドバー */}
      <aside className="w-48 border-r p-4">
        <nav className="space-y-2">
          <a href="/about" className="block hover:text-blue-600">概要</a>
          <a href="/about/team" className="block hover:text-blue-600">チーム</a>
          <a href="/about/history" className="block hover:text-blue-600">沿革</a>
        </nav>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}