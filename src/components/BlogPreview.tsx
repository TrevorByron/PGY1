"use client";

import Link from "next/link";
import { useStyle } from "./StyleProvider";
import Style2Illustration from "./Style2Illustration";

const STUB_POSTS = [
  {
    slug: "when-to-get-disability-insurance",
    title: "When should residents get disability insurance?",
    excerpt: "The best time is early in training — before your health or eligibility changes.",
    date: "2025-01-15",
  },
  {
    slug: "gsi-vs-fully-underwritten",
    title: "GSI vs. fully underwritten: what's the difference?",
    excerpt: "Why securing GSI first can protect your options.",
    date: "2025-01-08",
  },
  {
    slug: "own-occupation-explained",
    title: "Why own-occupation matters for physicians",
    excerpt: "What it means and why it's the standard you want.",
    date: "2024-12-20",
  },
];

export default function BlogPreview() {
  const { style } = useStyle();

  if (style === "2") {
    return (
      <section className="bg-section-muted py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
            <div className="flex flex-1 justify-center lg:sticky lg:top-24 lg:max-w-xs">
              <Style2Illustration
                id="medical-prescription"
                className="h-auto max-h-[300px] w-full object-contain"
              />
            </div>
            <div className="flex-[2]">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Blog
              </h2>
              <p className="mt-4 text-lg text-muted">
                Practical guidance on disability insurance for physicians.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {STUB_POSTS.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-muted hover:shadow"
                  >
                    <h3 className="font-semibold text-foreground group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                    <p className="mt-3 text-xs text-muted-subtle">{post.date}</p>
                  </Link>
                ))}
              </div>
              <p className="mt-10">
                <Link
                  href="/blog"
                  className="font-medium text-foreground underline hover:no-underline"
                >
                  View all posts →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-section-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Blog
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted">
          Practical guidance on disability insurance for physicians.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {STUB_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-muted hover:shadow"
            >
              <h3 className="font-semibold text-foreground group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              <p className="mt-3 text-xs text-muted-subtle">{post.date}</p>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/blog"
            className="font-medium text-foreground underline hover:no-underline"
          >
            View all posts →
          </Link>
        </p>
      </div>
    </section>
  );
}
