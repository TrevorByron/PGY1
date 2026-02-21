"use client";

import { useState } from "react";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://pgy1.com";
const REFER_URL = `${BASE_URL}/quote`;

function generateInviteCode(name: string): string {
  const clean = name.trim().toUpperCase().replace(/\s+/g, "");
  const prefix = clean.slice(0, 4) || "PGY1";
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PGY1-${prefix}-${random}`;
}

export default function ReferContent() {
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = inviteCode ? `${REFER_URL}?ref=${encodeURIComponent(inviteCode)}` : REFER_URL;

  const handleGetCode = () => {
    if (name.trim()) setInviteCode(generateInviteCode(name));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const shareOnTwitter = () => {
    const text = "I got my disability insurance quote through PGY-1 — simple and no pressure. Residents & fellows: get yours in 2 mins.";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="mt-10 space-y-10">
      <section className="rounded-xl border border-border bg-section-muted p-6">
        <h2 className="text-xl font-semibold text-foreground">
          Get your invite code
        </h2>
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-foreground">1. Enter your name</p>
            <input
              id="refer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Your name"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">2. Generate your personal code</p>
            <button
              type="button"
              onClick={handleGetCode}
              disabled={!name.trim()}
              className="mt-1 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition hover:bg-accent-hover disabled:opacity-50 disabled:pointer-events-none"
            >
              Generate my personalized code
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">3. Your invite code</p>
            {inviteCode ? (
              <code className="mt-1 inline-block rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-foreground">
                {inviteCode}
              </code>
            ) : (
              <p className="mt-1 text-sm text-muted">Your code will appear here after step 2.</p>
            )}
          </div>
        </div>
      </section>

      <p className="text-muted">
        Or have them include your email when completing their intake form.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-foreground">Share your link</h2>
        <p className="mt-1 text-sm text-muted">
          Send your referral link so friends can get a quote and you get credit.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            {copied ? (
              "Copied!"
            ) : (
              <>
                <CopyIcon className="h-4 w-4" />
                Copy link
              </>
            )}
          </button>
          <button
            type="button"
            onClick={shareOnTwitter}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            <TwitterIcon className="h-4 w-4" />
            Share on X
          </button>
          <button
            type="button"
            onClick={shareOnLinkedIn}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            <LinkedInIcon className="h-4 w-4" />
            Share on LinkedIn
          </button>
          <button
            type="button"
            onClick={shareOnFacebook}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            <FacebookIcon className="h-4 w-4" />
            Share on Facebook
          </button>
        </div>
      </section>
    </div>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
