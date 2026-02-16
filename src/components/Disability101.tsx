"use client";

import Link from "next/link";
import { useStyle } from "./StyleProvider";
import Style2Illustration from "./Style2Illustration";

export default function Disability101() {
  const { style } = useStyle();

  if (style === "2") {
    return (
      <section className="bg-section py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-center lg:gap-16">
            <div className="flex flex-1 justify-center lg:max-w-sm">
              <Style2Illustration
                id="hospital-wheelchair"
                className="h-auto max-h-[340px] w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Disability insurance 101
              </h2>
              <p className="mt-4 text-lg text-muted">
                Quick basics so you know what you&apos;re buying.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-1">
                <div className="rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground">Own-occupation</h3>
                  <p className="mt-2 text-muted">
                    You&apos;re disabled if you can&apos;t do your specific job (e.g. your specialty), not just &quot;any&quot; job. Essential for physicians.
                  </p>
                </div>
                <div className="rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground">GSI (Guaranteed Standard Issue)</h3>
                  <p className="mt-2 text-muted">
                    No medical exam, no health questions. Often available only to residents/fellows at select programs. Get it before applying elsewhere.
                  </p>
                </div>
                <div className="rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground">Why act now</h3>
                  <p className="mt-2 text-muted">
                    Lock in rates and GSI eligibility while you&apos;re in training. One denial on another application can cost you GSI.
                  </p>
                </div>
              </div>
              <p className="mt-8">
                <Link
                  href="/disability-101"
                  className="font-medium text-foreground underline hover:no-underline"
                >
                  Read more in Disability 101 →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-section py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Disability insurance 101
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted">
          Quick basics so you know what you&apos;re buying.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Own-occupation
            </h3>
            <p className="mt-2 text-muted">
              You&apos;re disabled if you can&apos;t do your specific job (e.g. your specialty), not just "any" job. Essential for physicians.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground">
              GSI (Guaranteed Standard Issue)
            </h3>
            <p className="mt-2 text-muted">
              No medical exam, no health questions. Often available only to residents/fellows at select programs. Get it before applying elsewhere.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Why act now
            </h3>
            <p className="mt-2 text-muted">
              Lock in rates and GSI eligibility while you&apos;re in training. One denial on another application can cost you GSI.
            </p>
          </div>
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/disability-101"
            className="font-medium text-foreground underline hover:no-underline"
          >
            Read more in Disability 101 →
          </Link>
        </p>
      </div>
    </section>
  );
}
