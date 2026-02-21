import type { Metadata } from "next";
import Link from "next/link";
import BlogImage from "@/components/BlogImage";
import { notFound } from "next/navigation";
import { formatDate, calculateReadTime } from "@/lib/utils";

const POSTS: Record<
  string,
  { title: string; date: string; excerpt: string; body: string; image: string; readTime: string }
> = {
  "when-to-get-disability-insurance": {
    title: "When should residents get disability insurance?",
    date: "2025-01-15",
    excerpt: "The best time is early in training.",
    body: "The best time to get disability insurance as a physician is early in training — during residency or fellowship. Locking in a GSI policy (if available at your program) and favorable rates when you're young and healthy protects you if your health changes later. Waiting can mean higher premiums or loss of GSI eligibility after a denial elsewhere. We recommend getting your quote in about 2 minutes so you know your options.",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&h=675&fit=crop",
    readTime: "5 min read",
  },
  "gsi-vs-fully-underwritten": {
    title: "GSI vs. fully underwritten: what's the difference?",
    date: "2025-01-08",
    excerpt: "Why securing GSI first can protect your options.",
    body: "GSI (Guaranteed Standard Issue) policies require no medical exam and typically overlook pre-existing conditions. They're often available only to residents and fellows at select institutions. Fully underwritten policies involve health questions and sometimes a paramed exam; they can offer higher benefits but a denial can disqualify you from GSI. So if GSI is available to you, secure it first — then consider additional coverage if needed.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=675&fit=crop",
    readTime: "4 min read",
  },
  "own-occupation-explained": {
    title: "Why own-occupation matters for physicians",
    date: "2024-12-20",
    excerpt: "What it means and why it's the standard you want.",
    body: "Own-occupation means you're disabled if you can't perform the duties of your specific medical specialty — not just any job. For physicians, this is the standard you want: if you can't do your specialty (e.g. surgery, anesthesia), your policy pays even if you could do other work. We only recommend policies with true own-occupation definitions.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&h=675&fit=crop",
    readTime: "6 min read",
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: "Post | PGY1" };
  return {
    title: `${post.title} | PGY1 Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-section">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <Link href="/blog" className="text-sm font-medium text-muted hover:text-foreground">
          ← Back to blog
        </Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-3">
          {/* Main content - 2/3 width */}
          <article className="lg:col-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-subtle">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-border">
              <BlogImage
                src={post.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
            <div className="mt-8 text-lg leading-relaxed text-muted [&>p]:mt-4">
              <p>{post.body}</p>
              <div className="mt-8 rounded-xl border border-border bg-section-muted p-6">
                <p className="font-semibold text-foreground">
                  Ready to get your quote?
                </p>
                <p className="mt-2 text-sm text-muted">
                  Take 2 mins to get a quote — 100% private. No obligation.
                </p>
                <Link
                  href="/quote"
                  className="mt-4 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
                >
                  Get Your Quote →
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar - 1/3 width */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-section-muted p-6">
              <h2 className="text-xl font-semibold text-foreground">
                Get your quote
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
    </main>
  );
}
