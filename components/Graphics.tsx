import Reveal from "@/components/Reveal";

const BASE = "/clay-portfolio";

const graphics = [
  {
    src: `${BASE}/images/graphics/ucla-champlin.jpg`,
    alt: "Ethan Champlin UCLA volleyball poster",
    label: "UCLA Volleyball",
  },
  {
    src: `${BASE}/images/graphics/usa-vs-bgr.png`,
    alt: "USA vs BGR volleyball match poster",
    label: "USA vs BGR",
  },
  {
    src: `${BASE}/images/graphics/porsche-gt3rs.jpg`,
    alt: "Porsche GT3 RS poster",
    label: "Porsche GT3 RS",
  },
  {
    src: `${BASE}/images/graphics/audi-rs6.png`,
    alt: "Audi RS6 Avant poster",
    label: "Audi RS6 Avant",
  },
];

export default function Graphics() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Personal Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Made for{" "}
            <span className="font-[family-name:var(--font-serif)] italic font-normal" style={{ color: "var(--accent)" }}>
              fun.
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mb-12">
            Posters and graphics I've made outside of class — just exploring
            Photoshop and Illustrator for the love of it.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {graphics.map((g, i) => (
            <Reveal key={g.label} delay={i * 80}>
              <div className="group relative overflow-hidden rounded-2xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.alt}
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {g.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
