import type { Metadata } from "next";
import Link from "next/link";
import BlogImage from "@/components/BlogImage";
import BottomCTASection from "@/components/BottomCTASection";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog | PGY1 Financial Solutions",
  description:
    "Practical guidance on disability insurance for physicians, residents, and fellows. Learn about GSI policies, own-occupation coverage, and when to secure disability insurance.",
  openGraph: {
    title: "Blog | PGY1 Financial Solutions",
    description:
      "Practical guidance on disability insurance for physicians, residents, and fellows.",
  },
};

const STUB_POSTS = [
  {
    slug: "when-to-get-disability-insurance",
    title: "When should residents get disability insurance?",
    excerpt: "The best time is early in training — before your health or eligibility changes.",
    date: "2025-01-15",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=450&fit=crop",
    readTime: "5 min read",
  },
  {
    slug: "gsi-vs-fully-underwritten",
    title: "GSI vs. fully underwritten: what's the difference?",
    excerpt: "Why securing GSI first can protect your options.",
    date: "2025-01-08",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
    readTime: "4 min read",
  },
  {
    slug: "own-occupation-explained",
    title: "Why own-occupation matters for physicians",
    excerpt: "What it means and why it's the standard you want.",
    date: "2024-12-20",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=450&fit=crop",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-section">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10 sm:pb-28 lg:px-8">
        <Link href="/" className="text-sm font-medium text-muted hover:text-foreground">
          ← Back to home
        </Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-3">
          {/* Main content - 2/3 width */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Blog
            </h1>
            <p className="mt-4 text-lg text-muted">
              Practical guidance on disability insurance for physicians.
            </p>
            <ul className="mt-12 space-y-8">
              {STUB_POSTS.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block overflow-hidden rounded-xl border border-border bg-surface transition hover:border-muted hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-border">
                      <BlogImage
                        src={post.image}
                        alt=""
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="font-semibold text-foreground group-hover:underline">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-subtle">
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar - 1/3 width */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-section-muted p-6">
              <h2 className="text-xl font-semibold text-foreground">
                Ready to get a quote?
              </h2>
              <p className="mt-2 text-sm text-muted">
                Take 2 mins to get a quote — 100% private.
              </p>
              <Link
                href="/quote"
                className="mt-4 inline-block w-full rounded-full bg-accent px-6 py-3 text-center font-medium text-accent-fg transition hover:bg-accent-hover"
              >
                Take 2 mins to get a quote
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <BottomCTASection />
    </main>
  );
}
