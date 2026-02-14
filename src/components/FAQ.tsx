"use client";

import { useState } from "react";
import { useStyle } from "./StyleProvider";
import Style2Illustration from "./Style2Illustration";

const ITEMS = [
  {
    q: "What is GSI and why should I get it first?",
    a: "GSI (Guaranteed Standard Issue) is a disability policy offered at many residency and fellowship programs. It requires no medical exam and typically overlooks pre-existing conditions. If you apply for a medically underwritten policy first and get denied, you may no longer qualify for GSI. So we recommend securing GSI first if it's available at your institution.",
  },
  {
    q: "What does “own-occupation” mean?",
    a: "Own-occupation means you're considered disabled if you can't perform the duties of your specific medical specialty — not just “any job.” So if you're a surgeon and can't operate but could do other work, a true own-occupation policy still pays. It's the standard you want as a physician.",
  },
  {
    q: "How long does it take to get a policy?",
    a: "For GSI, the process can be very quick — often a matter of days once we confirm your eligibility. For fully underwritten policies, it typically takes a few weeks depending on the carrier and your application.",
  },
  {
    q: "Is my information private?",
    a: "Yes. We never sell your information. What you share is used only to provide quotes and service your policy. We take privacy seriously.",
  },
  {
    q: "Do I need a medical exam?",
    a: "GSI policies do not require a medical exam. Fully underwritten policies may require a paramed exam or medical records, depending on the carrier and your situation. We'll walk you through what's needed.",
  },
  {
    q: "How much does disability insurance cost for physicians?",
    a: "Cost depends on your age, specialty, benefit amount, and options. Residents and fellows often qualify for discounts. We'll show you side-by-side quotes so you can compare.",
  },
  {
    q: "When should residents get coverage?",
    a: "As early as possible in training. Locking in GSI (if available) and favorable rates when you're young and healthy protects you if your health changes later. Waiting can mean higher premiums or loss of GSI eligibility.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { style } = useStyle();

  if (style === "2") {
    return (
      <section id="faq" className="bg-section py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
            <div className="flex flex-1 justify-center lg:max-w-sm">
              <Style2Illustration
                id="cardiologist"
                className="h-auto max-h-[340px] w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Frequently asked questions
              </h2>
              <div className="mt-10 space-y-4">
                {ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-section-muted/50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-foreground hover:bg-surface-muted/80"
                    >
                      {item.q}
                      <span className="text-muted-subtle">
                        {openIndex === i ? "−" : "+"}
                      </span>
                    </button>
                    {openIndex === i && (
                      <div className="border-t border-border px-5 py-4 text-muted">
                        {item.a}
                      </div>
                    )}
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
    <section id="faq" className="bg-section py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-12 space-y-4">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-section-muted/50 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-foreground hover:bg-surface-muted/80"
              >
                {item.q}
                <span className="text-muted-subtle">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="border-t border-border px-5 py-4 text-muted">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
