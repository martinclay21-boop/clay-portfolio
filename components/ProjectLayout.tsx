export default function ProjectLayout({
  title,
  category,
  tags,
  children,
}: {
  title: string;
  category: string;
  tags: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/clay-portfolio/" className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
            ← Clay Martin
          </a>
          <a href="/clay-portfolio/#projects" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            All projects
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">
          {category}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          {title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-slate-100">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
          {children}
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400 border-t border-slate-100">
        © {new Date().getFullYear()} Clay Martin
      </footer>
    </div>
  );
}
