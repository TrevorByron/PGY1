"use client";

import Image from "next/image";

const TESTIMONIALS = [
  {
    quote:
      "Jay made the process simple and answered every question. I locked in my GSI during residency and now I have peace of mind.",
    name: "Sarah M.",
    title: "Resident, Internal Medicine",
  },
  {
    quote:
      "I was worried about my medical history. He explained my options clearly and helped me get coverage without the stress I expected.",
    name: "David K.",
    title: "Fellow, Cardiology",
  },
  {
    quote:
      "Not a big firm — just someone who actually picks up the phone. That mattered a lot during a busy rotation.",
    name: "Jennifer L.",
    title: "Resident, Pediatrics",
  },
];

const HOSPITAL_LOGOS: { src: string; alt: string }[] = [
  { src: "johns-hopkins.png", alt: "Johns Hopkins Medicine" },
  { src: "mgh.png", alt: "Massachusetts General Hospital" },
  { src: "nyp.png", alt: "NewYork-Presbyterian" },
  { src: "cleveland-clinic.png", alt: "Cleveland Clinic" },
  { src: "cedars-sinai.png", alt: "Cedars Sinai Health System" },
];

export default function SocialProof() {
  return (
    <section id="testimonials" className="bg-section py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">5+</p>
            <p className="mt-1 text-sm text-muted">Carriers we work with</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">Years</p>
            <p className="mt-1 text-sm text-muted">Years helping physicians</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">GSI</p>
            <p className="mt-1 text-sm text-muted">Available at select programs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">50</p>
            <p className="mt-1 text-sm text-muted">States licensed</p>
          </div>
        </div>

        {/* What physicians say */}
        <div className="mt-16 border-t border-border pt-16">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            What physicians say
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={i}
                className="rounded-xl border border-border bg-section-muted p-6"
              >
                <p className="text-muted">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted">{t.title}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Trusted by */}
        <div className="mt-16 border-t border-border pt-16">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-subtle">
            Trusted by residents and fellows at
          </h3>
          {HOSPITAL_LOGOS.length > 0 ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-12 sm:gap-16">
              {HOSPITAL_LOGOS.map((logo) => {
                const src = `/hospitals/${logo.src}`;
                const isSvg = logo.src.endsWith(".svg");
                return (
                  <div
                    key={logo.src}
                    className="relative flex h-16 w-36 items-center justify-center sm:h-20 sm:w-40"
                  >
                    {isSvg ? (
                      <img
                        src={src}
                        alt={logo.alt}
                        className="max-h-16 w-auto max-w-[9rem] object-contain object-center sm:max-h-20 sm:max-w-[10rem]"
                      />
                    ) : (
                      <Image
                        src={src}
                        alt={logo.alt}
                        width={160}
                        height={80}
                        className="max-h-16 w-auto max-w-[9rem] object-contain object-center sm:max-h-20 sm:max-w-[10rem]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-6 py-3">
                <svg
                  className="h-8 w-8 shrink-0 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="text-sm font-medium text-muted">
                  Select institutions nationwide
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
