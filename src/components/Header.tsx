"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const PHONE = "6094328862";
const PHONE_DISPLAY = "(609) 432-8862";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-foreground">
            PGY1
          </span>
          <span className="hidden text-sm font-medium text-muted sm:inline">
            Financial Solutions
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/disability-101"
            className="text-sm text-muted hover:text-foreground"
          >
            Disability Insurance 101
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="text-sm text-muted hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/testimonials"
            className="text-sm text-muted hover:text-foreground"
          >
            Testimonials
          </Link>
          <Link
            href="/quote"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile/Tablet: CTA Button and Menu Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/quote"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
          >
            Get a Quote
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-surface lg:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <div className="flex flex-col space-y-3">
              <Link
                href="/disability-101"
                className="rounded-md px-3 py-2 text-base font-medium text-muted hover:bg-surface-muted hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Disability Insurance 101
              </Link>
              <Link
                href="/about"
                className="rounded-md px-3 py-2 text-base font-medium text-muted hover:bg-surface-muted hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className="rounded-md px-3 py-2 text-base font-medium text-muted hover:bg-surface-muted hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/testimonials"
                className="rounded-md px-3 py-2 text-base font-medium text-muted hover:bg-surface-muted hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
