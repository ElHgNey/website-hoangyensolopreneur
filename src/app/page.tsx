import Navbar from "@/components/Navbar";

const EXPERTISE = [
  {
    icon: "architecture",
    title: "Enterprise AI Strategy",
    description:
      "Deploying scalable AI architectures to streamline operations, enhance data-driven decision making, and future-proof organizational capabilities.",
    deliverables: ["Process Automation Audits", "AI Readiness Roadmaps"],
  },
  {
    icon: "model_training",
    title: "Executive Excellence",
    description:
      "Advanced leadership training utilizing Neuro-Linguistic Programming to align executive mindsets with strategic corporate objectives.",
    deliverables: ["C-Suite Coaching Programs", "Cultural Transformation"],
  },
  {
    icon: "trending_up",
    title: "Corporate Growth",
    description:
      "Architecting robust digital business ecosystems that drive revenue growth, solidify market positioning, and ensure B2B synergy.",
    deliverables: ["Digital Brand Valuation", "B2B Partnership Strategy"],
  },
];

const IMPACT = [
  {
    heading: "Cross-Border Integration",
    company: "Ikigai Corporation Japan",
    description:
      "Spearheaded the integration of AI-driven evaluation models for M&A targets, reducing due diligence cycles and optimizing real estate & hospitality portfolios across Asian markets.",
  },
  {
    heading: "Brand Revitalization",
    company: "Phyt’s Việt Nam",
    description:
      "Engineered a comprehensive B2B distribution strategy and digital brand repositioning, significantly expanding market share in the premium organic skincare sector.",
  },
  {
    heading: "Operational Scaling",
    company: "Kyndle.sg & Tech Guys Viet Nam",
    description:
      "Directed regional digital connectivity initiatives and enterprise IT solutions, streamlining E-commerce channel management for global enterprise clients.",
  },
];

const CREDENTIALS = [
  {
    label: "Executive Certification",
    title: "ACCA Chartered Certified Accountant",
    description:
      "Global professional accounting body ensuring rigorous financial oversight capabilities.",
  },
  {
    label: "Academic Foundation",
    title: "Oxford Brookes University",
    description: "Honours Degree in Applied Accounting.",
  },
  {
    label: "Core Discipline",
    title: "University Of Economics HCMC",
    description:
      "Bachelor’s in Accounting and Finance, establishing a robust analytical framework.",
  },
];

const CAREER = [
  {
    date: "Mar 2026 – Present",
    title: "Chief AI Transformation Officer",
    company: "Ikigai Corporation Japan",
    description:
      "A cross-border investment company bridging Japan and global markets. Services include M&A, Real Estate & Hospitality, Fintech Innovation, and more.",
    current: true,
  },
  {
    date: "Apr 2025 – Present",
    title: "Brand Director",
    company: "Phyt’s Việt Nam",
    description:
      "Highlighting the blend of nature and science in premium organic skincare since 1972.",
    current: true,
  },
  {
    date: "Oct 2021 – Jul 2026",
    title: "Director",
    company: "Kyndle.sg",
    description:
      "Focusing on seamless digital connectivity and regional E-commerce channel management.",
    current: false,
  },
  {
    date: "Aug 2018 – Sep 2021",
    title: "Deputy Director",
    company: "Tech Guys Viet Nam",
    description:
      "Emphasizing professional IT solutions for global businesses.",
    current: false,
  },
  {
    date: "Jan 2015 – Jun 2017",
    title: "General Accountant / Chartered Accountant",
    company: "Ve Marine Services Pte Ltd",
    description:
      "Detailed responsibilities including tax computation, payroll, and financial reporting.",
    current: false,
  },
  {
    date: "Jan 2013 – Dec 2014",
    title: "Accountant",
    company: "Vanguard Energy Pte Ltd",
    description:
      "Focusing on invoicing, cash flow management, and audit liaison.",
    current: false,
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section
          id="about"
          className="hero-gradient relative flex min-h-[85vh] items-center overflow-hidden"
        >
          <div className="mx-auto grid max-w-[1280px] items-center gap-16 px-5 py-20 md:grid-cols-2 md:px-16">
            <div className="z-10">
              <span className="mb-6 block font-grotesk text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Executive Strategy &amp; AI Integration
              </span>
              <h1 className="mb-8 font-grotesk text-[36px] font-extrabold leading-[1.1] tracking-[-0.02em] text-onyx md:text-[64px]">
                Transforming <br />
                <span className="text-onyx/80">Corporate Potential.</span>
              </h1>
              <p className="mb-12 max-w-lg text-xl leading-relaxed text-muted">
                Delivering high-level strategic oversight and measurable B2B
                outcomes through the precise application of Artificial
                Intelligence, organizational restructuring, and executive
                coaching.
              </p>
              <button className="bg-onyx px-10 py-4 font-grotesk text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-emerald active:scale-95">
                Explore Capabilities
              </button>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative aspect-[4/5] w-full max-w-[550px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full rounded-sm border border-subtle/20 object-cover shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdwohThHj2HekwRaXyYc2vrtlDSuBipmweGGl7n6Dsd3smZIA9oViyBtZusanMkmMmcyyNdG8u9Hcr3eOQvDJz8zJnprq45iXzqt1YZlYC1wl6kKusearjzVwd9YH137dsMmfPdzaLBFa3DodMtzuR200JHHRtO1v85K2iTC4ONtc2V7Y2lJ2GOAEkDkZQEgnLbbTcVcTY5CeDaPDivrQQFESNc_PaCYZpIZ9u7RfJHVPlkoVy8HyINiuPn1gXxQfbVg"
                  alt="Michelle Le (Hoàng Yến)"
                />
                <div className="absolute -bottom-8 -left-8 hidden border border-subtle/20 bg-paper p-8 shadow-lg lg:block">
                  <p className="font-grotesk text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-onyx md:text-[48px]">
                    C-Suite
                  </p>
                  <p className="font-grotesk text-sm font-semibold uppercase tracking-wider text-muted">
                    Advisory Level
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section id="expertise" className="bg-paper py-20">
          <div className="mx-auto max-w-[1280px] px-5 md:px-16">
            <div className="mb-20 max-w-3xl">
              <span className="mb-4 block font-grotesk text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Practice Areas
              </span>
              <h2 className="mb-6 font-grotesk text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-onyx md:text-[48px]">
                Solutions for Organizations
              </h2>
              <p className="text-xl leading-relaxed text-muted">
                Comprehensive frameworks designed for enterprise scale, focusing
                on operational efficiency, leadership excellence, and sustained
                market advantage.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {EXPERTISE.map((item) => (
                <div
                  key={item.title}
                  className="bento-card flex h-auto min-h-[400px] flex-col justify-between p-8 md:h-[450px] md:p-12"
                >
                  <div>
                    <span
                      className="material-symbols-outlined mb-8 text-4xl text-onyx"
                      style={{ fontVariationSettings: "'wght' 300" }}
                    >
                      {item.icon}
                    </span>
                    <h3 className="mb-4 font-grotesk text-2xl font-semibold text-onyx">
                      {item.title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                  <div className="border-t border-subtle/20 pt-6">
                    <p className="mb-2 font-grotesk text-sm font-semibold uppercase tracking-wider text-onyx">
                      Key Deliverables
                    </p>
                    <ul className="space-y-2 text-base text-muted">
                      {item.deliverables.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strategic Impact */}
        <section id="impact" className="overflow-hidden py-20">
          <div className="mx-auto max-w-[1280px] px-5 md:px-16">
            <div className="mb-20 max-w-3xl">
              <span className="mb-4 block font-grotesk text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Proven Outcomes
              </span>
              <h2 className="mb-6 font-grotesk text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-onyx md:text-[48px]">
                Strategic Impact
              </h2>
              <p className="text-xl leading-relaxed text-muted">
                Demonstrated success in guiding global organizations through
                complex transformations and scaling operations across
                international markets.
              </p>
            </div>
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                {IMPACT.map((item) => (
                  <div key={item.heading} className="stat-card py-2 pl-8">
                    <p className="mb-2 font-grotesk text-[24px] font-bold leading-[1.2] tracking-[-0.01em] text-onyx md:text-[48px]">
                      {item.heading}
                    </p>
                    <p className="mb-2 text-xl font-semibold text-onyx">
                      {item.company}
                    </p>
                    <p className="text-base text-muted">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center border border-subtle/20 bg-paper p-8 shadow-sm md:p-12">
                <h3 className="mb-8 border-b border-subtle/20 pb-4 font-grotesk text-2xl font-semibold text-onyx">
                  Professional Credentials
                </h3>
                <div className="space-y-8">
                  {CREDENTIALS.map((cred) => (
                    <div key={cred.title}>
                      <h4 className="mb-2 font-grotesk text-sm font-semibold uppercase tracking-wider text-muted">
                        {cred.label}
                      </h4>
                      <p className="text-xl text-onyx">{cred.title}</p>
                      <p className="mt-1 text-base text-muted">
                        {cred.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Journey */}
        <section id="career-journey" className="overflow-hidden py-20">
          <div className="mx-auto max-w-[1280px] px-5 md:px-16">
            <div className="mb-20 max-w-3xl">
              <span className="mb-4 block font-grotesk text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Professional Evolution
              </span>
              <h2 className="mb-6 font-grotesk text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-onyx md:text-[48px]">
                Career Journey
              </h2>
              <p className="text-xl italic leading-relaxed text-muted">
                From a sharp financial expert to a pioneering strategic
                technology leader.
              </p>
            </div>
            <div className="relative ml-4 space-y-12 border-l-2 border-subtle/20 pl-8">
              {CAREER.map((job) => (
                <div key={job.date} className="relative">
                  <div
                    className={`absolute -left-[41px] top-2 z-10 h-4 w-4 rounded-full border-4 border-slate-bg ${
                      job.current ? "bg-onyx" : "bg-subtle"
                    }`}
                  />
                  <span className="mb-2 block font-grotesk text-sm font-semibold uppercase tracking-widest text-muted">
                    {job.date}
                  </span>
                  <h3 className="font-grotesk text-2xl font-semibold text-onyx">
                    {job.title}
                  </h3>
                  <p className="mb-2 text-xl font-semibold italic leading-tight text-onyx">
                    {job.company}
                  </p>
                  <p className="text-base text-muted">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / CTA */}
        <section
          id="contact"
          className="border-t border-subtle/20 bg-paper py-20"
        >
          <div className="mx-auto max-w-[1280px] px-5 text-center md:px-16">
            <h2 className="mx-auto mb-10 max-w-4xl font-grotesk text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-onyx md:text-[64px]">
              &ldquo;The most effective way to secure market leadership is to{" "}
              <span className="italic text-muted">architect it</span> from
              within.&rdquo;
            </h2>
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <button className="bg-onyx px-12 py-5 font-grotesk text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-emerald active:scale-95">
                Initiate Dialogue
              </button>
              <a
                href="#"
                className="flex items-center gap-2 font-grotesk text-sm font-semibold uppercase tracking-widest text-onyx transition-colors hover:text-muted"
              >
                Request Corporate Brief
                <span className="material-symbols-outlined text-sm">
                  north_east
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-subtle/20 py-16">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-5 md:flex-row md:justify-between md:px-16">
          <div className="font-grotesk text-2xl font-bold text-onyx">
            Michelle Le (Hoàng Yến)
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="#"
              className="text-base text-muted transition-colors hover:text-onyx"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-base text-muted transition-colors hover:text-onyx"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-base text-muted transition-colors hover:text-onyx"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-base text-muted transition-colors hover:text-onyx"
            >
              Medium
            </a>
          </div>
          <div className="text-base text-muted/80">
            &copy; 2026 Michelle Le (Hoàng Yến). Executive Strategy &amp; AI
            Integration.
          </div>
        </div>
      </footer>
    </>
  );
}
