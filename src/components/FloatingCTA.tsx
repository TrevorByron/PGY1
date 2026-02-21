"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Floating CTA Component
 * Shows a sticky "Get Quote" button after user scrolls past hero section
 * Mobile-optimized with dismissible option
 */
export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed it before (stored in sessionStorage)
    const dismissed = sessionStorage.getItem("floating-cta-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Show after scrolling 400px (past hero section)
      const scrollY = window.scrollY || window.pageYOffset;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("floating-cta-dismissed", "true");
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 sm:bottom-6 sm:right-6">
      <div className="relative flex items-center gap-2 rounded-full bg-cta-primary-bg px-4 py-3 shadow-lg ring-1 ring-border sm:px-6">
        <Link
          href="/quote"
          className="text-sm font-semibold text-cta-primary-fg sm:text-base"
          onClick={() => {
            // Track CTA click
            if (typeof window !== "undefined" && (window as any).gtag) {
              (window as any).gtag("event", "cta_click", {
                cta_location: "floating_button",
              });
            }
          }}
        >
          Get Quote
        </Link>
        <button
          onClick={handleDismiss}
          className="ml-2 rounded-full p-1 text-cta-primary-fg/70 hover:bg-cta-primary-fg/10 hover:text-cta-primary-fg focus:outline-none focus:ring-2 focus:ring-cta-primary-fg/50"
          aria-label="Dismiss"
        >
          <svg
            className="h-4 w-4"
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
        </button>
      </div>
    </div>
  );
}
