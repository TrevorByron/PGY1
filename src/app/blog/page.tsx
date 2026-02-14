import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | PGY1 Financial Solutions",
  description:
    "Practical guidance on disability insurance for physicians, residents, and fellows.",
};

const STUB_POSTS = [
  { slug: "when-to-get-disability-insurance", title: "When should residents get disability insurance?", date: "2025-01-15" },
  { slug: "gsi-vs-fully-underwritten", title: "GSI vs. fully underwritten: what's the difference?", date: "2025-01-08" },
  { slug: "own-occupation-explained", title: "Why own-occupation matters for physicians", date: "2024-12-20" },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-section">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-medium text-muted hover:text-foreground">
          ← Back to home
        </Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted">
          Practical guidance on disability insurance for physicians.
        </p>
        <ul className="mt-12 space-y-6">
          {STUB_POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-xl border border-border p-6 transition hover:border-muted hover:bg-section-muted"
              >
                <h2 className="font-semibold text-foreground">{post.title}</h2>
                <p className="mt-1 text-sm text-muted-subtle">{post.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
