"use client";

import { useStyle } from "./StyleProvider";
import Style2Illustration from "./Style2Illustration";

export default function About() {
  const { style } = useStyle();

  if (style === "2") {
    return (
      <section id="about" className="bg-section-muted py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-center lg:gap-16">
            <div className="flex flex-1 justify-center lg:max-w-md">
              <Style2Illustration
                id="doctor"
                className="h-auto max-h-[380px] w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                About Jay
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Jay Weinberg, CLU, ChFC, connects disability insurance to doctors — especially residents and fellows — so you can protect your income before it&apos;s too late.
              </p>
              <p className="mt-4 text-muted">
                We&apos;re not a big company. You get direct access, clear answers, and a process that fits your schedule. Our goal is to help you secure the right coverage (including GSI when available) without the runaround.
              </p>
              <p className="mt-4 text-muted">
                PGY1 Financial Solutions Corp works with top carriers to compare quotes and find the best fit for your specialty and stage of training.
              </p>
              <a
                href="#get-quote"
                className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-fg transition hover:bg-accent-hover"
              >
                Get your quote
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="bg-section-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About Jay
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Jay Weinberg, CLU, ChFC, connects disability insurance to doctors — especially residents and fellows — so you can protect your income before it&apos;s too late.
          </p>
          <p className="mt-4 text-muted">
            We&apos;re not a big company. You get direct access, clear answers, and a process that fits your schedule. Our goal is to help you secure the right coverage (including GSI when available) without the runaround.
          </p>
          <p className="mt-4 text-muted">
            PGY1 Financial Solutions Corp works with top carriers to compare quotes and find the best fit for your specialty and stage of training.
          </p>
          <a
            href="#get-quote"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-fg transition hover:bg-accent-hover"
          >
            Get your quote
          </a>
        </div>
      </div>
    </section>
  );
}
