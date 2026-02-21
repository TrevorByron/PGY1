import type { Metadata } from "next";
import Link from "next/link";
import BottomCTASection from "@/components/BottomCTASection";
import ReferContent from "./ReferContent";

export const metadata: Metadata = {
  title: "Refer Friends | PGY1 Financial Solutions",
  description:
    "Earn $100 for every resident or fellow you refer who gets a policy with PGY-1. We pay you, not pay-to-play communities. Get your invite code and share with peers.",
  openGraph: {
    title: "Refer Friends | PGY1 Financial Solutions",
    description:
      "Earn $100 per referral. Get your invite code and share PGY-1 with fellow residents and fellows.",
  },
};

export default function ReferPage() {
  return (
    <main className="min-h-screen bg-section">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10 sm:pb-28 lg:px-8">
        <Link href="/" className="text-sm font-medium text-muted hover:text-foreground">
          ← Back to home
        </Link>
        <div className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Refer friends
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Instead of pay-to-play deals on other MD communities (WCI, PSG), we pay the residents
            themselves for helping us spread the word. If you had a great experience with PGY-1,
            we&apos;d appreciate if you&apos;d share with your peers — we&apos;ll pay you $100 for
            any other resident or fellow who initiates a policy with PGY-1. It&apos;s that easy.
          </p>

          <ReferContent />
        </div>
      </div>
      <BottomCTASection />
    </main>
  );
}
