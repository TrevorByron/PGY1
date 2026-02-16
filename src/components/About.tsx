"use client";

import Image from "next/image";
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
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border bg-border sm:h-20 sm:w-20">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe6axk5d3VT-TuaGqMsbe7wkL8iTgjVlHpw&s"
                    alt="Jay Weinberg"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  About Jay
                </h2>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Jay Weinberg, CLU, ChFC, connects disability insurance to doctors — especially residents and fellows — so you can protect your income before it&apos;s too late.
              </p>
              <p className="mt-4 text-muted">
                You get direct access, clear answers, and a process that fits your schedule. My goal is to help you secure the right coverage (including GSI when available) without the runaround.
              </p>
              <p className="mt-4 text-muted">
                PGY1 Financial Solutions Corp works with top carriers to compare quotes and find the best fit for your specialty and stage of training.
              </p>
              <a
                href="/quote"
                className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-fg transition hover:bg-accent-hover"
              >
                Take 2 mins to get a quote
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
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border bg-border sm:h-20 sm:w-20">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe6axk5d3VT-TuaGqMsbe7wkL8iTgjVlHpw&s"
                alt="Jay Weinberg"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              About Jay
            </h2>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Jay Weinberg, CLU, ChFC, connects disability insurance to doctors — especially residents and fellows — so you can protect your income before it&apos;s too late.
          </p>
          <p className="mt-4 text-muted">
            You get direct access, clear answers, and a process that fits your schedule. My goal is to help you secure the right coverage (including GSI when available) without the runaround.
          </p>
          <p className="mt-4 text-muted">
            PGY1 Financial Solutions Corp works with top carriers to compare quotes and find the best fit for your specialty and stage of training.
          </p>
          <a
            href="/quote"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-fg transition hover:bg-accent-hover"
          >
            Take 2 mins to get a quote
          </a>
        </div>
      </div>
    </section>
  );
}
