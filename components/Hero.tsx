export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">
      <div className="max-w-5xl mx-auto w-full pt-24 pb-16">
        <div className="inline-flex items-center gap-2 text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          Available for opportunities
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          Hi, I'm Clay Martin.
          <br />
          <span className="text-indigo-600">UX & Product Designer.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10">
          I turn real problems into clearer, more usable experiences — using
          research, usability testing, and visual design to find where people
          get stuck and redesign flows that move them forward.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors text-sm"
          >
            View my work
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-full font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm"
          >
            Contact me
          </a>
        </div>

        {/* Quick stats */}
        <div className="mt-16 pt-10 border-t border-slate-200 flex flex-wrap gap-8 sm:gap-16">
          {[
            { value: "5+", label: "Case Studies" },
            { value: "2+", label: "Years Experience" },
            { value: "ICP", label: "Agile Certified" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
