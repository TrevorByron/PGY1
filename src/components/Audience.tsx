"use client";

import { useState } from "react";
import { useStyle } from "./StyleProvider";
import Style2Illustration from "./Style2Illustration";

export default function Audience() {
  const [active, setActive] = useState<"residents" | "attendings">("residents");
  const { style } = useStyle();

  if (style === "1") {
    return (
      <section className="bg-section-muted py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for your stage
              </h2>
              <p className="mt-4 text-lg text-muted">
                We focus on residents and fellows — and help attendings lock in or grow coverage.
              </p>
              <div className="mt-8 flex gap-2" role="tablist" aria-label="Audience">
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === "residents"}
                  onClick={() => setActive("residents")}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    active === "residents"
                      ? "bg-accent text-accent-fg"
                      : "bg-surface text-muted shadow-sm hover:bg-surface-muted"
                  }`}
                >
                  Residents & Fellows
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === "attendings"}
                  onClick={() => setActive("attendings")}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    active === "attendings"
                      ? "bg-accent text-accent-fg"
                      : "bg-surface text-muted shadow-sm hover:bg-surface-muted"
                  }`}
                >
                  Attendings
                </button>
              </div>
              {active === "residents" && (
                <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm" role="tabpanel" aria-label="For Residents and Fellows">
                  <h3 className="text-xl font-semibold text-foreground">For Residents & Fellows</h3>
                  <p className="mt-4 leading-relaxed text-muted">
                    Get a <strong>GSI (Guaranteed Standard Issue)</strong> policy before applying elsewhere. GSI requires no medical exam and overlooks pre-existing conditions — but if you&apos;ve already been denied disability insurance, you may no longer qualify for GSI at your institution.
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">
                    Lock in coverage now. Don&apos;t risk a denial elsewhere first. We&apos;ll check if a GSI is available at your program and walk you through the best path.
                  </p>
                  <ul className="mt-6 list-inside list-disc space-y-2 leading-relaxed text-muted">
                    <li>No medical exam for GSI</li>
                    <li>Pre-existing conditions typically covered</li>
                    <li>Rates and discounts locked in during training</li>
                  </ul>
                </div>
              )}
              {active === "attendings" && (
                <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm" role="tabpanel" aria-label="For Attendings">
                  <h3 className="text-xl font-semibold text-foreground">For Attendings</h3>
                  <p className="mt-4 leading-relaxed text-muted">
                    We help practicing physicians compare and secure true own-occupation disability coverage. As your income grows, we work with you to increase benefits and keep your policy aligned with your career.
                  </p>
                  <ul className="mt-6 list-inside list-disc space-y-2 leading-relaxed text-muted">
                    <li>True own-occupation policies</li>
                    <li>Quotes from top carriers</li>
                    <li>Future increase options as you earn more</li>
                  </ul>
                </div>
              )}
          </div>
        </div>
      </section>
    );
  }

  if (style === "2") {
    return (
      <section className="bg-section-muted py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex flex-1 justify-center lg:max-w-sm">
              <Style2Illustration
                id="gynecology-consultation"
                className="h-auto max-h-[340px] w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for your stage
              </h2>
              <p className="mt-4 text-lg text-muted">
                We focus on residents and fellows — and help attendings lock in or grow coverage.
              </p>
              <div className="mt-8 flex gap-2" role="tablist" aria-label="Audience">
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === "residents"}
                  onClick={() => setActive("residents")}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    active === "residents"
                      ? "bg-accent text-accent-fg"
                      : "bg-surface text-muted shadow-sm hover:bg-surface-muted"
                  }`}
                >
                  Residents & Fellows
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === "attendings"}
                  onClick={() => setActive("attendings")}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    active === "attendings"
                      ? "bg-accent text-accent-fg"
                      : "bg-surface text-muted shadow-sm hover:bg-surface-muted"
                  }`}
                >
                  Attendings
                </button>
              </div>
              {active === "residents" && (
                <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm" role="tabpanel" aria-label="For Residents and Fellows">
                  <h3 className="text-xl font-semibold text-foreground">For Residents & Fellows</h3>
                  <p className="mt-4 leading-relaxed text-muted">
                    Get a <strong>GSI (Guaranteed Standard Issue)</strong> policy before applying elsewhere. GSI requires no medical exam and overlooks pre-existing conditions — but if you&apos;ve already been denied disability insurance, you may no longer qualify for GSI at your institution.
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">
                    Lock in coverage now. Don&apos;t risk a denial elsewhere first. We&apos;ll check if a GSI is available at your program and walk you through the best path.
                  </p>
                  <ul className="mt-6 list-inside list-disc space-y-2 leading-relaxed text-muted">
                    <li>No medical exam for GSI</li>
                    <li>Pre-existing conditions typically covered</li>
                    <li>Rates and discounts locked in during training</li>
                  </ul>
                </div>
              )}
              {active === "attendings" && (
                <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm" role="tabpanel" aria-label="For Attendings">
                  <h3 className="text-xl font-semibold text-foreground">For Attendings</h3>
                  <p className="mt-4 leading-relaxed text-muted">
                    We help practicing physicians compare and secure true own-occupation disability coverage. As your income grows, we work with you to increase benefits and keep your policy aligned with your career.
                  </p>
                  <ul className="mt-6 list-inside list-disc space-y-2 leading-relaxed text-muted">
                    <li>True own-occupation policies</li>
                    <li>Quotes from top carriers</li>
                    <li>Future increase options as you earn more</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-section-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Built for your stage
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted">
          We focus on residents and fellows — and help attendings lock in or grow coverage.
        </p>

        <div className="mt-12 flex justify-center gap-2" role="tablist" aria-label="Audience">
          <button
            type="button"
            role="tab"
            aria-selected={active === "residents"}
            onClick={() => setActive("residents")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
              active === "residents"
                ? "bg-accent text-accent-fg"
                : "bg-surface text-muted shadow-sm hover:bg-surface-muted"
            }`}
          >
            Residents & Fellows
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={active === "attendings"}
            onClick={() => setActive("attendings")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
              active === "attendings"
                ? "bg-accent text-accent-fg"
                : "bg-surface text-muted shadow-sm hover:bg-surface-muted"
            }`}
          >
            Attendings
          </button>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          {active === "residents" && (
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm" role="tabpanel">
              <h3 className="text-xl font-semibold text-foreground">
                For Residents & Fellows
              </h3>
              <p className="mt-4 leading-relaxed text-muted">
                Get a <strong>GSI (Guaranteed Standard Issue)</strong> policy before applying elsewhere. GSI requires no medical exam and overlooks pre-existing conditions — but if you&apos;ve already been denied disability insurance, you may no longer qualify for GSI at your institution.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Lock in coverage now. Don&apos;t risk a denial elsewhere first. We&apos;ll check if a GSI is available at your program and walk you through the best path.
              </p>
              <ul className="mt-6 list-inside list-disc space-y-2 leading-relaxed text-muted">
                <li>No medical exam for GSI</li>
                <li>Pre-existing conditions typically covered</li>
                <li>Rates and discounts locked in during training</li>
              </ul>
            </div>
          )}
          {active === "attendings" && (
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm" role="tabpanel">
              <h3 className="text-xl font-semibold text-foreground">
                For Attendings
              </h3>
              <p className="mt-4 leading-relaxed text-muted">
                We help practicing physicians compare and secure true own-occupation disability coverage. As your income grows, we work with you to increase benefits and keep your policy aligned with your career.
              </p>
              <ul className="mt-6 list-inside list-disc space-y-2 leading-relaxed text-muted">
                <li>True own-occupation policies</li>
                <li>Quotes from top carriers</li>
                <li>Future increase options as you earn more</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
