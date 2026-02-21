import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BottomCTASection from "@/components/BottomCTASection";

export const metadata: Metadata = {
  title: "About PGY1 | PGY1 Financial Solutions",
  description:
    "PGY1 Financial Solutions helps residents and fellows secure disability insurance. Jay Weinberg, CLU ChFC, with 20+ years of experience, works with top carriers including Guardian, Mass Mutual, Principal, Ameritas, and The Standard to find the right GSI and own-occupation coverage for your specialty.",
  openGraph: {
    title: "About PGY1 Financial Solutions",
    description:
      "Learn how PGY1 Financial Solutions helps residents and fellows secure disability insurance with specialized knowledge and top carriers.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-section">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10 sm:pb-28 lg:px-8">
        <Link href="/" className="text-sm font-medium text-muted hover:text-foreground">
          ← Back to home
        </Link>
        <div className="mt-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About PGY1 Financial Solutions
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              PGY1 Financial Solutions helps residents and fellows secure disability insurance coverage that protects their income and future. We work with top carriers to compare quotes and find the best fit for your specialty and stage of training.
            </p>
            
            <div className="mt-8 flex items-start gap-4 rounded-xl border border-border bg-section-muted p-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-border sm:h-24 sm:w-24">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe6axk5d3VT-TuaGqMsbe7wkL8iTgjVlHpw&s"
                  alt="Jay Weinberg, CLU, ChFC"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">Jay Weinberg, CLU, ChFC</h2>
                <p className="mt-2 text-muted">
                  Jay connects disability insurance to doctors — especially residents and fellows — so you can protect your income before it&apos;s too late. With over 20 years of experience helping physicians, Jay provides direct access, clear answers, and a process that fits your schedule.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-foreground">How we work</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">We work with top carriers</h3>
                  <p className="mt-1 text-muted">
                    We partner with leading disability insurance carriers including Guardian, Mass Mutual, Principal, Ameritas, and The Standard. This allows us to compare multiple quotes and find the best fit for your situation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Specialized knowledge for physicians</h3>
                  <p className="mt-1 text-muted">
                    We understand the unique needs of residents, fellows, and attending physicians. We help you secure GSI (Guaranteed Standard Issue) policies when available at your program, and we only recommend policies with true own-occupation definitions.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Simple, straightforward process</h3>
                  <p className="mt-1 text-muted">
                    Getting your quote takes about 2 minutes. We handle the paperwork and answer your questions in plain language. Our goal is to help you secure the right coverage without the runaround.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomCTASection />
    </main>
  );
}
