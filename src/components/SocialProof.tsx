"use client";

import Image from "next/image";

// Avatar URLs from Facepile component
const AVATARS = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
];

const TESTIMONIALS = [
  {
    quote:
      "Jay made the process simple and answered every question. I locked in my GSI during residency and now I have peace of mind.",
    name: "Sarah M.",
    title: "Resident, Internal Medicine",
    avatar: AVATARS[0],
  },
  {
    quote:
      "I was worried about my medical history. He explained my options clearly and helped me get coverage without the stress I expected.",
    name: "David K.",
    title: "Fellow, Cardiology",
    avatar: AVATARS[1],
  },
  {
    quote:
      "Not a big firm — just someone who actually picks up the phone. That mattered a lot during a busy rotation.",
    name: "Jennifer L.",
    title: "Resident, Pediatrics",
    avatar: AVATARS[2],
  },
];

const HOSPITAL_LOGOS: { src: string; alt: string }[] = [
  { src: "johns-hopkins.png", alt: "Johns Hopkins Medicine hospital logo" },
  { src: "mgh.png", alt: "Massachusetts General Hospital logo" },
  { src: "nyp.png", alt: "NewYork-Presbyterian hospital logo" },
  { src: "cleveland-clinic.png", alt: "Cleveland Clinic hospital logo" },
  { src: "cedars-sinai.png", alt: "Cedars Sinai Health System hospital logo" },
];

export default function SocialProof() {
  return (
    <section id="testimonials" className="bg-section py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* What physicians say */}
        <div>
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
                <footer className="mt-4 flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-border bg-border">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted">{t.title}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="/testimonials"
              className="inline-flex items-center gap-2 font-medium text-foreground underline hover:no-underline"
            >
              View all testimonials →
            </a>
          </div>
        </div>

        {/* Trusted by */}
        <div className="mt-16 border-t border-border pt-16">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-subtle">
            Trusted by residents and fellows at
          </h3>
          {HOSPITAL_LOGOS.length > 0 ? (
            <div className="mt-10 overflow-hidden">
              <div className="flex animate-scroll items-center gap-8 sm:gap-16">
                {[...HOSPITAL_LOGOS, ...HOSPITAL_LOGOS].map((logo, index) => {
                  const src = `/hospitals/${logo.src}`;
                  const isSvg = logo.src.endsWith(".svg");
                  return (
                    <div
                      key={`${logo.src}-${index}`}
                      className="relative flex h-16 w-36 shrink-0 items-center justify-center sm:h-20 sm:w-40"
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
