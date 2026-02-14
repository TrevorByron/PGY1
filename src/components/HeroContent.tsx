"use client";

import Image from "next/image";
import { useStyle } from "./StyleProvider";

const PHONE = "6094328862";
const PHONE_DISPLAY = "(609) 432-8862";

const COPY = {
  headline: "Disability insurance for residents and fellows",
  subhead:
    "Get a GSI policy with no medical exam. One denial elsewhere can lock you out. We help you secure the right coverage in about 1 minute.",
  cta: "Get your quote — 1 min, 100% private",
  cardTitle: "Not a big company — here's my mobile number.",
  preferText: "Prefer text? I'll respond quickly.",
};

export default function HeroContent() {
  const { style } = useStyle();

  if (style === "1") {
    return (
      <>
        <Image
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2080&q=80"
          alt="Medical resident walking in a hospital hallway"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-bg-overlay" />
        <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
          <div className="max-w-2xl text-hero-fg">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {COPY.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-hero-fg-muted sm:text-xl">
              {COPY.subhead}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#get-quote"
                className="inline-flex items-center justify-center rounded-full bg-cta-primary-bg px-8 py-4 text-base font-semibold text-cta-primary-fg shadow-lg transition hover:bg-cta-primary-hover"
              >
                {COPY.cta}
              </a>
            </div>
            <div className="mt-10 rounded-xl border border-hero-card-border bg-hero-card-bg p-4 backdrop-blur sm:p-5">
              <p className="text-sm font-medium text-hero-fg-muted">
                {COPY.cardTitle}
              </p>
              <a
                href={`tel:${PHONE}`}
                className="mt-2 inline-block text-xl font-semibold text-hero-fg hover:underline"
              >
                {PHONE_DISPLAY}
              </a>
              <a
                href={`sms:${PHONE}`}
                className="mt-1 block text-sm text-hero-fg-subtle hover:text-hero-fg"
              >
                {COPY.preferText}
              </a>
            </div>
          </div>
          <div className="mt-12 hidden lg:block lg:flex-1" />
        </div>
      </>
    );
  }

  if (style === "3") {
    return (
      <div className="relative min-h-[90vh] overflow-hidden">
        {/* Futuristic gradient background — no images */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, #050b14 0%, #0a1628 35%, #0d2137 60%, #0a1628 100%)",
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(33, 150, 243, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(33, 150, 243, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glow orbs */}
        <div
          className="absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #1E88E5 0%, transparent 70%)" }}
        />
        <div
          className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #64B5F6 0%, transparent 70%)" }}
        />
        {/* Content */}
        <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Image
              src="/logo-icon.png"
              alt=""
              width={120}
              height={120}
              className="mx-auto mb-6 h-20 w-20 object-contain sm:h-24 sm:w-24"
              aria-hidden
            />
            <h1 className="text-4xl font-bold tracking-tight text-hero-fg sm:text-5xl lg:text-6xl [text-shadow:0_0_40px_rgba(30,136,229,0.3)]">
              {COPY.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-hero-fg-muted sm:text-xl">
              {COPY.subhead}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#get-quote"
                className="inline-flex items-center justify-center rounded-lg bg-cta-primary-bg px-8 py-4 text-base font-semibold text-cta-primary-fg shadow-[0_0_24px_rgba(30,136,229,0.4)] transition hover:bg-cta-primary-hover hover:shadow-[0_0_32px_rgba(30,136,229,0.5)]"
              >
                {COPY.cta}
              </a>
            </div>
            <div className="mx-auto mt-10 max-w-md rounded-xl border border-hero-card-border bg-hero-card-bg p-4 backdrop-blur-sm sm:p-5">
              <p className="text-sm font-medium text-hero-fg-muted">
                {COPY.cardTitle}
              </p>
              <a
                href={`tel:${PHONE}`}
                className="mt-2 inline-block text-xl font-semibold text-hero-fg hover:underline"
              >
                {PHONE_DISPLAY}
              </a>
              <a
                href={`sms:${PHONE}`}
                className="mt-1 block text-sm text-hero-fg-subtle hover:text-hero-fg"
              >
                {COPY.preferText}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Style 2: illustrative, two-column layout (copy 2/3, illustration 1/3)
  return (
    <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
      <div className="flex-[2] text-hero-fg lg:min-w-0">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {COPY.headline}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-hero-fg-muted sm:text-xl">
          {COPY.subhead}
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="#get-quote"
            className="inline-flex items-center justify-center rounded-full bg-cta-primary-bg px-8 py-4 text-base font-semibold text-cta-primary-fg shadow-lg transition hover:bg-cta-primary-hover"
          >
            {COPY.cta}
          </a>
        </div>
        <div className="mt-10 rounded-xl border border-hero-card-border bg-hero-card-bg p-4 sm:p-5">
          <p className="text-sm font-medium text-hero-fg-muted">
            {COPY.cardTitle}
          </p>
          <a
            href={`tel:${PHONE}`}
            className="mt-2 inline-block text-xl font-semibold text-hero-fg hover:underline"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={`sms:${PHONE}`}
            className="mt-1 block text-sm text-hero-fg-subtle hover:text-hero-fg"
          >
            {COPY.preferText}
          </a>
        </div>
      </div>
      <div className="mt-12 flex flex-1 items-center justify-center lg:mt-0 lg:flex-[1]">
        <img
          src="/illustrations/online-doctor.svg"
          alt=""
          aria-hidden
          className="h-auto max-h-[320px] w-full max-w-md object-contain"
        />
      </div>
    </div>
  );
}
