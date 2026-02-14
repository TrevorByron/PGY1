import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const POSTS: Record<
  string,
  { title: string; date: string; excerpt: string; body: string }
> = {
  "when-to-get-disability-insurance": {
    title: "When should residents get disability insurance?",
    date: "2025-01-15",
    excerpt: "The best time is early in training.",
    body: "The best time to get disability insurance as a physician is early in training — during residency or fellowship. Locking in a GSI policy (if available at your program) and favorable rates when you're young and healthy protects you if your health changes later. Waiting can mean higher premiums or loss of GSI eligibility after a denial elsewhere. We recommend getting your quote in about a minute so you know your options.",
  },
  "gsi-vs-fully-underwritten": {
    title: "GSI vs. fully underwritten: what's the difference?",
    date: "2025-01-08",
    excerpt: "Why securing GSI first can protect your options.",
    body: "GSI (Guaranteed Standard Issue) policies require no medical exam and typically overlook pre-existing conditions. They're often available only to residents and fellows at select institutions. Fully underwritten policies involve health questions and sometimes a paramed exam; they can offer higher benefits but a denial can disqualify you from GSI. So if GSI is available to you, secure it first — then consider additional coverage if needed.",
  },
  "own-occupation-explained": {
    title: "Why own-occupation matters for physicians",
    date: "2024-12-20",
    excerpt: "What it means and why it's the standard you want.",
    body: "Own-occupation means you're disabled if you can't perform the duties of your specific medical specialty — not just any job. For physicians, this is the standard you want: if you can't do your specialty (e.g. surgery, anesthesia), your policy pays even if you could do other work. We only recommend policies with true own-occupation definitions.",
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
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-sm font-medium text-muted hover:text-foreground">
          ← Back to blog
        </Link>
        <article className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {post.title}
          </h1>
          <p className="mt-2 text-muted-subtle">{post.date}</p>
          <div className="mt-8 text-muted [&>p]:mt-4">
            <p>{post.body}</p>
          </div>
        </article>
        <div className="mt-12 rounded-2xl bg-section-muted p-8">
          <a
            href="/#get-quote"
            className="inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-fg transition hover:bg-accent-hover"
          >
            Get your quote — 1 min, 100% private
          </a>
        </div>
      </div>
    </main>
  );
}
