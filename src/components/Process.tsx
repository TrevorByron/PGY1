"use client";

import Image from "next/image";
import { useStyle } from "./StyleProvider";
import Style2Illustration from "./Style2Illustration";

const steps = [
  {
    step: 1,
    title: "Take 1 min to provide basic info",
    description:
      "No in-depth medical exam. Just the essentials so we can understand your situation and see if a GSI or other policy fits.",
  },
  {
    step: 2,
    title: "We evaluate and work with you on quotes",
    description:
      "Our team finds the best provider for you and prepares side-by-side quotes. We answer your questions and explain options in plain language.",
  },
  {
    step: 3,
    title: "Get a policy before things get complicated",
    description:
      "Lock in coverage while you're eligible. We handle the paperwork so you can focus on training and your career.",
  },
];

export default function Process() {
  const { style } = useStyle();

  if (style === "1") {
    return (
      <section id="process" className="bg-section py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-2xl bg-border lg:block lg:max-w-md lg:flex-shrink-0">
              <Image
                src="/images/process-style1.png"
                alt="Medical professionals in an operating room"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-muted">
                Three simple steps from first contact to protected income.
              </p>
              <div className="mt-10 space-y-8">
                {steps.map(({ step, title, description }) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-fg">
                      {step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                      <p className="mt-2 text-muted">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === "2") {
    return (
      <section id="process" className="bg-section py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex flex-1 justify-center lg:max-w-sm">
              <Style2Illustration
                id="laboratory"
                className="h-auto max-h-[340px] w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-muted">
                Three simple steps from first contact to protected income.
              </p>
              <div className="mt-10 space-y-8">
                {steps.map(({ step, title, description }) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-fg">
                      {step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                      <p className="mt-2 text-muted">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="process" className="bg-section py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted">
          Three simple steps from first contact to protected income.
        </p>
        <div className="mt-16 grid gap-12 sm:grid-cols-3">
          {steps.map(({ step, title, description }) => (
            <div key={step} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-fg">
                {step}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
