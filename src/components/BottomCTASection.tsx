"use client";

import Link from "next/link";
import Facepile from "./Facepile";

const PHONE = "6094328862";
const PHONE_DISPLAY = "(609) 432-8862";

/**
 * Standard bottom CTA section used across the site (homepage, testimonials, etc.).
 * Same copy as homepage CTA + Facepile.
 */
export default function BottomCTASection() {
  return (
    <section className="bg-dark-bg py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-dark-fg sm:text-3xl">
          Ready?
          <br />
          It only takes 2 mins to get a quote — 100% private
        </h2>
        <p className="mt-3 text-dark-muted">
          100% private · No obligation
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-full bg-cta-primary-bg px-8 py-4 text-base font-semibold text-cta-primary-fg transition hover:bg-cta-primary-hover"
          >
            Take 2 mins to get a quote
          </Link>
        </div>
        <div className="mt-8 flex justify-center">
          <Facepile centered variant="dark" />
        </div>
        <p className="mt-6 text-sm text-dark-muted-subtle">
          Insurance is personal — if you prefer, here&apos;s my mobile number {PHONE_DISPLAY}
        </p>
        <a
          href={`sms:${PHONE}`}
          className="mt-2 inline-block text-sm font-medium text-dark-fg hover:underline"
        >
          Text me — I&apos;ll respond quickly.
        </a>
      </div>
    </section>
  );
}
