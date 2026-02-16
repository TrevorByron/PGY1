"use client";

import Link from "next/link";
import type { Metadata } from "next";

const FILLOUT_FORM_ID = "YOUR_FILLOUT_FORM_ID";

export default function QuotePage() {
  const filloutUrl = `https://form.fillout.com/t/${FILLOUT_FORM_ID}`;

  return (
    <main className="min-h-screen bg-dark-bg">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <Link href="/" className="text-sm font-medium text-dark-muted hover:text-dark-fg">
          ← Back to home
        </Link>
        <div className="mx-auto mt-8 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-dark-fg sm:text-5xl">
              Get your disability insurance quote
            </h1>
            <div className="mx-auto mt-6 max-w-3xl space-y-4 text-lg text-dark-muted">
              <p>
                Please take 2 mins to answer a few basic questions to receive your disability insurance quotes.
              </p>
              <p className="text-base text-dark-muted-subtle">
                Please note this is purely information and not a formal application.
              </p>
              <p className="flex items-center justify-center gap-2 font-medium text-dark-fg">
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Your privacy is our priority — we will never share or sell your information.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          {FILLOUT_FORM_ID === "YOUR_FILLOUT_FORM_ID" ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-section-muted p-8 text-center">
              <p className="font-medium text-muted">
                Fillout form will appear here
              </p>
              <p className="mt-2 text-sm text-muted-subtle">
                Add your Fillout form ID in <code className="rounded bg-border px-1.5 py-0.5">src/app/quote/page.tsx</code> (FILLOUT_FORM_ID), or replace this block with your Fillout embed code.
              </p>
              <a
                href="https://www.fillout.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm font-medium text-foreground underline"
              >
                Get a Fillout form →
              </a>
            </div>
          ) : (
            <iframe
              title="Get your quote"
              src={filloutUrl}
              className="h-[600px] w-full rounded-xl border-0"
            />
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-dark-muted">
              Questions? Text or call <a href="tel:6094328862" className="font-medium text-dark-fg underline hover:no-underline">(609) 432-8862</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
