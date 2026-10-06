import { Link } from "react-router";

const features = [
  {
    number: "01",
    title: "Budget Control",
    description:
      "Set your grocery budget and keep track of how much you have already used.",
    icon: "₱",
  },
  {
    number: "02",
    title: "Spending Analysis",
    description:
      "Understand where your grocery money goes through category and spending analysis.",
    icon: "↗",
  },
  {
    number: "03",
    title: "Smart Insights",
    description:
      "Turn your spending data into useful insights that help you make better decisions.",
    icon: "✦",
  },
];

const stats = [
  {
    value: "₱15K",
    label: "Sample monthly budget",
  },
  {
    value: "57.5%",
    label: "Budget usage",
  },
  {
    value: "₱6.3K",
    label: "Budget remaining",
  },
];

const categories = [
  { name: "Meat & Poultry", percentage: 28 },
  { name: "Rice & Grains", percentage: 20 },
  { name: "Vegetables", percentage: 15 },
  { name: "Dairy", percentage: 14 },
];

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8faf8] text-slate-900">
      {/* =========================================
          NAVBAR
      ========================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm">
              S
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">
                Smart Grocery
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
                Budget Analyzer
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Features
            </a>

            <a
              href="#analytics"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Analytics
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              How it works
            </a>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      {/* =========================================
          HERO
      ========================================== */}
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="absolute -right-32 top-12 h-80 w-80 rounded-full bg-lime-100/70 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
            {/* Hero text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Smarter grocery decisions
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
                Spend smarter on every{" "}
                <span className="text-emerald-600">grocery trip.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Smart Grocery helps you manage your grocery budget, record
                purchases, understand spending patterns, and turn your data
                into useful insights.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Explore Dashboard
                  <span className="ml-2">→</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  See how it works
                </a>
              </div>

              {/* Trust line */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-400">
                <span>Budget tracking</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                <span>Spending analytics</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                <span>Smart insights</span>
              </div>
            </div>

            {/* Hero dashboard preview */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-emerald-100/50 blur-2xl" />

              <div className="relative rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-5">
                {/* Window bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  </div>

                  <div className="rounded-lg bg-slate-50 px-3 py-1 text-[10px] font-semibold text-slate-400">
                    Smart Grocery
                  </div>
                </div>

                {/* Preview header */}
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                      Overview
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      October spending
                    </h2>
                  </div>

                  <div className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                    On Track
                  </div>
                </div>

                {/* Preview cards */}
                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[9px] font-medium text-slate-400">
                      Budget
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      ₱15K
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-[9px] font-medium text-emerald-600">
                      Spent
                    </p>
                    <p className="mt-1 text-sm font-bold text-emerald-800">
                      ₱8.6K
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[9px] font-medium text-slate-400">
                      Remaining
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      ₱6.3K
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5 rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500">
                      Budget usage
                    </span>
                    <span className="text-[10px] font-bold text-slate-900">
                      57.5%
                    </span>
                  </div>

                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[57.5%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Mini chart */}
                <div className="mt-4 rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500">
                      Weekly spending
                    </span>
                    <span className="text-[9px] text-slate-400">
                      Current month
                    </span>
                  </div>

                  <div className="mt-5 flex h-28 items-end gap-2">
                    <div className="h-[48%] flex-1 rounded-t-lg bg-emerald-100" />
                    <div className="h-[64%] flex-1 rounded-t-lg bg-emerald-200" />
                    <div className="h-[55%] flex-1 rounded-t-lg bg-emerald-300" />
                    <div className="h-[76%] flex-1 rounded-t-lg bg-emerald-400" />
                    <div className="h-[63%] flex-1 rounded-t-lg bg-emerald-500" />
                    <div className="h-[84%] flex-1 rounded-t-lg bg-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            STATS
        ========================================== */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 px-0 py-6 sm:px-6 sm:py-8 lg:px-10"
              >
                <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {stat.value}
                </p>

                <p className="max-w-32 text-xs leading-5 text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            FEATURES
        ========================================== */}
        <section id="features" className="scroll-mt-24 bg-[#f8faf8]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">
                Why Smart Grocery
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                More than a grocery expense tracker.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                Your grocery records become useful information you can
                actually act on.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.number}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-600">
                      {feature.icon}
                    </div>

                    <span className="text-xs font-bold tracking-widest text-slate-300">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            HOW IT WORKS
        ========================================== */}
        <section id="how-it-works" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">
                  How it works
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Record. Understand. Improve.
                </h2>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  Smart Grocery transforms simple purchase records into
                  calculations, comparisons, and useful spending insights.
                </p>

                <Link
                  to="/dashboard"
                  className="mt-7 inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Start exploring
                  <span className="ml-2">→</span>
                </Link>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    step: "01",
                    title: "Set your budget",
                    text: "Define how much you want to spend on groceries for the month.",
                  },
                  {
                    step: "02",
                    title: "Record your purchases",
                    text: "Keep track of the products, quantities, prices, stores, and purchase dates.",
                  },
                  {
                    step: "03",
                    title: "Analyze your spending",
                    text: "View totals, category breakdowns, trends, budget status, and spending insights.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-emerald-600 shadow-sm">
                      {item.step}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            ANALYTICS PREVIEW
        ========================================== */}
        <section id="analytics" className="scroll-mt-24 bg-slate-950">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-400">
                  Data that tells a story
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  See where your grocery money goes.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                  Compare categories, identify your biggest expenses, and
                  understand your spending patterns from one dashboard.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-500">Average weekly</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      ₱2,155
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-500">Top category</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      Meat
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-500">Monthly change</p>
                    <p className="mt-1 text-lg font-bold text-amber-400">
                      +9.0%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Spending breakdown
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-white">
                      Top grocery categories
                    </h3>
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-400">
                    October
                  </span>
                </div>

                <div className="mt-8 space-y-5">
                  {categories.map((category) => (
                    <div key={category.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-300">
                          {category.name}
                        </span>

                        <span className="text-sm font-semibold text-white">
                          {category.percentage}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${category.percentage * 3}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-4 gap-2">
                  <div className="h-16 rounded-xl bg-emerald-100/20" />
                  <div className="h-24 rounded-xl bg-emerald-300/30" />
                  <div className="h-20 rounded-xl bg-emerald-400/40" />
                  <div className="h-28 rounded-xl bg-emerald-500/60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================== */}
        <section className="bg-[#f8faf8]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="overflow-hidden rounded-[2rem] bg-emerald-600 px-6 py-12 text-center shadow-xl shadow-emerald-600/10 sm:px-10 lg:px-16 lg:py-16">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
                Take control of your grocery spending
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Make every grocery budget count.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                Start exploring your grocery budget, purchases, and spending
                analytics in one place.
              </p>

              <Link
                to="/dashboard"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                Open Smart Grocery
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
          FOOTER
      ========================================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold text-white">
              S
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Smart Grocery
              </p>

              <p className="text-xs text-slate-400">
                Budget & Spending Analyzer
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 Smart Grocery. Built for smarter spending.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
