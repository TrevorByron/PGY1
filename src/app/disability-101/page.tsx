import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disability Insurance 101 for Physicians | PGY1",
  description:
    "Learn the basics of disability insurance for physicians: own-occupation vs any-occupation, GSI (Guaranteed Standard Issue), and why residents and fellows should secure coverage early. Get your quote in 2 minutes.",
  openGraph: {
    title: "Disability Insurance 101 for Physicians",
    description:
      "A short guide to the basics every physician should know about disability insurance, GSI, and own-occupation coverage.",
  },
};

export default function Disability101Page() {
  return (
    <main className="min-h-screen bg-section">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10 sm:pb-28 lg:px-8">
        <Link href="/" className="text-sm font-medium text-muted hover:text-foreground">
          ← Back to home
        </Link>
        <div className="max-w-3xl" style={{ width: "100%" }}>
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground">
          Disability insurance 101
        </h1>
        <p className="mt-4 text-lg text-muted">
          A short guide to the basics every physician should know.
        </p>

        <article className="prose prose-slate mt-12 max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground">
              What is disability insurance?
            </h2>
            <p className="mt-4 text-muted">
              Disability insurance replaces a portion of your income if you become unable to work due to illness or injury. For physicians, your ability to practice is your biggest asset — disability insurance helps protect it.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground">
              Own-occupation vs. any-occupation
            </h2>
            <p className="mt-4 text-muted">
              <strong>Own-occupation</strong> means you&apos;re considered disabled if you can&apos;t perform the duties of your specific medical specialty. So if you&apos;re a surgeon and can no longer operate but could do non-surgical work, a true own-occupation policy still pays. <strong>Any-occupation</strong> only pays if you can&apos;t work in any job for which you&apos;re trained — a much harder standard. Physicians should insist on own-occupation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground">
              What is GSI (Guaranteed Standard Issue)?
            </h2>
            <p className="mt-4 text-muted">
              GSI policies are offered at many residency and fellowship programs. They require no medical exam and typically don&apos;t ask health questions — so pre-existing conditions and some hazardous activities are overlooked. The catch: if you&apos;ve already been denied disability insurance elsewhere, you may no longer qualify for GSI at your institution. So the best move is to secure GSI first, then consider additional coverage if needed. <Link href="/quote" className="font-medium text-foreground underline hover:no-underline">Get your quote in 2 minutes</Link> to check if GSI is available at your program.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground">
              Why residents and fellows should act now
            </h2>
            <p className="mt-4 text-muted">
              Locking in coverage during training often means better rates and access to GSI. If you wait and your health changes, or you apply for another policy and get denied, you could lose GSI eligibility and pay more later. <Link href="/quote" className="font-medium text-foreground underline hover:no-underline">Getting a quote takes about 2 minutes</Link> — and we never sell your information. Learn more about <Link href="/blog/when-to-get-disability-insurance" className="font-medium text-foreground underline hover:no-underline">when residents should get disability insurance</Link> in our blog.
            </p>
          </section>
        </article>

        <div className="mt-12 rounded-2xl bg-section-muted p-8">
          <h2 className="text-xl font-semibold text-foreground">
            Ready to get started?
          </h2>
          <p className="mt-2 text-muted">
            Take 2 mins to get a quote — 100% private.
          </p>
          <a
            href="/quote"
            className="mt-4 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-fg transition hover:bg-accent-hover"
          >
            Take 2 mins to get a quote
          </a>
        </div>
        </div>
      </div>
    </main>
  );
}
